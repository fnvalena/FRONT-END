<?php
require_once 'verificar_admin.php';
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

function responder($ok, $mensaje = '', $datos = [])
{
    echo json_encode(array_merge(['ok' => $ok, 'mensaje' => $mensaje], $datos));
    exit;
}

function columna_existe($conexion, $tabla, $columna)
{
    $stmt = $conexion->prepare(
        "SELECT COUNT(*) AS total
         FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?"
    );
    $stmt->bind_param('ss', $tabla, $columna);
    $stmt->execute();
    $resultado = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return (int)($resultado['total'] ?? 0) > 0;
}

function asegurar_trazabilidad_propiedades($conexion)
{
    if (!columna_existe($conexion, 'propiedades', 'id_gestor')) {
        $conexion->query("ALTER TABLE propiedades ADD id_gestor INT NULL AFTER piscina");
    }

    if (!columna_existe($conexion, 'propiedades', 'estado_gestion')) {
        $conexion->query(
            "ALTER TABLE propiedades
             ADD estado_gestion ENUM('sin_asignar','asignada','en_gestion','publicada','pausada')
             NOT NULL DEFAULT 'sin_asignar' AFTER id_gestor"
        );
    }

    if (!columna_existe($conexion, 'propiedades', 'fecha_asignacion')) {
        $conexion->query("ALTER TABLE propiedades ADD fecha_asignacion DATETIME NULL AFTER estado_gestion");
    }
}

asegurar_trazabilidad_propiedades($conexion);

function propiedad_desde_post()
{
    return [
        'tipo' => trim($_POST['tipo'] ?? ''),
        'fecha_publicacion' => trim($_POST['fecha-publicacion'] ?? ''),
        'provincia' => trim($_POST['provincia'] ?? ''),
        'comuna' => trim($_POST['comuna'] ?? ''),
        'sector' => trim($_POST['sector'] ?? ''),
        'dormitorios' => (int)($_POST['dormitorios'] ?? 0),
        'banos' => (int)($_POST['banos'] ?? 0),
        'area_total' => (float)($_POST['area-total'] ?? 0),
        'area_construida' => (float)($_POST['area-construida'] ?? 0),
        'precio_clp' => (float)($_POST['precio'] ?? 0),
        'precio_uf' => (float)($_POST['precioUF'] ?? 0),
        'descripcion' => trim($_POST['descripcion'] ?? ''),
        'visita' => trim($_POST['visita'] ?? ''),
        'bodega' => trim($_POST['bodega'] ?? ''),
        'estacionamiento' => (int)($_POST['estacionamiento'] ?? 0),
        'logia' => (int)($_POST['logia'] ?? 0),
        'cocina_amoblada' => (int)($_POST['cocina-amoblada'] ?? 0),
        'antejardin' => (int)($_POST['antejardin'] ?? 0),
        'patio_trasero' => (int)($_POST['patio-trasero'] ?? 0),
        'piscina' => (int)($_POST['piscina'] ?? 0)
    ];
}

function validar_propiedad($propiedad)
{
    $errores = [];

    if ($propiedad['tipo'] === '') $errores[] = 'Tipo de propiedad es obligatorio.';
    if ($propiedad['fecha_publicacion'] === '') $errores[] = 'Fecha de publicacion es obligatoria.';
    if ($propiedad['provincia'] === '') $errores[] = 'Provincia es obligatoria.';
    if ($propiedad['comuna'] === '') $errores[] = 'Comuna es obligatoria.';
    if ($propiedad['sector'] === '') $errores[] = 'Sector es obligatorio.';
    if ($propiedad['descripcion'] === '') $errores[] = 'Descripcion es obligatoria.';
    if ($propiedad['visita'] === '') $errores[] = 'Debes indicar si permite solicitar visita.';
    if ($propiedad['bodega'] === '') $errores[] = 'Debes indicar si cuenta con bodega.';
    if ($propiedad['precio_clp'] <= 0) $errores[] = 'Precio en CLP debe ser mayor a 0.';
    if ($propiedad['precio_uf'] <= 0) $errores[] = 'Precio en UF debe ser mayor a 0.';

    return $errores;
}

