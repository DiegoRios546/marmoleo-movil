-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-04-2025 a las 03:16:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `login-react`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `business_info`
--

CREATE TABLE `business_info` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `operating_hours` varchar(255) DEFAULT NULL,
  `base_shipping_fee` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `business_info`
--

INSERT INTO `business_info` (`id`, `name`, `address`, `phone`, `email`, `operating_hours`, `base_shipping_fee`) VALUES
(1, 'Marmoleo', 'Dirección de ejemplo', '123-456-7890', 'info@marmoleo.com', 'Lunes a Viernes de 9 AM a 6 PM', 50.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`) VALUES
(1, 'res'),
(2, 'puerco');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `numero_pedido` varchar(50) NOT NULL,
  `fecha_pedido` timestamp NOT NULL DEFAULT current_timestamp(),
  `nombre_cliente` varchar(100) NOT NULL,
  `direccion_entrega` text NOT NULL,
  `estado` varchar(50) NOT NULL,
  `repartidor_asignado` varchar(100) DEFAULT NULL,
  `fecha_entrega_estimada` date DEFAULT NULL,
  `comentarios` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `numero_pedido`, `fecha_pedido`, `nombre_cliente`, `direccion_entrega`, `estado`, `repartidor_asignado`, `fecha_entrega_estimada`, `comentarios`, `created_at`, `updated_at`, `user_id`) VALUES
(1, 'PEDIDO-001', '2025-03-22 06:16:50', 'Ana Pérez', 'Calle Principal #123, Ciudad A', 'Pendiente', '4', NULL, NULL, '2025-03-22 06:16:50', '2025-03-22 06:16:50', NULL),
(2, 'PEDIDO-002', '2025-03-22 06:16:50', 'Juan López', 'Avenida Secundaria #456, Ciudad B', 'Entregado', '10', NULL, NULL, '2025-03-22 06:16:50', '2025-03-22 06:16:50', NULL),
(3, 'PEDIDO-003', '2025-03-22 06:16:50', 'María García', 'Plaza Central #789, Ciudad C', 'Entregado', '4', '2025-03-25', NULL, '2025-03-22 06:16:50', '2025-03-22 06:16:50', NULL),
(4, 'PEDIDO-004', '2025-03-22 06:16:50', 'Pedro Gómez', 'Pasaje Estrecho #101, Ciudad A', 'Entregado', '4', NULL, 'Llamar al cliente antes de la entrega.', '2025-03-22 06:16:50', '2025-03-22 06:16:50', NULL),
(5, 'PEDIDO-005', '2025-03-20 16:00:00', 'Laura Vargas', 'Boulevard Norte #222, Ciudad D', 'Pendiente', '4', NULL, NULL, '2025-03-22 06:16:50', '2025-03-22 06:16:50', NULL),
(6, 'PED001', '2025-03-26 03:00:05', 'Juan Pérez', 'Calle Principal #123, Durango', 'Pendiente', '4', NULL, NULL, '2025-03-26 03:00:05', '2025-03-26 03:00:05', NULL),
(7, 'PED002', '2025-03-26 03:00:05', 'María López', 'Avenida Central #456, Durango', 'En camino', '10', NULL, NULL, '2025-03-26 03:00:05', '2025-03-26 03:00:05', NULL),
(8, 'PED003', '2025-03-26 03:00:05', 'Carlos Gómez', 'Privada Los Pinos #789, Durango', 'Entregado', NULL, NULL, NULL, '2025-03-26 03:00:05', '2025-03-26 03:00:05', NULL),
(9, 'PED004', '2025-03-26 03:00:05', 'Ana Vargas', 'Boulevard Revolución #101, Durango', 'Pendiente', NULL, NULL, NULL, '2025-03-26 03:00:05', '2025-03-26 03:00:05', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `unidad_medida` varchar(50) NOT NULL DEFAULT 'kg',
  `categoria_id` int(11) DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `unidad_medida`, `categoria_id`, `imagen_url`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'res', 'fina', 200.00, 'kg', 2, '', '2025-03-26 03:14:45', '2025-03-27 01:59:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `creationDate` timestamp NULL DEFAULT current_timestamp(),
  `role` enum('admin','moderator','user') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `phone`, `name`, `email`, `username`, `password`, `creationDate`, `role`) VALUES
(4, '1022932004', 'Alejandro Vanegas', 'luisalejandroburitica@gmail.com', 'AlejowDev', '$2b$10$lHl2exYHfRlcZMq93OUjL.Y/SqekbezUZpTOxxa7FdURCufZpmHL6', '2024-11-13 21:09:26', 'moderator'),
(5, '13123123', 'prueba', 'prueba@gmail.com', 'prueba', '$2b$10$7EZc0BBej/KNEuKniVAhiesP5VI0Da8f2g/Baqx/dRTSZVZzpdAgW', '2024-11-13 21:31:17', 'admin'),
(8, '12345', 'Alexis', 'Alexis@gmail.com', 'Alexis Rios', '$2b$10$3PmPvhIt1GcU8I.HPauSwOtxm4aCLISByP690Q5VeJ0phymFGvENO', '2025-03-24 19:15:40', 'admin'),
(10, '12345', 'imara', 'imara@gmail.com', 'imara aleman', '$2b$10$d6dLT616HyVnVhRXtI3HYuqWDHxgVHMwbi9E4Pla5ocn5EzHC.K/a', '2025-03-24 19:35:16', 'moderator'),
(11, '12345', 'diego', 'diego@gmail.com', 'Diego Rios', '$2b$10$YSo.QZnnfBOnJurQD8ycfelIIrEgb2BUUWGGK5URb7bLvrhi/wtBK', '2025-03-24 19:39:23', 'user'),
(12, '123456', 'hola', 'diego@gmail.com', 'hola k ase', '123456', '2025-03-27 01:20:09', ''),
(15, '12345', 'Gustambo Champaña', 'gustavo@nigga.com', 'Gustambo', '$2b$10$jz6UkmxtfV6JPlcWe1K1GuajyolpE.bFpS527pxKsDKIHSIZdvLqS', '2025-03-28 05:17:45', 'user'),
(16, '12345', 'imara', 'imara@gmail.com', 'iimara', '$2b$10$nVaJ7FBD6mn1v61XALlvgOe4d8mFvpzKEpSUxl.6tc7IfLkihl3au', '2025-03-31 18:36:02', 'user'),
(17, '12345', 'imara', 'imara1@gmail.com', 'iimara', '$2b$10$kiFrWd8aZkZrgm3iWymA0uXIGMcmk.ArL6g.fmFQNktId2KNJ0QLG', '2025-03-31 18:39:10', 'user'),
(18, '12345', 'alfredo', 'alf@gmail.com', 'alfredo solis', '$2b$10$.wss3SZHxNkY8lAP5Pjoy.Mf7Nwltu/NRmd30K7amzW3m7yLICAbS', '2025-03-31 18:39:39', 'user');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `business_info`
--
ALTER TABLE `business_info`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_pedido` (`numero_pedido`),
  ADD KEY `fk_user_pedido` (`user_id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `business_info`
--
ALTER TABLE `business_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_user_pedido` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
