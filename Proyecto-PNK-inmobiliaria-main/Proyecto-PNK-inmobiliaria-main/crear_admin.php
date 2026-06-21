<?php
require_once 'conexion.php';

//CREACION DE ADMIN
$nombre   = 'Administrador';
$correo   = 'admin@pnkinmobiliaria.cl';
$password = 'Admin123.';   
$rol      = 'administrador';
$estado   = 'activo';

// ENCRIPTACION DE CONTRASEÑA
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// REVISAR SI EL USUARIO YA EXISTE
$check = $conexion->prepare("SELECT id FROM usuarios WHERE correo = ?");
$check->bind_param('s', $correo);
$check->execute();
$resultado = $check->get_result();

if ($resultado->num_rows > 0) {
    die("Ya existe un usuario con el correo $correo. Intente nuevamente");
}

// INSERTAR ROL ADMIN
$stmt = $conexion->prepare(
    "INSERT INTO usuarios (nombre, correo, password, rol, estado) VALUES (?,?,?,?,?)"
);
$stmt->bind_param('sssss', $nombre, $correo, $passwordHash, $rol, $estado);

if ($stmt->execute()) {
    echo "Administrador creado correctamente.<br>";
    echo "Correo: $correo<br>";
    echo "Contraseña: $password<br>";
    echo "<strong>Recuerda eliminar este archivo (crear_admin.php) del servidor ahora.</strong>";
} else {
    echo "Error al crear el administrador: " . $conexion->error;
}

$stmt->close();
$conexion->close();