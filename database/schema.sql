-- =======================================================
-- Smart RO Water System - Database Schema
-- Database: smart_ro_water_system
-- Target DBMS: MySQL 8.0+
-- =======================================================

CREATE DATABASE IF NOT EXISTS `smart_ro_water_system`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `smart_ro_water_system`;

-- 1. Villages Table
CREATE TABLE IF NOT EXISTS `villages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) DEFAULT 'Tamil Nadu',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 2. RO Machines Table
CREATE TABLE IF NOT EXISTS `ro_machines` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `village_id` INT NOT NULL,
  `machine_name` VARCHAR(100) NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('AVAILABLE','OUT_OF_WATER','UNDER_MAINTENANCE','REPAIR','TEMPORARILY_CLOSED') DEFAULT 'AVAILABLE',
  `water_level_pct` INT DEFAULT 85,
  `tds_level` INT DEFAULT 110,
  `tank_capacity_liters` INT DEFAULT 5000,
  `operator_name` VARCHAR(100) DEFAULT 'Local Panchayat Operator',
  `operator_phone` VARCHAR(50) DEFAULT '+91 94421 88200',
  `last_updated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `village_id` (`village_id`),
  CONSTRAINT `ro_machines_ibfk_1` FOREIGN KEY (`village_id`) REFERENCES `villages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Machine Status Audit Trail Logs Table
CREATE TABLE IF NOT EXISTS `machine_status_logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `machine_id` INT NOT NULL,
  `status` ENUM('AVAILABLE','OUT_OF_WATER','UNDER_MAINTENANCE','REPAIR','TEMPORARILY_CLOSED') NOT NULL,
  `remarks` VARCHAR(500) DEFAULT NULL,
  `updated_by` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `machine_id` (`machine_id`),
  CONSTRAINT `machine_status_logs_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `ro_machines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Maintenance Records Table
CREATE TABLE IF NOT EXISTS `maintenance_records` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `machine_id` INT NOT NULL,
  `issue_type` VARCHAR(100) NOT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `started_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `expected_end_at` DATETIME DEFAULT NULL,
  `completed_at` DATETIME DEFAULT NULL,
  `status` ENUM('OPEN','IN_PROGRESS','COMPLETED') DEFAULT 'OPEN',
  `updated_by` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `machine_id` (`machine_id`),
  CONSTRAINT `maintenance_records_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `ro_machines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. Community Citizen Issue Reports Table
CREATE TABLE IF NOT EXISTS `community_reports` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `machine_id` INT NOT NULL,
  `reporter_name` VARCHAR(100) NOT NULL,
  `reporter_phone` VARCHAR(50) NOT NULL,
  `issue_type` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `status` ENUM('PENDING','INVESTIGATING','RESOLVED') DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `machine_id` (`machine_id`),
  CONSTRAINT `community_reports_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `ro_machines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 6. Users & Operators Table (Admin & Field Operators)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role` ENUM('ADMIN', 'OPERATOR') NOT NULL DEFAULT 'OPERATOR',
  `phone` VARCHAR(50) DEFAULT NULL,
  `assigned_village_id` INT DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `assigned_village_id` (`assigned_village_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`assigned_village_id`) REFERENCES `villages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