function guardar_fotos($conexion, $idPropiedad)
{
    if (empty($_FILES['fotos']['name'][0])) {
        return;
    }

    $totalFotos = min(count($_FILES['fotos']['name']), 10);
    $directorioDestino = __DIR__ . '/img/propiedades/' . $idPropiedad . '/';

    if (!is_dir($directorioDestino)) {
        mkdir($directorioDestino, 0755, true);
    }

    $stmtGaleria = $conexion->prepare(
        "INSERT INTO galeria_propiedad (id_propiedad, ruta_imagen, es_principal, orden) VALUES (?,?,?,?)"
    );

    $resultado = $conexion->query("SELECT COUNT(*) AS total FROM galeria_propiedad WHERE id_propiedad = " . (int)$idPropiedad);
    $cantidadActual = (int)($resultado->fetch_assoc()['total'] ?? 0);

    for ($i = 0; $i < $totalFotos && ($cantidadActual + $i) < 10; $i++) {
        if ($_FILES['fotos']['error'][$i] !== UPLOAD_ERR_OK) {
            continue;
        }

        $nombreOriginal = basename($_FILES['fotos']['name'][$i]);
        $extension = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));

        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
            continue;
        }

        $orden = $cantidadActual + $i;
        $nombreFinal = 'foto_' . ($orden + 1) . '_' . time() . '.' . $extension;
        $rutaFinal = $directorioDestino . $nombreFinal;

        if (move_uploaded_file($_FILES['fotos']['tmp_name'][$i], $rutaFinal)) {
            $esPrincipal = ($orden === 0) ? 1 : 0;
            $rutaRelativa = 'img/propiedades/' . $idPropiedad . '/' . $nombreFinal;
            $stmtGaleria->bind_param('isii', $idPropiedad, $rutaRelativa, $esPrincipal, $orden);
            $stmtGaleria->execute();
        }
    }

    $stmtGaleria->close();
}

function listar_propiedades($conexion)
{
    $sql = "SELECT p.*, g.ruta_imagen AS foto,
                   ge.nombre AS gestor_nombre, ge.correo AS gestor_correo
            FROM propiedades p
            LEFT JOIN galeria_propiedad g ON g.id_propiedad = p.id AND g.es_principal = 1
            LEFT JOIN gestores ge ON ge.id = p.id_gestor
            ORDER BY p.id DESC";

    $resultado = $conexion->query($sql);
    $propiedades = [];

    while ($fila = $resultado->fetch_assoc()) {
        $propiedades[] = $fila;
    }

    responder(true, '', ['propiedades' => $propiedades]);
}

function obtener_propiedad($conexion)
{
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) responder(false, 'ID de propiedad invalido.');

    $stmt = $conexion->prepare("SELECT * FROM propiedades WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 0) responder(false, 'No se encontro la propiedad.');

    responder(true, '', ['propiedad' => $resultado->fetch_assoc()]);
}

function crear_propiedad($conexion)
{
    $propiedad = propiedad_desde_post();
    $errores = validar_propiedad($propiedad);

    if (empty($_FILES['fotos']['name'][0])) {
        $errores[] = 'Debes adjuntar al menos 1 fotografia.';
    } elseif (count($_FILES['fotos']['name']) > 10) {
        $errores[] = 'Maximo 10 fotografias permitidas.';
    }

    if (!empty($errores)) responder(false, 'Existen errores de validacion.', ['errores' => $errores]);

    $sql = "INSERT INTO propiedades
        (tipo, fecha_publicacion, provincia, comuna, sector, dormitorios, banos,
         area_total, area_construida, precio_clp, precio_uf, descripcion, visita,
         bodega, estacionamiento, logia, cocina_amoblada, antejardin, patio_trasero, piscina,
         fecha_creacion)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, NOW())";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param(
        'sssssiiddddsssiiiiii',
        $propiedad['tipo'], $propiedad['fecha_publicacion'], $propiedad['provincia'],
        $propiedad['comuna'], $propiedad['sector'], $propiedad['dormitorios'],
        $propiedad['banos'], $propiedad['area_total'], $propiedad['area_construida'],
        $propiedad['precio_clp'], $propiedad['precio_uf'], $propiedad['descripcion'],
        $propiedad['visita'], $propiedad['bodega'], $propiedad['estacionamiento'],
        $propiedad['logia'], $propiedad['cocina_amoblada'], $propiedad['antejardin'],
        $propiedad['patio_trasero'], $propiedad['piscina']
    );

    if (!$stmt->execute()) responder(false, 'Error al guardar la propiedad.');

    $idPropiedad = $conexion->insert_id;
    guardar_fotos($conexion, $idPropiedad);
    responder(true, 'Propiedad creada correctamente.', ['id_propiedad' => $idPropiedad]);
}

