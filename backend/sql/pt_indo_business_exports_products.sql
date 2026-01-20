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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `origin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moisture` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `min_order_qty` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `packaging` json DEFAULT NULL,
  `images` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hs_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'NA',
  `loading` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'NA',
  `colour` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stems` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'NA',
  `size` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'NA',
  `port_of_loading` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `additional_info` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'NA',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'CLOVES','SPICE','INDONESIA','Export-grade /  Mini Hand-picked, Clean, Whole','≤ 12%','Whole dried cloves — aromatic spice widely used globally for cooking, baking, medicine use, perfumery, essential oil extraction. Clean, dry, free from foreign matter.','20-ft & 40-ft container','[\"10 kgs cartoon\", \"25 KGS PP BAGS\", \"50 KGS PP BAGS\"]','[\"/uploads/products/1766743008277-235595240.jpg\", \"/uploads/products/1766743008280-806497980.jpg\", \"/uploads/products/1766743008286-698663146.jpg\", \"/uploads/products/1766743008302-768727269.jpg\", \"/uploads/products/1766743008306-883705685.jpg\", \"/uploads/products/1766743008309-457865277.jpg\", \"/uploads/products/1766743008336-674841670.jpg\"]','2025-12-04 17:30:28','2025-12-26 09:56:48','09071020','100 MT + MONTHLY ','RED, ORANGE & YELLOW','NA','NA','SURABAYA PORT, INDONESIA ',''),(3,'CLOVE STEM','SPICE','INDONESIA','FAQ','≤ 12%','Dry clove stems are the dried flower stalks of the clove plant, separated from the clove buds during processing. They carry a milder clove aroma and are mainly used for flavor extraction, not presentation.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1766743160027-870572928.jpg\", \"/uploads/products/1766743160030-201893837.jpg\", \"/uploads/products/1766743160033-44806588.jpg\", \"/uploads/products/1766743160037-416979351.jpg\", \"/uploads/products/1766743160043-138808520.jpg\", \"/uploads/products/1766743160048-473304890.jpg\", \"/uploads/products/1766743160055-195351053.jpg\"]','2025-12-04 17:33:09','2025-12-26 10:05:25','07091030','100 MT + MONTHLY ','Brown & Dark Brown','','','SURABAYA PORT, INDONESIA ','NA'),(4,'CUBEB','SPICE','INDONESIA','Good Export - FAQ Quality','≤ 12%','Cubeb pepper — a lesser-known spice, used as pepper substitute, for medicinal or flavoring purposes; aromatic, pungent.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1766744381613-43705366.jpg\", \"/uploads/products/1766744633889-620015520.jpg\", \"/uploads/products/1766744633891-717825429.jpg\", \"/uploads/products/1766744633897-789293753.jpg\", \"/uploads/products/1766744633899-524116514.jpg\"]','2025-12-04 17:35:25','2025-12-26 10:24:28','12119025','100 MT + MONTHLY ','Dark Red, Brown, Black','','','SURABAYA PORT, INDONESIA ','NA'),(5,'MACE','SPICE','INDONESIA','Whole dried mace (clean, properly dried)','≤ 12%','Dry mace is the dried, lacy outer covering (aril) of the nutmeg seed. It’s a spice with a warm, aromatic flavor similar to nutmeg but milder and slightly sweeter','20-ft & 40-ft container','[\"10 kgs cartoon\", \"25 KGS PP BAGS\", \"40 KGS PP BAGS\"]','[\"/uploads/products/1766742506620-695003493.jpg\", \"/uploads/products/1766742506656-849749874.jpg\", \"/uploads/products/1766742600377-710543736.jpg\", \"/uploads/products/1766742600385-582413074.jpg\"]','2025-12-04 17:37:32','2025-12-26 09:50:00','09082100','20 MT MONTHLY ','RED, ORANGE & YELLOW','','','SURABAYA PORT, INDONESIA ','NA'),(6,'LONG PEPPER','SPICE','INDONESIA','Export Quality- FAQ','≤ 12%','Long Pepper (Pippali) is a traditional spice made from the dried, immature flower spikes of the pepper plant. It has a warmer, sweeter, more complex heat than black pepper and is widely used in Ayurveda and Indian cooking.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1766743731016-356729277.jpg\", \"/uploads/products/1766743731022-358433628.jpg\", \"/uploads/products/1766743731027-77220926.jpg\", \"/uploads/products/1766743731029-901356778.jpg\", \"/uploads/products/1766743731034-488503877.jpg\", \"/uploads/products/1766743731036-590904003.jpg\", \"/uploads/products/1766743731038-698195976.jpg\"]','2025-12-04 17:39:07','2025-12-26 10:14:06','09041110','100 MT + MONTHLY ','BLACK, BROWN','','','SURABAYA PORT, INDONESIA ','NA'),(17,'NUTMEG','NUTS','INDONESIA','Good Export - FAQ Quality','≤ 10%','Nutmeg is the dried kernel of the seed obtained from Myristica fragrans. It has a warm, aromatic, slightly sweet flavor and is widely used as a culinary spice, flavoring agent, and in food processing.\r\n\r\nThe product is well-matured, properly dried, and cleaned, free from infestation, visible mold, and harmful foreign matter. Nutmegs are uniform in color and size, suitable for export and food-grade applications.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1766745243391-433253424.jpg\"]','2025-12-06 08:35:52','2025-12-26 10:34:03','09081100','100 MT + MONTHLY ','LIGHT BROWN, DARK BROWN','','','SURABAYA PORT, INDONESIA ','NA'),(23,'DAMAR BATU','GUMS','INDONESIA','FAQ / Natural Grade','Max 2–3%','Damar Batu is a natural fossil resin obtained from trees of the Shorea species. It occurs in hard, irregular lumps with a mild resinous aroma. The material is naturally dried, cleaned, and sorted, free from excessive bark, sand, and other foreign matter.\r\n\r\nDamar Batu is widely used in varnishes, paints, inks, adhesives, incense, and traditional applications. Export-grade material is selected for uniform color, low moisture, and good melting properties.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1766745620318-240779857.jpg\"]','2025-12-06 08:57:16','2025-12-26 10:40:20','130190','100 MT + MONTHLY ','PALE YELLOW AND LIGHT AMBER','','','SURABAYA PORT, INDONESIA ','NA'),(24,'GUM GAMBIER','GUMS','INDONESIA','FAQ','Max 10–12%','Gambier is a natural vegetable extract obtained from the leaves and twigs of Uncaria gambir. It is processed into solid blocks or cubes and is rich in catechins and tannins. Gambier is widely used in pan masala, betel quid, tanning, dyeing, pharmaceuticals, and traditional medicine.\r\nThe product is well dried, free from infestation, mold, and harmful foreign matter, and suitable for industrial and export applications.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1766745838608-240814737.png\"]','2025-12-06 08:58:28','2025-12-26 11:14:31','13021900','100 MT + MONTHLY ','LIGHT BROWN, DARK BROWN','','','SURABAYA PORT, INDONESIA ','NA'),(25,'GUM BENZOIN','GUMS','INDONESIA','FAQ / Cleaned Grade','Max 5%','Gum Benzoin is a natural aromatic resin obtained from incisions made in the bark of Styrax trees. It has a sweet, vanilla-like balsamic aroma and is widely used in perfumery, incense, pharmaceuticals, cosmetics, and traditional medicine.\r\nThe material is naturally dried, cleaned, and free from visible impurities, suitable for industrial and export use.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1766746050759-96744668.jpg\"]','2025-12-06 09:00:07','2025-12-26 10:47:30','13019090','100 MT + MONTHLY ','PALE YELLOW, GOLDEN BROWN','','','SURABAYA PORT, INDONESIA ','NA'),(26,'GUM COPAL','GUMS','INDONESIA','PWS, DBB & WS','Max 5%','Gum Copal is a natural hard resin obtained from various tropical trees. It is collected in irregular translucent lumps and has a mild, resinous aroma. The material is naturally dried and cleaned, free from excess foreign matter, and suitable for industrial and traditional applications.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1766746349365-667596765.jpg\"]','2025-12-06 09:01:55','2025-12-26 10:59:18','130190','100 MT + MONTHLY ','PALE YELLOW, LIGHT AMBER','','','SURABAYA PORT, INDONESIA ','NA'),(27,'GUM DAMAR','GUMS','INDONESIA','FAQ','Max 5%','Gum Damar is a natural resin obtained from trees of the Dipterocarpaceae family. It appears as hard, brittle, translucent lumps with a mild, resinous aroma. The product is naturally dried, cleaned, and graded, free from infestation and excessive foreign matter.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1766746526357-941154511.jpg\"]','2025-12-06 09:04:01','2025-12-26 10:55:26','130190','100 MT + MONTHLY ','GOLDEN YELLOW','','','SURABAYA PORT, INDONESIA ','NA'),(28,'GUM ROSIN','GUMS','INDONESIA','WW, WG, N/M','Max 0.5%','Gum Rosin is a natural solid resin obtained by distillation of oleoresin collected from pine trees. It appears as brittle, glass-like solids with a characteristic pine odor. The product is free from visible impurities and moisture, suitable for industrial and commercial applications.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1765011922796-874248009.jpg\"]','2025-12-06 09:05:22','2025-12-26 11:02:13','38061000','100 MT + MONTHLY ','TRANSPARENT, GLASSY APPEARANCE','','','SURABAYA PORT, INDONESIA ','NA'),(29,'STICKLAC','GUMS','INDONESIA','FAQ','≤ 12%','Sticklac is the raw, natural resinous secretion of the lac insect (Kerria lacca), encrusted on small twigs. It is collected, dried, and supplied in its natural form for industrial processing into seedlac and shellac. The product contains resin, natural dye, wax, and woody matter, and is widely used in the pharmaceutical, food glazing, coating, cosmetic, and polish industries.','20-ft container','[\"50 KGS PP BAGS\"]','[\"/uploads/products/1766747106610-747019398.jpg\"]','2025-12-06 09:06:31','2025-12-26 11:05:06','13019090','100 MT + MONTHLY ','REDDISH BROWN, DARK BROWN','','','SURABAYA PORT, INDONESIA ','NA'),(30,'ESSENTIAL OIL','OILS','INDONESIA','As Per Demand','NIL','Essential Oil is obtained by steam distillation. It has a warm, spicy, sweet, and characteristic aroma. The oil is clear, free from adulteration, and suitable for use in food flavoring, pharmaceuticals, cosmetics, aromatherapy, and fragrance formulations.','20-ft container','[\"As Per Demand\"]','[\"/uploads/products/1765012334748-310581534.avif\"]','2025-12-06 09:12:14','2025-12-26 11:12:30','33012990','As Per Demand','PALE YELLOW, LIGHT AMBER','','','SURABAYA PORT, INDONESIA ','NA');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-21  1:24:57
