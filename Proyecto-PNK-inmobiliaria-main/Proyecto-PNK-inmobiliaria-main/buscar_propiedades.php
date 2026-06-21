<?php
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

$provincia = trim($_GET['provincia'] ?? '');
$comuna = trim($_GET['comuna'] ?? '');
$sector = trim($_GET['sector'] ?? '');
$tipo = trim($_GET['tipo'] ?? '');

$condiciones = [];
$tipos = '';
$valores = [];

if ($provincia !== '') {
    $condiciones[] = 'p.provincia = ?';
    $tipos .= 's';
    $valores[] = $provincia;
}

if ($tipo !== '') {
    $condiciones[] = 'p.tipo = ?';
    $tipos .= 's';
    $valores[] = $tipo;
}

if ($comuna !== '') {
    $condiciones[] = 'p.comuna = ?';
    $tipos .= 's';
    $valores[] = $comuna;
}

if ($sector !== '') {
    $condiciones[] = 'p.sector LIKE ?';
    $tipos .= 's';
    $valores[] = '%' . $sector . '%';
}

$sql = "SELECT p.id, p.tipo, p.descripcion, p.provincia, p.comuna, p.sector,
               p.dormitorios, p.banos, p.area_total, p.precio_clp, p.precio_uf,
               g.ruta_imagen AS foto
        FROM propiedades p
        LEFT JOIN galeria_propiedad g ON g.id_propiedad = p.id AND g.es_principal = 1";

if (!empty($condiciones)) {
    $sql .= ' WHERE ' . implode(' AND ', $condiciones);
}

$sql .= ' ORDER BY p.id DESC LIMIT 20';

$stmt = $conexion->prepare($sql);

if ($tipos !== '') {
    $referencias = [];
    foreach ($valores as $indice => $valor) {
        $referencias[$indice] = &$valores[$indice];
    }
    $stmt->bind_param($tipos, ...$referencias);
}

$stmt->execute();
$resultado = $stmt->get_result();
$propiedades = [];

while ($fila = $resultado->fetch_assoc()) {
    $propiedades[] = $fila;
}

echo json_encode(['ok' => true, 'propiedades' => $propiedades]);

$stmt->close();
$conexion->close();