function actualizar_propiedad($conexion)
{
    $id = (int)($_POST['id'] ?? 0);
    if ($id <= 0) responder(false, 'ID de propiedad invalido.');

    $propiedad = propiedad_desde_post();
    $errores = validar_propiedad($propiedad);

    if (!empty($_FILES['fotos']['name'][0]) && count($_FILES['fotos']['name']) > 10) {
        $errores[] = 'Maximo 10 fotografias permitidas.';
    }

    if (!empty($errores)) responder(false, 'Existen errores de validacion.', ['errores' => $errores]);

    $sql = "UPDATE propiedades SET
        tipo = ?, fecha_publicacion = ?, provincia = ?, comuna = ?, sector = ?,
        dormitorios = ?, banos = ?, area_total = ?, area_construida = ?,
        precio_clp = ?, precio_uf = ?, descripcion = ?, visita = ?, bodega = ?,
        estacionamiento = ?, logia = ?, cocina_amoblada = ?, antejardin = ?,
        patio_trasero = ?, piscina = ?
        WHERE id = ?";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param(
        'sssssiiddddsssiiiiiii',
        $propiedad['tipo'], $propiedad['fecha_publicacion'], $propiedad['provincia'],
        $propiedad['comuna'], $propiedad['sector'], $propiedad['dormitorios'],
        $propiedad['banos'], $propiedad['area_total'], $propiedad['area_construida'],
        $propiedad['precio_clp'], $propiedad['precio_uf'], $propiedad['descripcion'],
        $propiedad['visita'], $propiedad['bodega'], $propiedad['estacionamiento'],
        $propiedad['logia'], $propiedad['cocina_amoblada'], $propiedad['antejardin'],
        $propiedad['patio_trasero'], $propiedad['piscina'], $id
    );

    if (!$stmt->execute()) responder(false, 'Error al actualizar la propiedad.');

    guardar_fotos($conexion, $id);
    responder(true, 'Propiedad actualizada correctamente.');
}

function eliminar_propiedad($conexion)
{
    $id = (int)($_POST['id'] ?? 0);
    if ($id <= 0) responder(false, 'ID de propiedad invalido.');

    $stmt = $conexion->prepare("DELETE FROM propiedades WHERE id = ?");
    $stmt->bind_param('i', $id);

    if (!$stmt->execute()) responder(false, 'Error al eliminar la propiedad.');

    responder(true, 'Propiedad eliminada correctamente.');
}

function asignar_gestor_propiedad($conexion)
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        responder(false, 'Metodo no permitido.');
    }

    $idPropiedad = (int)($_POST['id'] ?? 0);
    $idGestor = (int)($_POST['id_gestor'] ?? 0);

    if ($idPropiedad <= 0) {
        responder(false, 'ID de propiedad invalido.');
    }

    if ($idGestor <= 0) {
        $stmt = $conexion->prepare(
            "UPDATE propiedades
             SET id_gestor = NULL, estado_gestion = 'sin_asignar', fecha_asignacion = NULL
             WHERE id = ?"
        );
        $stmt->bind_param('i', $idPropiedad);
    } else {
        $stmtGestor = $conexion->prepare("SELECT id FROM gestores WHERE id = ? AND estado = 'aprobado'");
        $stmtGestor->bind_param('i', $idGestor);
        $stmtGestor->execute();
        $resultadoGestor = $stmtGestor->get_result();
        $stmtGestor->close();

        if ($resultadoGestor->num_rows === 0) {
            responder(false, 'El gestor seleccionado no esta aprobado.');
        }

        $stmt = $conexion->prepare(
            "UPDATE propiedades
             SET id_gestor = ?, estado_gestion = 'asignada', fecha_asignacion = NOW()
             WHERE id = ?"
        );
        $stmt->bind_param('ii', $idGestor, $idPropiedad);
    }

    if (!$stmt->execute()) {
        responder(false, 'No se pudo asignar el gestor a la propiedad.');
    }

    responder(true, 'Asignacion de propiedad actualizada.');
}

$accion = $_GET['accion'] ?? $_POST['accion'] ?? 'listar';

switch ($accion) {
    case 'listar':
        listar_propiedades($conexion);
        break;
    case 'obtener':
        obtener_propiedad($conexion);
        break;
    case 'crear':
        crear_propiedad($conexion);
        break;
    case 'actualizar':
        actualizar_propiedad($conexion);
        break;
    case 'eliminar':
        eliminar_propiedad($conexion);
        break;
    case 'asignar_gestor':
        asignar_gestor_propiedad($conexion);
        break;
    default:
        responder(false, 'Accion no reconocida.');
}
