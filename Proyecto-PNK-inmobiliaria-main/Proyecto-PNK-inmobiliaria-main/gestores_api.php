<?php
require_once 'verificar_admin.php';
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

function responder_gestores($ok, $mensaje = '', $datos = [])
{
    echo json_encode(array_merge(['ok' => $ok, 'mensaje' => $mensaje], $datos));
    exit;
}

$accion = $_GET['accion'] ?? $_POST['accion'] ?? 'listar';

if ($accion === 'listar') {
    $resultado = $conexion->query(
        "SELECT id, rut, nombre, fecha_nacimiento, correo, sexo, telefono,
                certificado_pdf, estado, fecha_postulacion
         FROM gestores
         ORDER BY fecha_postulacion DESC"
    );

    $gestores = [];

    while ($fila = $resultado->fetch_assoc()) {
        $gestores[] = $fila;
    }

    responder_gestores(true, '', ['gestores' => $gestores]);
}

if ($accion === 'actualizar_estado') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        responder_gestores(false, 'Metodo no permitido.');
    }

    $idGestor = (int)($_POST['id_gestor'] ?? 0);
    $estado = $_POST['estado'] ?? '';
    $estadosPermitidos = ['pendiente', 'aprobado', 'rechazado'];

    if ($idGestor <= 0 || !in_array($estado, $estadosPermitidos, true)) {
        responder_gestores(false, 'Datos de gestor invalidos.');
    }

    $stmt = $conexion->prepare("UPDATE gestores SET estado = ? WHERE id = ?");
    $stmt->bind_param('si', $estado, $idGestor);

    if (!$stmt->execute()) {
        responder_gestores(false, 'No se pudo actualizar el estado del gestor.');
    }

    responder_gestores(true, 'Estado del gestor actualizado correctamente.');
}

if ($accion === 'eliminar') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        responder_gestores(false, 'Metodo no permitido.');
    }

    $idGestor = (int)($_POST['id_gestor'] ?? 0);

    if ($idGestor <= 0) {
        responder_gestores(false, 'ID de gestor invalido.');
    }

    $stmt = $conexion->prepare("DELETE FROM gestores WHERE id = ?");
    $stmt->bind_param('i', $idGestor);

    if (!$stmt->execute()) {
        responder_gestores(false, 'No se pudo eliminar la postulacion del gestor.');
    }

    responder_gestores(true, 'Gestor eliminado correctamente.');
}

responder_gestores(false, 'Accion no reconocida.');
