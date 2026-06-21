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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `id_gestor` int DEFAULT NULL,
  `estado_gestion` enum('sin_asignar','asignada','en_gestion','publicada','pausada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'sin_asignar',
  `fecha_asignacion` datetime DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_gestor_propiedad` (`id_gestor`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `propiedades`
--

INSERT INTO `propiedades` (`id`, `tipo`, `fecha_publicacion`, `provincia`, `comuna`, `sector`, `dormitorios`, `banos`, `area_total`, `area_construida`, `precio_clp`, `precio_uf`, `descripcion`, `visita`, `bodega`, `estacionamiento`, `logia`, `cocina_amoblada`, `antejardin`, `patio_trasero`, `piscina`, `id_gestor`, `estado_gestion`, `fecha_asignacion`, `fecha_creacion`) VALUES
(1, 'Casa', '2026-05-30', 'Elqui', 'Coquimbo', 'Peñuelas', 5, 4, 300.00, 180.00, 560000000.00, 14358.00, 'Casa en venta en Peñuelas, Coquimbo. Propiedad amplia cercana a servicios, avenida principal y sector residencial consolidado.', 'si', 'si', 2, 1, 1, 1, 1, 0, NULL, 'sin_asignar', NULL, '2026-06-21 00:00:00'),
(2, 'Casa', '2026-05-30', 'Elqui', 'La Serena', 'San Joaquín', 4, 3, 372.50, 140.00, 385640810.00, 9500.00, 'Casa en venta en San Joaquín, La Serena. Propiedad familiar con amplios espacios, estacionamientos y buena conectividad.', 'si', 'no', 2, 1, 1, 1, 1, 0, NULL, 'sin_asignar', NULL, '2026-06-21 00:00:00'),
(3, 'Casa', '2026-05-30', 'Elqui', 'La Serena', 'Algarrobito', 9, 6, 5000.00, 650.00, 253020965.00, 6233.00, 'Casa en venta en Algarrobito, La Serena. Amplia propiedad con gran terreno, ideal para uso familiar o inversión.', 'si', 'si', 4, 1, 1, 1, 1, 0, NULL, 'sin_asignar', NULL, '2026-06-21 00:00:00'),
(4, 'Casa', '2026-05-30', 'Elqui', 'La Serena', 'Serena Oriente', 3, 2, 252.32, 95.00, 223265732.00, 5500.00, 'Casa en venta en Serena Oriente, La Serena. Propiedad residencial con buena distribución y conectividad.', 'si', 'no', 2, 1, 1, 1, 1, 0, NULL, 'sin_asignar', NULL, '2026-06-21 00:00:00'),
(5, 'Departamento', '2026-05-30', 'Elqui', 'La Serena', 'Av. Pacífico', 2, 2, 78.00, 78.00, 182671963.00, 4500.00, 'Departamento en venta en Avenida Pacífico, La Serena. Excelente ubicación cercana a la costa y servicios.', 'si', 'no', 1, 1, 1, 0, 0, 0, NULL, 'sin_asignar', NULL, '2026-06-21 00:00:00'),
(6, 'Departamento', '2026-05-30', 'Elqui', 'La Serena', 'Laguna del Mar', 3, 2, 96.34, 96.34, 207028225.00, 5100.00, 'Departamento en venta en Laguna del Mar, La Serena. Propiedad ubicada en condominio con buena conectividad y servicios.', 'si', 'no', 1, 1, 1, 0, 0, 0, NULL, 'sin_asignar', NULL, '2026-06-21 00:00:00'),
(7, 'Terreno', '2026-05-30', 'Limarí', 'Ovalle', 'Flor del Norte', 0, 0, 5000.00, 0.00, 811875400.00, 20000.00, 'Terreno en venta en sector Flor del Norte, Ovalle. Superficie amplia para desarrollo o inversión.', 'si', 'no', 0, 0, 0, 0, 0, 0, NULL, 'sin_asignar', NULL, '2026-06-21 00:00:00'),
(8, 'Casa', '2026-05-30', 'Elqui', 'Coquimbo', 'Nova Hacienda', 3, 2, 144.00, 90.00, 138018818.00, 3400.00, 'Casa en venta en Nova Hacienda, Coquimbo. Vivienda familiar con estacionamiento y conectividad a servicios.', 'si', 'no', 1, 1, 1, 1, 1, 0, NULL, 'sin_asignar', NULL, '2026-06-21 00:00:00'),
(9, 'Casa', '2026-05-30', 'Elqui', 'Coquimbo', 'San Juan', 3, 1, 180.00, 90.00, 78548944.00, 1935.00, 'Casa en venta en San Juan, Coquimbo. Propiedad residencial cercana a barrio consolidado.', 'si', 'no', 1, 0, 1, 1, 1, 0, NULL, 'sin_asignar', NULL, '2026-06-21 00:00:00'),
(10, 'Terreno', '2026-05-30', 'Limarí', 'Ovalle', 'Mineral de Talca', 0, 0, 5000.00, 0.00, 7900000.00, 194.61, 'Terreno en venta en Mineral de Talca, Ovalle. Superficie disponible para proyecto rural o inversión.', 'si', 'no', 0, 0, 0, 0, 0, 0, NULL, 'sin_asignar', NULL, '2026-06-21 00:00:00');

--
-- Volcado de datos para la tabla `galeria_propiedad`
--

INSERT INTO `galeria_propiedad` (`id`, `id_propiedad`, `ruta_imagen`, `es_principal`, `orden`) VALUES
(1, 1, 'img/Captura%20de%20pantalla%202026-05-30%20220818.png', 1, 0),
(2, 2, 'img/Captura%20de%20pantalla%202026-05-30%20221540.png', 1, 0),
(3, 3, 'img/Captura%20de%20pantalla%202026-05-30%20221921.png', 1, 0),
(4, 4, 'img/propiedad4-01.png', 1, 0),
(5, 5, 'img/propiedad5-01.png', 1, 0),
(6, 6, 'img/propiedad6-01.png', 1, 0),
(7, 7, 'img/propiedad7-01.png', 1, 0),
(8, 8, 'img/propiedad8-01.png', 1, 0),
(9, 9, 'img/propiedad9-01.png', 1, 0),
(10, 10, 'img/propiedad10-01.png', 1, 0);

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
  `estado` enum('pendiente','asignada','contactado','coordinada','cerrada','rechazada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `id_gestor` int DEFAULT NULL,
  `fecha_asignacion` datetime DEFAULT NULL,
  `fecha_solicitud` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_estado` (`estado`),
  KEY `idx_correo_interesado` (`correo_interesado`),
  KEY `idx_propiedad` (`id_propiedad`),
  KEY `idx_gestor_solicitud` (`id_gestor`)
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
