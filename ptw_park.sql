-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 19-04-2018 a las 01:45:35
-- Versión del servidor: 10.0.32-MariaDB-0+deb8u1
-- Versión de PHP: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ptw_park`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area_ocupada`
--

CREATE TABLE `area_ocupada` (
  `id` int(11) NOT NULL,
  `coordenada_x` int(5) NOT NULL,
  `coordenada_y` int(5) NOT NULL,
  `ancho_x` int(3) NOT NULL,
  `largo_y` int(3) NOT NULL,
  `fecha_incial` datetime NOT NULL,
  `fecha_final` datetime NOT NULL,
  `categoria` varchar(30) NOT NULL,
  `cliente` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `area_ocupada`
--

INSERT INTO `area_ocupada` (`id`, `coordenada_x`, `coordenada_y`, `ancho_x`, `largo_y`, `fecha_incial`, `fecha_final`, `categoria`, `cliente`) VALUES
(19, 1548, 624, 38, 6, '2018-02-22 13:12:00', '2018-05-15 13:13:00', 'SAILING_YACHT', 'YTL PRINCESS'),
(20, 1536, 804, 35, 6, '2018-02-22 13:16:00', '2018-05-15 13:16:00', 'MOTOR_YACHT', 'MY MOMENTO'),
(21, 972, 924, 33, 6, '2018-02-21 12:18:00', '2018-02-22 16:19:00', 'SAILING_YACHT', 'EUGENIA VII'),
(22, 1356, 1032, 7, 34, '2018-02-22 13:26:00', '2018-03-26 13:26:00', 'MOTOR_YACHT', 'MY MESUFISH PATROL IV'),
(18, 1248, 480, 35, 6, '2018-02-22 13:08:00', '2018-02-26 13:08:00', 'MOTOR_YACHT', 'BABBO'),
(23, 1572, 1128, 6, 28, '2018-02-22 12:48:00', '2018-05-15 13:48:00', 'MOTOR_YACHT', 'MY ZEEWOELF'),
(24, 96, 744, 41, 9, '2018-02-22 13:57:00', '2018-03-09 13:57:00', 'MOTOR_YACHT', 'MY TATYANA'),
(25, 816, 792, 3, 11, '2018-02-22 13:59:00', '2018-02-23 16:59:00', 'PESCA', 'CANOPUS PRACTICOS'),
(26, 600, 120, 6, 22, '2018-02-22 14:00:00', '2018-03-27 14:01:00', 'MOTOR_YACHT', 'MY NEGRESCO'),
(31, 936, 780, 18, 9, '2018-03-01 10:32:00', '2018-03-23 10:32:00', 'CAT', 'BALFEGO TOUR'),
(29, 372, 120, 7, 20, '2018-02-22 14:04:00', '2018-06-01 14:04:00', 'MOTOR_YACHT', 'MY ALMORIA'),
(32, 984, 648, 21, 5, '2018-03-05 11:33:00', '2018-03-13 10:34:00', 'SAILING_YACHT', 'SY KIM'),
(35, 960, 672, 19, 5, '2018-03-14 12:08:00', '2018-03-28 12:08:00', 'SAILING_YACHT', 'FERRERA'),
(34, 1056, 480, 24, 6, '2018-03-12 12:03:00', '2018-04-11 12:03:00', 'MOTOR_YACHT', 'MY VANILLA'),
(36, 480, 504, 38, 8, '2018-03-08 12:13:00', '2018-03-19 12:13:00', 'MOTOR_YACHT', 'MY TAKARA'),
(37, 984, 900, 30, 6, '2018-03-19 12:20:00', '2018-03-22 13:00:00', 'MOTOR_YACHT', 'FRANCOLÃ'),
(38, 492, 504, 35, 4, '2018-04-09 13:35:00', '2018-04-27 13:35:00', 'SAILING_YACHT', 'LA FRAU II'),
(39, 96, 852, 35, 6, '2018-04-16 13:39:00', '2018-04-30 13:39:00', 'CAT', 'TIO GELL'),
(40, 96, 816, 27, 7, '2018-03-14 13:59:00', '2018-03-23 13:59:00', 'MOTOR_YACHT', 'SOUTHERN CROSS'),
(41, 672, 804, 10, 4, '2018-03-16 14:01:00', '2018-03-21 14:01:00', 'PESCA', 'JAUME'),
(42, 852, 432, 11, 4, '2018-03-20 08:14:00', '2018-03-22 12:00:00', 'PESCA', 'BETELGUESE'),
(44, 1488, 504, 30, 6, '2018-03-22 13:00:00', '2018-03-29 12:21:00', 'MOTOR_YACHT', 'FRANCOLÃ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre_user` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre_user`, `password`) VALUES
(1, 'admin', 'f865b53623b121fd34ee5426c792e5c33af8c227'),
(2, 'adminptw', '21e53196c27761b0e4fdebb7211556728b983bfc');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `area_ocupada`
--
ALTER TABLE `area_ocupada`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_user` (`nombre_user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `area_ocupada`
--
ALTER TABLE `area_ocupada`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;
--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
