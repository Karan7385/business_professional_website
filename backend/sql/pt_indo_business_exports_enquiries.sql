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
-- Table structure for table `enquiries`
--

DROP TABLE IF EXISTS `enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `categories` json DEFAULT NULL,
  `products` json DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unseen',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiries`
--

LOCK TABLES `enquiries` WRITE;
/*!40000 ALTER TABLE `enquiries` DISABLE KEYS */;
INSERT INTO `enquiries` VALUES (10,'Rohit Singh','PT INDO','sales@rrbusinessindia.com','+91','7385256977','I want to know more about the products. And schedule a meet...','[\"NUTS\", \"SPICE\"]','[\"Betel nuts\", \"Coconut Sugar\", \"CUBEB\", \"Curcuma (Turmeric)\"]','seen','2025-12-06 10:34:58','2025-12-06 11:00:20'),(11,'Karan Vishwakarma','CRCE','karanvishwakarma7385@gmail.com','+91','7385256977','I want to order in bulk','[\"NUTS\", \"SPICE\"]','[\"Cashew kernels\", \"CUBEB\", \"Curcuma (Turmeric)\", \"Gum Benzoin\", \"MACE\", \"Sticklac\", \"Tamarind\", \"White Cardamom\"]','seen','2025-12-06 13:09:04','2025-12-06 17:22:57'),(12,'Test now','test now','karanvishwakarma7385@gmail.com','+91','7385256977','Test the items','[\"GUMS\", \"NUTS\"]','[\"Betel nuts\", \"CLOVE STEM\", \"Cloves\"]','seen','2025-12-06 17:53:19','2025-12-06 17:55:02'),(13,'Test now','test','KARANVISHWAKARMA7385@GMAIL.COM','+91','07385256977','test enqui','[\"SPICE\"]','[\"MACE\"]','seen','2025-12-07 06:33:25','2025-12-07 06:33:43'),(14,'Karan Vishwakarma','Student','karanvishwakarma7385@gmail.com','+91','7385256977','13/12/2025','[\"NUTS\", \"OILS\", \"SPICE\"]','[\"Betel nuts\", \"CUBEB\", \"Curcuma (Turmeric)\", \"Essential Oil\"]','seen','2025-12-13 04:53:44','2025-12-13 04:55:57'),(15,'test','test','karanvishwakarma7385@gmail.com','+91','7385256977','test 13/12/2025','[\"GUMS\"]','[\"Cashew kernels\"]','unseen','2025-12-13 04:55:17','2025-12-13 04:55:17'),(16,'ROHIT SINGH','RR BUSINESS PVT LTD','sales@rrbusinessindia.com','+91','7385984164','REQUIRE 1 TON MATERIAL PLEASE SHARE','[\"SPICE\"]','[\"MACE\"]','seen','2025-12-21 15:20:49','2025-12-21 15:21:22'),(17,'Karan Vishwakarma','','KARANVISHWAKARMA7385@GMAIL.COM','','','I want to know more about it','[17, 23, 30]','[18, 3, 7]','unseen','2025-12-22 10:37:02','2025-12-22 10:37:02'),(18,'Karan Vishwakarma','','KARANVISHWAKARMA7385@GMAIL.COM','','','I want to know more about it','[\"GUMS\", \"NUTS\", \"OILS\"]','[\"Betel nuts\", \"Cashew kernels\", \"CLOVE STEM\", \"CLOVES\"]','seen','2025-12-22 10:40:47','2026-01-17 06:28:40'),(19,'Karan Vishwakarma','test','karanvishwakarma7385@gmail.com','+91','7385256977','productNames','[null, null]','[null, null]','seen','2026-01-20 19:44:21','2026-01-20 19:45:16'),(20,'Karan Vishwakarma','CRCE','karanvishwakarma7385@gmail.com','+91','7385256977','ptindo_admin','[\"NUTS\", \"GUMS\"]','[\"CLOVES\", \"CLOVE STEM\", \"CUBEB\"]','seen','2026-01-20 19:49:12','2026-01-20 19:49:38');
/*!40000 ALTER TABLE `enquiries` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-21  1:24:59
