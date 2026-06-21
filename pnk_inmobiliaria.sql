-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 20-06-2026 a las 15:05:20
-- Versión del servidor: 8.0.43
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pnk_inmobiliaria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `galeria_propiedad`
--

DROP TABLE IF EXISTS `galeria_propiedad`;
CREATE TABLE IF NOT EXISTS `galeria_propiedad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_propiedad` int NOT NULL,
  `ruta_imagen` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_principal` tinyint(1) NOT NULL DEFAULT '0',
  `orden` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_propiedad` (`id_propiedad`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestores`
--

DROP TABLE IF EXISTS `gestores`;
CREATE TABLE IF NOT EXISTS `gestores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rut` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sexo` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `certificado_pdf` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('pendiente','aprobado','rechazado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `fecha_postulacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rut` (`rut`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `gestores`
--

INSERT INTO `gestores` (`id`, `rut`, `nombre`, `fecha_nacimiento`, `correo`, `password`, `sexo`, `telefono`, `certificado_pdf`, `estado`, `fecha_postulacion`) VALUES
(3, '11.111.111-1', 'jose perez', '2026-06-24', 'jose.perez@gmail.com', '$2y$10$UifPhAqvG7ekwZyyo9Jn3OWedImr91oA8oj45jGFrXIxC0BGM0zDq', 'Masculino', '999999999', 'uploads/gestores/certificado_111111111_1781931935.pdf', 'aprobado', '2026-06-20 01:05:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propiedades`
--

DROP TABLE IF EXISTS `propiedades`;
CREATE TABLE IF NOT EXISTS `propiedades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('Casa','Departamento','Terreno') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_publicacion` date NOT NULL,
  `provincia` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comuna` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sector` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dormitorios` int NOT NULL DEFAULT '0',
  `banos` int NOT NULL DEFAULT '0',
  `area_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `area_construida` decimal(10,2) NOT NULL DEFAULT '0.00',
  `precio_clp` decimal(14,2) NOT NULL DEFAULT '0.00',
  `precio_uf` decimal(10,2) NOT NULL DEFAULT '0.00',
  `descripcion` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `visita` enum('si','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'si',
  `bodega` enum('si','no') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'no',
  `estacionamiento` int NOT NULL DEFAULT '0',
  `logia` int NOT NULL DEFAULT '0',
  `cocina_amoblada` int NOT NULL DEFAULT '0',
  `antejardin` int NOT NULL DEFAULT '0',
  `patio_trasero` int NOT NULL DEFAULT '0',
  `piscina` int NOT NULL DEFAULT '0',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propietarios`
--

DROP TABLE IF EXISTS `propietarios`;
CREATE TABLE IF NOT EXISTS `propietarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rut` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sexo` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_propiedad` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('pendiente','activo','rechazado') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rut` (`rut`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_visita`
--

DROP TABLE IF EXISTS `solicitudes_visita`;
CREATE TABLE IF NOT EXISTS `solicitudes_visita` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_propiedad` int DEFAULT NULL,
  `codigo_propiedad` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `titulo_propiedad` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_interesado` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo_interesado` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono_interesado` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensaje` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('pendiente','contactado','coordinada','cerrada','rechazada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `fecha_solicitud` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_correo_interesado` (`correo_interesado`),
  KEY `idx_propiedad` (`id_propiedad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('administrador','propietario','gestor') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'propietario',
  `estado` enum('activo','pendiente','inactivo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `galeria_propiedad`
--
ALTER TABLE `galeria_propiedad`
  ADD CONSTRAINT `galeria_propiedad_ibfk_1` FOREIGN KEY (`id_propiedad`) REFERENCES `propiedades` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
