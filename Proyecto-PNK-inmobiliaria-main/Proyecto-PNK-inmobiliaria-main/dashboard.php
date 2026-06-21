<?php
require_once 'verificar_sesion.php';

$rol = $_SESSION['rol'] ?? '';

if ($rol === 'administrador') {
    header('Location: administracion.php');
    exit;
}

if ($rol === 'propietario') {
    header('Location: panel_propietario.php');
    exit;
}

header('Location: error_sesion.html');
exit;
