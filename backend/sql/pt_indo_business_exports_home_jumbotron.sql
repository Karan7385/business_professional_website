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
-- Table structure for table `home_jumbotron`
--

DROP TABLE IF EXISTS `home_jumbotron`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home_jumbotron` (
  `id` bigint unsigned NOT NULL DEFAULT '1',
  `background_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default.jpg',
  `background_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'Assorted spices and agro commodities',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PT INDO BUSINESS EXPORTS',
  `intro` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'We specialize in sourcing and exporting premium spices, herbs, gums, cloves and a wide range of agro commodities from trusted growers to global markets. Consistent quality, reliable logistics, and long–term partnerships are at the core of what we do.',
  `body` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'From farm-level selection to export-ready processing, PT INDO BUSINESS EXPORTS delivers authentic taste, aroma, and purity to spice traders, food manufacturers, and distributors worldwide.',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home_jumbotron`
--

LOCK TABLES `home_jumbotron` WRITE;
/*!40000 ALTER TABLE `home_jumbotron` DISABLE KEYS */;
INSERT INTO `home_jumbotron` VALUES (1,'uploads/home/jumbotron/exportImages.jpg','Assorted spices and agro commodities','PT INDO BUSINESS EXPORTS','We are a trusted spices exporter and importer, specializing in premium spices, herbs, gums, cloves, and a variety of agro commodities sourced from reliable growers. With a focus on consistent quality, reliable logistics, and long-term partnerships, we deliver top-quality products to global markets, meeting the needs of industries like food, cosmetics, and more.','From farm-level sourcing to export-ready processing, PT INDO BUSINESS EXPORTS provides authentic spices, herbs, and agro commodities with unmatched taste, aroma, and purity. We specialize in delivering top-quality products to spice traders, food manufacturers, and distributors worldwide, ensuring reliable supply and consistent quality for all your bulk spice and herb needs.','2025-12-01 22:06:41','2025-12-06 17:56:20');
/*!40000 ALTER TABLE `home_jumbotron` ENABLE KEYS */;
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
