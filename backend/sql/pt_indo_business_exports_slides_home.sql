-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: pt_indo_business_exports
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `slides_home`
--

DROP TABLE IF EXISTS `slides_home`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `slides_home` (
  `id` int NOT NULL AUTO_INCREMENT,
  `src` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slides_home`
--

LOCK TABLES `slides_home` WRITE;
/*!40000 ALTER TABLE `slides_home` DISABLE KEYS */;
INSERT INTO `slides_home` VALUES (1,'/uploads/home/carousels/1.jpg','Rows of colorful shipping containers stacked at a port for global export logistics','Global Export Logistics','2025-12-02 15:43:50','2025-12-04 09:37:20'),(2,'/uploads/home/carousels/2.jpg','Ancient world map with compass and gold coins symbolizing global trade routes','Global Trade Routes','2025-12-02 15:43:50','2025-12-04 09:37:20'),(3,'/uploads/home/carousels/3.jpg','Wide display of dried spices and herbs in a marketplace with labels on each container','Premium Spices & Herbs','2025-12-02 15:43:50','2025-12-04 09:37:20'),(4,'/uploads/home/carousels/4.jpg','Assorted mounds of spices in a market bazaar creating a vibrant and colorful display','Authentic Spice Marketplace','2025-12-02 15:43:50','2025-12-04 09:37:20'),(5,'/uploads/home/carousels/5.jpg','Workers loading burlap sacks of agricultural produce onto a pickup truck inside a warehouse','Farm-to-Export Supply Chain','2025-12-02 15:43:50','2025-12-04 09:37:20');
/*!40000 ALTER TABLE `slides_home` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-06 23:39:19
