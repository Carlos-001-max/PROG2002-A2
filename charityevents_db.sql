-- MySQL dump 10.13  Distrib 8.4.11, for Win64 (x86_64)
--
-- Host: localhost    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Create and select the database
CREATE DATABASE IF NOT EXISTS `charityevents_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `charityevents_db`;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (4,'Concert'),(1,'Fun Run'),(2,'Gala Dinner'),(3,'Silent Auction');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `org_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `event_date` date NOT NULL,
  `location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticket_price` decimal(10,2) DEFAULT '0.00',
  `goal_amount` decimal(12,2) DEFAULT NULL,
  `current_amount` decimal(12,2) DEFAULT '0.00',
  `status` enum('upcoming','past','suspended') COLLATE utf8mb4_unicode_ci DEFAULT 'upcoming',
  PRIMARY KEY (`event_id`),
  KEY `org_id` (`org_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`org_id`) REFERENCES `organisations` (`org_id`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,1,1,'Hope Fun Run','5K run for charity','2026-11-15','Longtan Park',25.00,10000.00,4200.00,'upcoming'),(2,2,2,'Green Earth Gala','Elegant fundraising dinner','2026-12-01','Grand Ballroom',150.00,50000.00,18500.00,'upcoming'),(3,1,3,'Art for Hope Auction','Bid on local art','2026-12-10','City Gallery',50.00,20000.00,7500.00,'upcoming'),(4,2,4,'Earth Songs Concert','Live music event','2026-11-25','Concert Hall',40.00,15000.00,5200.00,'upcoming'),(5,1,2,'Hope Annual Gala','Annual celebration','2026-06-15','Waterfront Hotel',200.00,80000.00,80000.00,'past'),(6,2,1,'Nature Walk','Guided nature walk','2026-09-10','Rainforest Trail',20.00,6000.00,6000.00,'past'),(7,1,1,'Children First Run','Family fun run','2026-11-20','Riverside Park',15.00,8000.00,3100.00,'upcoming'),(8,2,3,'Charity Art Auction','Exclusive auction','2026-12-20','Art Centre',75.00,25000.00,9800.00,'upcoming');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organisations`
--

DROP TABLE IF EXISTS `organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organisations` (
  `org_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mission` text COLLATE utf8mb4_unicode_ci,
  `contact_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`org_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organisations`
--

LOCK TABLES `organisations` WRITE;
/*!40000 ALTER TABLE `organisations` DISABLE KEYS */;
INSERT INTO `organisations` VALUES (1,'Hope Foundation','Empowering communities','info@hope.org'),(2,'Green Earth','Protecting environment','contact@green.org');
/*!40000 ALTER TABLE `organisations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-03 14:25:26
