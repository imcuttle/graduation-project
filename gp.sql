-- MySQL dump 10.13  Distrib 5.7.16, for osx10.11 (x86_64)
--
-- Host: localhost    Database: gp
-- ------------------------------------------------------
-- Server version	5.7.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `face_import`
--

DROP TABLE IF EXISTS `face_import`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `face_import` (
  `stuid` varchar(20) NOT NULL,
  `time` datetime NOT NULL,
  `hash` varchar(20) NOT NULL,
  `face_url` varchar(100) NOT NULL,
  PRIMARY KEY (`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `face_import`
--
USE `face_import`;

LOCK TABLES `face_import` WRITE;
/*!40000 ALTER TABLE `face_import` DISABLE KEYS */;
INSERT INTO `face_import` VALUES ('19130126','2017-01-18 16:10:10','1K2CyJ9qOxWscGI','https://ooo.0o0.ooo/2017/01/18/587f22e255fc6.jpg'),('19130126','2017-01-18 16:10:05','iKteH16MwpmWPQG','https://ooo.0o0.ooo/2017/01/18/587f22dd0921f.jpg'),('19130126','2017-01-18 16:10:03','nhUpD8bwtcNRerH','https://ooo.0o0.ooo/2017/01/18/587f22db2a0f1.jpg'),('19130126','2017-01-18 16:10:08','qNnYgMkGTS3oLI8','https://ooo.0o0.ooo/2017/01/18/587f22e0ab219.jpg'),('19130126','2017-01-18 16:10:06','SaZIXF8pNmeMdib','https://ooo.0o0.ooo/2017/01/18/587f22decb2cb.jpg'),('19130126','2017-01-18 16:10:00','W1xq37IesN62Xdg','https://ooo.0o0.ooo/2017/01/18/587f22d8ce0ee.jpg'),('19130126','2017-01-18 16:08:17','xHwVikTrF8dXMpc','https://ooo.0o0.ooo/2017/01/18/587f227198f2a.jpg'),('19130126','2017-01-18 16:10:18','Xwgq7QcyzMV9sLn','https://ooo.0o0.ooo/2017/01/18/587f22ea47d96.jpg');
/*!40000 ALTER TABLE `face_import` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-01-18 20:32:55
