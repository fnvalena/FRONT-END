<?php
require_once 'verificar_admin.php';
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

function responder_propietarios($ok, $mensaje = '', $datos = [])
{
    echo json_encode(array_merge(['ok' => $ok, 'mensaje' => $mensaje], $datos));
    exit;
}

if (($_SESSION['rol'] ?? '') !== 'administrador') {
    responder_propietarios(false, 'No tienes permisos para realizar esta accion.');
}

$accion = $_GET['accion'] ?? $_POST['accion'] ?? 'listar';

if ($accion === 'listar' || $accion === 'listar_pendientes') {
    $sql = "SELECT id, rut, nombre, fecha_nacimiento, correo, telefono, numero_propiedad, estado, fecha_registro
            FROM propietarios
            ORDER BY fecha_registro DESC";

    if ($accion === 'listar_pendientes') {
        $sql = "SELECT id, rut, nombre, fecha_nacimiento, correo, telefono, numero_propiedad, estado, fecha_registro
                FROM propietarios
                WHERE estado = 'pendiente'
                ORDER BY fecha_registro DESC";
    }

    $resultado = $conexion->query($sql);
    $propietarios = [];

    while ($fila = $resultado->fetch_assoc()) {
        $propietarios[] = $fila;
    }

    responder_propietarios(true, '', ['propietarios' => $propietarios]);
}

if ($accion === 'activar') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        responder_propietarios(false, 'Metodo no permitido.');
    }

    $idPropietario = (int)($_POST['id_propietario'] ?? 0);

    if ($idPropietario <= 0) {
        responder_propietarios(false, 'ID de propietario invalido.');
    }

    $stmt = $conexion->prepare("UPDATE propietarios SET estado = 'activo' WHERE id = ? AND estado = 'pendiente'");
    $stmt->bind_param('i', $idPropietario);

    if (!$stmt->execute()) {
        responder_propietarios(false, 'No se pudo activar la cuenta.');
    }

    if ($stmt->affected_rows === 0) {
        responder_propietarios(false, 'La cuenta no existe o ya fue activada.');
    }

    responder_propietarios(true, 'Propietario activado correctamente.');
}

if ($accion === 'eliminar') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        responder_propietarios(false, 'Metodo no permitido.');
    }

    $idPropietario = (int)($_POST['id_propietario'] ?? 0);

    if ($idPropietario <= 0) {
        responder_propietarios(false, 'ID de propietario invalido.');
    }

    $stmt = $conexion->prepare("DELETE FROM propietarios WHERE id = ?");
    $stmt->bind_param('i', $idPropietario);

    if (!$stmt->execute()) {
        responder_propietarios(false, 'No se pudo eliminar la cuenta.');
    }

    if ($stmt->affected_rows === 0) {
        responder_propietarios(false, 'La cuenta no existe o ya fue eliminada.');
    }

    responder_propietarios(true, 'Propietario eliminado correctamente.');
}

responder_propietarios(false, 'Accion no reconocida.');
