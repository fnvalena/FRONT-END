<?php
require_once 'verificar_admin.php';
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

function responder_solicitudes($ok, $mensaje = '', $datos = [])
{
    echo json_encode(array_merge(['ok' => $ok, 'mensaje' => $mensaje], $datos));
    exit;
}

function asegurar_tabla_solicitudes($conexion)
{
    $sql = "CREATE TABLE IF NOT EXISTS solicitudes_visita (
        id INT NOT NULL AUTO_INCREMENT,
        id_propiedad INT NULL,
        codigo_propiedad VARCHAR(30) NULL,
        titulo_propiedad VARCHAR(180) NOT NULL,
        nombre_interesado VARCHAR(150) NOT NULL,
        correo_interesado VARCHAR(150) NOT NULL,
        telefono_interesado VARCHAR(20) NOT NULL,
        mensaje TEXT NULL,
        estado ENUM('pendiente','contactado','coordinada','cerrada','rechazada') NOT NULL DEFAULT 'pendiente',
        fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion DATETIME NULL,
        PRIMARY KEY (id),
        KEY idx_estado (estado),
        KEY idx_correo_interesado (correo_interesado),
        KEY idx_propiedad (id_propiedad)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    $conexion->query($sql);
}

asegurar_tabla_solicitudes($conexion);

$accion = $_GET['accion'] ?? $_POST['accion'] ?? 'listar';

if ($accion === 'listar') {
    $resultado = $conexion->query(
        "SELECT id, id_propiedad, codigo_propiedad, titulo_propiedad, nombre_interesado,
                correo_interesado, telefono_interesado, mensaje, estado, fecha_solicitud
         FROM solicitudes_visita
         ORDER BY fecha_solicitud DESC"
    );

    $solicitudes = [];

    while ($fila = $resultado->fetch_assoc()) {
        $solicitudes[] = $fila;
    }

    responder_solicitudes(true, '', ['solicitudes' => $solicitudes]);
}

if ($accion === 'actualizar_estado') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        responder_solicitudes(false, 'Metodo no permitido.');
    }

    $id = (int)($_POST['id'] ?? 0);
    $estado = $_POST['estado'] ?? '';
    $estadosPermitidos = ['pendiente', 'contactado', 'coordinada', 'cerrada', 'rechazada'];

    if ($id <= 0 || !in_array($estado, $estadosPermitidos, true)) {
        responder_solicitudes(false, 'Datos de solicitud invalidos.');
    }

    $stmt = $conexion->prepare(
        "UPDATE solicitudes_visita
         SET estado = ?, fecha_actualizacion = NOW()
         WHERE id = ?"
    );
    $stmt->bind_param('si', $estado, $id);

    if (!$stmt->execute()) {
        responder_solicitudes(false, 'No se pudo actualizar la solicitud.');
    }

    responder_solicitudes(true, 'Estado de solicitud actualizado.');
}

if ($accion === 'eliminar') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        responder_solicitudes(false, 'Metodo no permitido.');
    }

    $id = (int)($_POST['id'] ?? 0);

    if ($id <= 0) {
        responder_solicitudes(false, 'ID de solicitud invalido.');
    }

    $stmt = $conexion->prepare("DELETE FROM solicitudes_visita WHERE id = ?");
    $stmt->bind_param('i', $id);

    if (!$stmt->execute()) {
        responder_solicitudes(false, 'No se pudo eliminar la solicitud.');
    }

    responder_solicitudes(true, 'Solicitud eliminada correctamente.');
}

responder_solicitudes(false, 'Accion no reconocida.');
