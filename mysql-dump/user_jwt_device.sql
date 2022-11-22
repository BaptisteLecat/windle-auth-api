-- Adminer 4.8.1 MySQL 8.0.30 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `user_jwt_device`;
CREATE TABLE `user_jwt_device` (
  `user_id` int NOT NULL,
  `jwt` text NOT NULL,
  `device_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`device_id`),
  KEY `device_id` (`device_id`),
  CONSTRAINT `user_jwt_device_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_jwt_device_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `device` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2022-10-06 07:25:57
