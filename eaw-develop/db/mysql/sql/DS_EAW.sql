--
-- Important: This file should be executed in MySQL Workbench (or similar tool) since it contains client specific instructions,
-- such as 'DELIMITER'. See: https://stackoverflow.com/questions/9017269/mysql-delimiter-syntax-error
--

CREATE DATABASE IF NOT EXISTS `DS_EAW`;


USE `DS_EAW`;

-- MySQL dump 10.13  Distrib 8.0.17, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: DS_EAW
-- ------------------------------------------------------
-- Server version	8.0.1

--
-- Table structure for table `AccessToken`
--
DROP TABLE IF EXISTS NodesServes;

create table NodesServes (
  id int auto_increment,
  name varchar(50) not null,
  ip varchar(100) not null,
  state boolean default false not null,
  isMasterNode boolean default false not null,
  queueIsRunning tinyint(1) default 0 not null,
  constraint NodesServes_pk primary key (id)
);

--
-- Table structure for table `AccessToken`
--
DROP TABLE IF EXISTS `AccessToken`;

CREATE TABLE `AccessToken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `scopes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Table structure for table `Browsers`
--
DROP TABLE IF EXISTS `Browsers`;

CREATE TABLE `Browsers` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `browserVersion` varchar(50) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;



--
-- Table structure for table `Countries`
--
DROP TABLE IF EXISTS `Countries`;



CREATE TABLE `Countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `prefix` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;




--
-- Table structure for table `Disabilities`
--
DROP TABLE IF EXISTS `Disabilities`;





CREATE TABLE `Disabilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;




--
-- Table structure for table `AutomaticDescriptions`
--
DROP TABLE IF EXISTS `DS_EAW`.`AutomaticDescriptions`;

CREATE TABLE `DS_EAW`.`AutomaticDescriptions` (
  `id` SMALLINT NOT NULL AUTO_INCREMENT,
  `codeSnifferCode` NVARCHAR(100) NOT NULL,
  `description` NVARCHAR(1200) NULL,
  PRIMARY KEY (`id`)
);

--
-- Table structure for table `Languages`
--
DROP TABLE IF EXISTS `Languages`;





CREATE TABLE `Languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `iana` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;


--
-- Table structure for table `Notices`
--
DROP TABLE IF EXISTS `Notices`;





CREATE TABLE `Notices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(800) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;


--
-- Table structure for table `OperativeSystems`
--
DROP TABLE IF EXISTS `OperativeSystems`;





CREATE TABLE `OperativeSystems` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

--
-- Table structure for table `Packages`
--
DROP TABLE IF EXISTS `Packages`;





CREATE TABLE `Packages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

--
-- Table structure for table `Principles`
--
DROP TABLE IF EXISTS `Principles`;





CREATE TABLE `Principles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `referenceLink` varchar(200) DEFAULT NULL,
  `descriptionPath` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `RoleTypes`
--
DROP TABLE IF EXISTS `RoleTypes`;





CREATE TABLE `RoleTypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleType` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
--
-- Table structure for table `Rules`
--
DROP TABLE IF EXISTS `Rules`;





CREATE TABLE `Rules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ruleName` varchar(150) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `SupportTools`
--
DROP TABLE IF EXISTS `SupportTools`;





CREATE TABLE `SupportTools` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `version` varchar(15) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `Tags`
--
DROP TABLE IF EXISTS `Tags`;



CREATE TABLE `Tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;




--
-- Table structure for table `Devices`
--
DROP TABLE IF EXISTS `Devices`;





CREATE TABLE `Devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `brand` varchar(50) NOT NULL,
  `version` varchar(15) NOT NULL,
  `operativeSystemId` tinyint(4) NOT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Devices_OperativeSystems_fk` (`operativeSystemId`),
  CONSTRAINT `Devices_OperativeSystems_fk` FOREIGN KEY (`operativeSystemId`) REFERENCES `OperativeSystems` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;



--
-- Table structure for table `Guidelines`
--
DROP TABLE IF EXISTS `Guidelines`;





CREATE TABLE `Guidelines` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numberGuidelines` varchar(45) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `referenceLink` varchar(200) DEFAULT NULL,
  `principlesId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Guidelines_Principle_fk_idx` (`principlesId`),
  CONSTRAINT `Guidelines_Principle_fk` FOREIGN KEY (`principlesId`) REFERENCES `Principles` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

--
-- Table structure for table `Criterions`
--
DROP TABLE IF EXISTS `Criterions`;





CREATE TABLE `Criterions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `numberCriterion` varchar(45) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `referenceLink` varchar(200) DEFAULT NULL,
  `guidelinesId` int(11) DEFAULT NULL,
  `level` varchar(4) DEFAULT NULL,
  `criterionDescription` varchar(1500) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `isEvaluatedByAutomatic` TINYINT(1) NULL DEFAULT b'0' COMMENT 'Evaluated by pa11y 5.1.0.',
  PRIMARY KEY (`id`),
  KEY `Criterion_Guidelines_fk_idx` (`guidelinesId`),
  CONSTRAINT `Criterion_Guidelines_fk` FOREIGN KEY (`guidelinesId`) REFERENCES `Guidelines` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
--
-- Table structure for table `CriterionsByDisabilityRoles`
--

DROP TABLE IF EXISTS `CriterionsByDisabilityRoles`;

CREATE TABLE `CriterionsByDisabilityRoles` (
  `disabilitiesId` int(11) NOT NULL,
  `criterionsId` int(11) NOT NULL,
  PRIMARY KEY (`disabilitiesId`, `criterionsId`),
  KEY `CriterionByDisabilityRole_Criterion_fk_idx` (`criterionsId`),
  CONSTRAINT `CriterionByDisabilityRole_Criterion_fk` FOREIGN KEY (`criterionsId`) REFERENCES `Criterions` (`id`),
  CONSTRAINT `CriterionByDisabilityRole_DisabilityRole_fk` FOREIGN KEY (`disabilitiesId`) REFERENCES `Disabilities` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;



--
-- Table structure for table `OperativeSystemVersions`
--
DROP TABLE IF EXISTS `OperativeSystemVersions`;





CREATE TABLE `OperativeSystemVersions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `operativeSystemsId` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `OperativeSystemVersions_OperativeSystems_id_fk` (`operativeSystemsId`),
  CONSTRAINT `OperativeSystemVersions_OperativeSystems_id_fk` FOREIGN KEY (`operativeSystemsId`) REFERENCES `OperativeSystems` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Table structure for table `OperativeSystemsByDevices`
--
DROP TABLE IF EXISTS `OperativeSystemsByDevices`;





CREATE TABLE `OperativeSystemsByDevices` (
  `devicesId` int(11) NOT NULL,
  `operativeSystemsId` tinyint(4) NOT NULL,
  PRIMARY KEY (`devicesId`, `operativeSystemsId`),
  KEY `PlatformsByDevices_OperativeSystems_id_fk` (`operativeSystemsId`),
  CONSTRAINT `PlatformsByDevices_Devices_id_fk` FOREIGN KEY (`devicesId`) REFERENCES `Devices` (`id`),
  CONSTRAINT `PlatformsByDevices_OperativeSystems_id_fk` FOREIGN KEY (`operativeSystemsId`) REFERENCES `OperativeSystems` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;




--
-- Table structure for table `Recommendations`
--
DROP TABLE IF EXISTS `Recommendations`;


CREATE TABLE `Recommendations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descriptionRecommendation` varchar(2000) DEFAULT NULL,
  `alternativeRecomendationCode` varchar(50) DEFAULT NULL,
  `criterionsId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Recommendation_Criterion_fk_idx` (`criterionsId`),
  CONSTRAINT `Recommendation_Criterion_fk` FOREIGN KEY (`criterionsId`) REFERENCES `Criterions` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

--
-- Table structure for table `RulesPackages`
--
DROP TABLE IF EXISTS `RulesPackages`;





CREATE TABLE `RulesPackages` (
  `packagesId` int(11) NOT NULL,
  `rulesId` int(11) NOT NULL,
  PRIMARY KEY (`packagesId`, `rulesId`),
  KEY `RulesPackages_Rules_idx` (`rulesId`),
  CONSTRAINT `RulesPackages_Packages_fk` FOREIGN KEY (`packagesId`) REFERENCES `Packages` (`id`),
  CONSTRAINT `RulesPackages_Rules_fk` FOREIGN KEY (`rulesId`) REFERENCES `Rules` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
--
-- Table structure for table `Segments`
--
DROP TABLE IF EXISTS `Segments`;





CREATE TABLE `Segments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `countryId` int(11) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Segments_Countries_id_fk` (`countryId`),
  CONSTRAINT `Segments_Countries_id_fk` FOREIGN KEY (`countryId`) REFERENCES `Countries` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
--
-- Table structure for table `SupportToolsByDisabilities`
--
DROP TABLE IF EXISTS `SupportToolsByDisabilities`;





CREATE TABLE `SupportToolsByDisabilities` (
  `supportToolId` int(11) DEFAULT NULL,
  `disabilityId` int(11) DEFAULT NULL,
  KEY `supportToolsByDisabilitie_supportTool_fk` (`supportToolId`),
  KEY `supportToolsByDisabilitie_Disability_fk` (`disabilityId`),
  CONSTRAINT `SupportToolsByDisabilities_ibfk_1` FOREIGN KEY (`supportToolId`) REFERENCES `SupportTools` (`id`),
  CONSTRAINT `SupportToolsByDisabilities_ibfk_2` FOREIGN KEY (`disabilityId`) REFERENCES `Disabilities` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;


--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;


CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleTypesId` int(11) NOT NULL,
  `realm` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `emailVerified` tinyint(4) DEFAULT NULL,
  `verificationToken` varchar(255) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `languagesId` int(11) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `sex` tinyint(1) DEFAULT 0 NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `Users_RoleType_fk_idx` (`roleTypesId`),
  KEY `Users_Languages_id_fk` (`languagesId`),
  CONSTRAINT `Users_Languages_id_fk` FOREIGN KEY (`languagesId`) REFERENCES `Languages` (`id`),
  CONSTRAINT `Users_RoleType_fk` FOREIGN KEY (`roleTypesId`) REFERENCES `RoleTypes` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `Clients`
--
DROP TABLE IF EXISTS `Clients`;

CREATE TABLE `Clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(500) NOT NULL,
  `countryRegion` varchar(200) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postalCode` varchar(45) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `Clients_Users_fk` FOREIGN KEY (`id`) REFERENCES `DS_EAW`.`Users` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `ClientsByCountries`
--
DROP TABLE IF EXISTS `ClientsByCountries`;


CREATE TABLE `ClientsByCountries` (
  `clientsId` int(11) NOT NULL,
  `countriesId` int(11) NOT NULL,
  PRIMARY KEY (`clientsId`, `countriesId`),
  CONSTRAINT `ClientsByCountries_Clients_fk` FOREIGN KEY (`clientsId`) REFERENCES `DS_EAW`.`Clients` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Table structure for table `ClientsBySegments`
--
DROP TABLE IF EXISTS `ClientsBySegments`;





CREATE TABLE `ClientsBySegments` (
  `clientsId` int(11) NOT NULL,
  `segmentsId` int(11) NOT NULL,
  PRIMARY KEY (`clientsId`, `segmentsId`),
  KEY `ClientsBySegments_Segments_id_fk` (`segmentsId`),
  CONSTRAINT `ClientsBySegments_Clients_fk` FOREIGN KEY (`clientsId`) REFERENCES `DS_EAW`.`Clients` (`id`),
  CONSTRAINT `ClientsBySegments_Segments_id_fk` FOREIGN KEY (`segmentsId`) REFERENCES `Segments` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;



--
-- Table structure for table `DisabilitiesByUsers`
--
DROP TABLE IF EXISTS `DisabilitiesByUsers`;



CREATE TABLE `DisabilitiesByUsers` (
  `usersId` int(11) NOT NULL,
  `disabilitiesId` int(11) NOT NULL,
  PRIMARY KEY (`disabilitiesId`, `usersId`),
  KEY `DisabilitiesByUsers_Users_id_fk` (`usersId`),
  CONSTRAINT `DisabilitiesByUsers_Disabilities_id_fk` FOREIGN KEY (`disabilitiesId`) REFERENCES `Disabilities` (`id`),
  CONSTRAINT `DisabilitiesByUsers_Users_id_fk` FOREIGN KEY (`usersId`) REFERENCES `Users` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;


--
-- Table structure for table `Evaluations`
--
DROP TABLE IF EXISTS `Evaluations`;


CREATE TABLE `Evaluations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `evaluationCode` varchar(255) NOT NULL,
  `siteName` varchar(150) DEFAULT NULL,
  `manualEvaluationState` tinyint(1) DEFAULT NULL,
  `automaticEvaluationState` tinyint(1) DEFAULT NULL,
  `domain` varchar(100) DEFAULT NULL,
  `mainUrl` varchar(400) DEFAULT NULL,
  `siteMap` json DEFAULT NULL,
  `selectedSiteMap` JSON DEFAULT NULL,
  `scrapingState` tinyint(1) DEFAULT NULL,
  `pagesChoosed` tinyint(1) DEFAULT NULL,
  `managerialReportState` int(11) DEFAULT NULL,
  `nodeId` int(11) DEFAULT NULL,
  `technicalReportState` int(11) DEFAULT NULL,
  `packagesId` int(11) DEFAULT NULL,
  `segmentsId` int(11) DEFAULT NULL,
  `clientsId` int(11) DEFAULT NULL,
  `languagesId` int(11) DEFAULT NULL,
  `tagId` int null,
  `sendedResults` tinyint(1) NULL DEFAULT 0,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT NULL,
  `updatedBy` int(11) NOT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `isDeleted` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `Evaluations_Packages_fk_idx` (`packagesId`),
  KEY `Evaluations_Segments_fk_idx` (`segmentsId`),
  KEY `Evaluations_Clients_fk_idx` (`clientsId` ASC),
  KEY `Evaluations_Languages_id_fk` (`languagesId`),
  KEY `Evaluations_Users_Created_fk` (`createdBy`),
  KEY `Evaluations_Users_Updated_fk` (`updatedBy`),
  CONSTRAINT `Evaluations_Languages_id_fk` FOREIGN KEY (`languagesId`) REFERENCES `Languages` (`id`),
  CONSTRAINT `Evaluations_Packages_fk` FOREIGN KEY (`packagesId`) REFERENCES `Packages` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `Evaluations_Segments_fk` FOREIGN KEY (`segmentsId`) REFERENCES `Segments` (`id`),
  CONSTRAINT `Evaluations_Clients_fk` FOREIGN KEY (`clientsId`) REFERENCES `DS_EAW`.`Clients` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Evaluations_Users_Created_fk` FOREIGN KEY (`createdBy`) REFERENCES `Users` (`id`),
  CONSTRAINT `Evaluations_Users_Updated_fk` FOREIGN KEY (`updatedBy`) REFERENCES `Users` (`id`),
  constraint `Evaluations_Tag_tagIdFk` foreign key (`tagId`) references `Tags` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `DatesByEvaluations`
--
DROP TABLE IF EXISTS `DatesByEvaluations`;



CREATE TABLE `DatesByEvaluations` (
  `evaluationsId` int(11) NOT NULL,
  `expirationDate` timestamp NULL DEFAULT NULL,
  `evaluationFinishedAt` timestamp NULL DEFAULT NULL,
  `manualStartDateAt` timestamp NULL DEFAULT NULL,
  `manualFinishedDateAt` timestamp NULL DEFAULT NULL,
  `automaticStartDateAt` timestamp NULL DEFAULT NULL,
  `automaticFinishedDateAt` timestamp NULL DEFAULT NULL,
  `scrapingStartDateAt` timestamp NULL DEFAULT NULL,
  `scrapingFinishedDateAt` timestamp NULL DEFAULT NULL,
  `managerialReportCreatedAt` timestamp NULL DEFAULT NULL,
  `technicalReportCreatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`evaluationsId`),
  CONSTRAINT `DatesByEvaluation_Evaluations_fk` FOREIGN KEY (`evaluationsId`) REFERENCES `Evaluations` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;



--
-- Table structure for table `Pages`
--
DROP TABLE IF EXISTS `Pages`;





CREATE TABLE `Pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `evaluationsId` int(11) NOT NULL,
  `url` varchar(800) DEFAULT NULL,
  `title` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Pages_Evaluations_fk_idx` (`evaluationsId`),
  CONSTRAINT `Pages_Evaluations_fk` FOREIGN KEY (`evaluationsId`) REFERENCES `Evaluations` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `Reports`
--
DROP TABLE IF EXISTS `Reports`;





CREATE TABLE `Reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `evaluationsId` int(11) DEFAULT NULL,
  `managerialReportPath` varchar(500) DEFAULT NULL,
  `technicalReportPath` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Reports_Evaluations_fk_idx` (`evaluationsId`),
  CONSTRAINT `Reports_Evaluations_fk` FOREIGN KEY (`evaluationsId`) REFERENCES `Evaluations` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `Specifications`
--
DROP TABLE IF EXISTS `Specifications`;





CREATE TABLE `Specifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `evaluationsId` int(11) DEFAULT NULL,
  `supportToolsId` int(11) DEFAULT NULL,
  `operativeSystemsId` tinyint(4) DEFAULT NULL,
  `devicesId` int(11) DEFAULT NULL,
  `browsersId` tinyint(4) DEFAULT NULL,
  `usersId` int(11) DEFAULT NULL,
  `disabilitiesId` int(11) DEFAULT NULL,
  `state` tinyint(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Specifications_Devices_id_fk` (`devicesId`),
  KEY `Specifications_Evaluations_id_fk` (`evaluationsId`),
  KEY `Specifications_SupportTool_id_fk` (`supportToolsId`),
  KEY `Specifications_OperativeSystems_id_fk` (`operativeSystemsId`),
  KEY `Specifications_Browsers_idBrowsers_pk_fk` (`browsersId`),
  KEY `Specifications_Disabilities_id_fk` (`disabilitiesId`),
  KEY `Specifications_Users_id_fk` (`usersId`),
  CONSTRAINT `Specifications_Browsers_idBrowsers_pk_fk` FOREIGN KEY (`browsersId`) REFERENCES `Browsers` (`id`),
  CONSTRAINT `Specifications_Devices_id_fk` FOREIGN KEY (`devicesId`) REFERENCES `Devices` (`id`),
  CONSTRAINT `Specifications_Disabilities_id_fk` FOREIGN KEY (`disabilitiesId`) REFERENCES `Disabilities` (`id`),
  CONSTRAINT `Specifications_Evaluations_id_fk` FOREIGN KEY (`evaluationsId`) REFERENCES `Evaluations` (`id`),
  CONSTRAINT `Specifications_OperativeSystems_id_fk` FOREIGN KEY (`operativeSystemsId`) REFERENCES `OperativeSystems` (`id`),
  CONSTRAINT `Specifications_SupportTool_id_fk` FOREIGN KEY (`supportToolsId`) REFERENCES `SupportTools` (`id`),
  CONSTRAINT `Specifications_Users_id_fk` FOREIGN KEY (`usersId`) REFERENCES `Users` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;


--
-- Table structure for table `ErrorDebugs`
--
DROP TABLE IF EXISTS `ErrorDebugs`;





CREATE TABLE `ErrorDebugs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationName` varchar(255) DEFAULT NULL,
  `errorDescription` varchar(1800) DEFAULT NULL,
  `errorDateAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fixed` tinyint(1) DEFAULT '0',
  `evaluationsId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ErrorDebugs_Evaluations_id_fk` (`evaluationsId`),
  CONSTRAINT `ErrorDebugs_Evaluations_id_fk` FOREIGN KEY (`evaluationsId`) REFERENCES `Evaluations` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `TagsByEvaluations`
--
DROP TABLE IF EXISTS `TagsByEvaluations`;





CREATE TABLE `TagsByEvaluations` (
  `tagsId` int(11) NOT NULL,
  `evaluationsId` int(11) DEFAULT NULL,
  KEY `TagsByEvaluations_Evaluations_id_fk` (`evaluationsId`),
  KEY `TagsByEvaluations_Tags_id_fk` (`tagsId`),
  CONSTRAINT `TagsByEvaluations_Evaluations_id_fk` FOREIGN KEY (`evaluationsId`) REFERENCES `Evaluations` (`id`),
  CONSTRAINT `TagsByEvaluations_Tags_id_fk` FOREIGN KEY (`tagsId`) REFERENCES `Tags` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;


--
-- Table structure for table `ManualPages`
--
DROP TABLE IF EXISTS `ManualPages`;


CREATE TABLE `ManualPages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pagesId` int(11) NOT NULL,
  `evaluationPageState` tinyint(1) DEFAULT NULL,
  `formPage` json DEFAULT NULL,
  `percetibleObservation` varchar(2500) DEFAULT NULL,
  `operableObservation` varchar(2500) DEFAULT NULL,
  `distinguishableObservation` varchar(2500) DEFAULT NULL,
  `robustObservation` varchar(2500) DEFAULT NULL,
  `finishedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ManualPages_Pages_fk_idx` (`pagesId`),
  CONSTRAINT `ManualPages_Pages_id_fk` FOREIGN KEY (`pagesId`) REFERENCES `Pages` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `Notifications`
--
DROP TABLE IF EXISTS `Notifications`;





CREATE TABLE `Notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NULL DEFAULT NULL,
  `descriptionPath` varchar(200) DEFAULT NULL,
  `viewed` tinyint(1) DEFAULT NULL,
  `usersId` int(11) DEFAULT NULL,
  `parameters` JSON NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Notifications_Users_id_fk` (`usersId`),
  CONSTRAINT `Notifications_Users_id_fk` FOREIGN KEY (`usersId`) REFERENCES `Users` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;


--
-- Table structure for table `AutomaticEvaluatorPages`
--
DROP TABLE IF EXISTS `AutomaticEvaluatorPages`;

CREATE TABLE `AutomaticEvaluatorPages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pagesId` int(11) NOT NULL,
  `evaluationPageState` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `AutomaticEvaluatorPages_Pages_fk_idx` (`pagesId`),
  CONSTRAINT `AutomaticEvaluatorPages_Pages_id_fk` FOREIGN KEY (`pagesId`) REFERENCES `Pages` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `Findings`
--
DROP TABLE IF EXISTS `Findings`;


CREATE TABLE `Findings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `automaticEvaluatorPagesId` int(11) NOT NULL,
  `criterionsId` int(11) NOT NULL,
  `htmlCode` varchar(800) DEFAULT NULL,
  `htmlSelectorPath` varchar(800) DEFAULT NULL,
  `automaticDescriptionsId` SMALLINT DEFAULT NULL,
  `findingType` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Findings_Criterion_fk_idx` (`criterionsId`),
  KEY `Findings_AutomaticEvaluatorPages_fk_idx` (`automaticEvaluatorPagesId`),
  CONSTRAINT `Findings_AutomaticEvaluatorPages_fk` FOREIGN KEY (`automaticEvaluatorPagesId`) REFERENCES `AutomaticEvaluatorPages` (`id`),
  CONSTRAINT `Findings_Criterion_fk` FOREIGN KEY (`criterionsId`) REFERENCES `Criterions` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `SupportToolsByManualPages`
--
DROP TABLE IF EXISTS `SupportToolsByManualPages`;





CREATE TABLE `SupportToolsByManualPages` (
  `supportToolsId` int(11) NOT NULL,
  `manualPagesId` int(11) NOT NULL,
  PRIMARY KEY (`supportToolsId`, `manualPagesId`),
  KEY `SupportToolsXManualPages_ManualPages_fk` (`manualPagesId`),
  CONSTRAINT `SupportToolsXManualPages_ManualPages_fk` FOREIGN KEY (`manualPagesId`) REFERENCES `ManualPages` (`id`),
  CONSTRAINT `SupportToolsXManualPages_SupportTools_fk` FOREIGN KEY (`supportToolsId`) REFERENCES `SupportTools` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


--
-- Table structure for table `SpecificationsByManualPages`
--
DROP TABLE IF EXISTS `SpecificationsByManualPages`;


CREATE TABLE `SpecificationsByManualPages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `specificationsId` int(11) DEFAULT NULL,
  `manualPagesId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UsersByRolesBySpecificationsByManualPages_ManualPages_id_fk` (`manualPagesId`),
  KEY `UsersByRolesBySpecificationsByMP_UsersByRolesBySpecifications` (`specificationsId`),
  CONSTRAINT `SpecificationsByManualPages_ManualPages_id_fk` FOREIGN KEY (`manualPagesId`) REFERENCES `ManualPages` (`id`),
  CONSTRAINT `SpecificationsByManualPages_Specifications_id_fk` FOREIGN KEY (`specificationsId`) REFERENCES `Specifications` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;


--
-- Table structure for table `ManualAnswers`
--
DROP TABLE IF EXISTS `ManualAnswers`;


CREATE TABLE `ManualAnswers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `criterionsId` int(11) NOT NULL,
  `recommendationsId` int(11) DEFAULT NULL,
  `complyState` tinyint(1) NOT NULL,
  `specificationsByManualPagesId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ManualAnswers_ManualPages_fk_idx` (`id`),
  KEY `ManualAnswers_Criterion_fk_idx` (`criterionsId`),
  KEY `ManualAnswers_UsersByRolesBySpecificationsByManualPages_id_fk` (`specificationsByManualPagesId`),
  KEY `ManualAnswers_Recommendation_idRecommendation_pk_fk` (`recommendationsId`),
  CONSTRAINT `ManualAnswers_Recommendation_idRecommendation_pk_fk` FOREIGN KEY (`recommendationsId`) REFERENCES `DS_EAW`.`Recommendations` (`id`),
  CONSTRAINT `ManualAnswers_Criterion_fk` FOREIGN KEY (`criterionsId`) REFERENCES `Criterions` (`id`),
  CONSTRAINT `ManualAnswers_SpecificationsByManualPages_id_fk` FOREIGN KEY (`specificationsByManualPagesId`) REFERENCES `SpecificationsByManualPages` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


use DS_EAW;

-- Return Findings quantity by guideline
DROP procedure IF EXISTS `SP_findingsByGuidelineForPackage1`;

DELIMITER ;;
CREATE  PROCEDURE `SP_findingsByGuidelineForPackage1`(
  IN p_evaluationId  INT
)
BEGIN
  SELECT concat(G.numberGuidelines," ",G.name) as Pautas, count(DISTINCT(F.criterionsId)) as `Criterios(Cantidad)` 
    FROM Pages P 
    JOIN AutomaticEvaluatorPages AP on AP.pagesId = P.id
    JOIN Findings F on F.automaticEvaluatorPagesId = AP.id
    JOIN Criterions C on C.id = F.criterionsId
    JOIN Guidelines G on G.id = C.guidelinesId
    where P.evaluationsId = p_evaluationId
    group by G.id
    order by G.numberGuidelines
  ;
END ;;
DELIMITER ;;

-- SP for Pie graphic data. Return the percentage of diferent failed criterion quantity in all pages 

DROP procedure IF EXISTS `SP_generalEvaluationStateForPackage1`;

DELIMITER ;;
CREATE  PROCEDURE `SP_generalEvaluationStateForPackage1`( 
  IN p_evaluationId  INT
)
BEGIN
  -- There are 51 criterions for automatic evaluation
    -- failed percentage could be from 00,00 to 100
  DECLARE usedAutomaticCriterion INT DEFAULT 51;
    DECLARE pagesQuantity INT DEFAULT 0;
    DECLARE findingInPagesQ INT DEFAULT 0;
    DECLARE failedPercentage FLOAT default 0;
    
    -- Quantity of an evaluation pages
    SET pagesQuantity = (SELECT COUNT(Pages.id) FROM DS_EAW.Pages 
    where evaluationsId = p_evaluationId);
  
    -- Un repeated errors from idPage and criterion combination
    SET findingInPagesQ = (SELECT count(DISTINCT(concat(P.id,'-', F.criterionsId))) FROM Pages P 
    JOIN AutomaticEvaluatorPages AP on AP.pagesId = P.id
    JOIN Findings F on F.automaticEvaluatorPagesId = AP.id
     where P.evaluationsId = p_evaluationId);
  
    -- Prevent division by zero
    IF  pagesQuantity != 0 THEN 
    SET failedPercentage = ( (findingInPagesQ * 100) / (pagesQuantity * usedAutomaticCriterion));
  ELSEIF pagesQuantity = 0 THEN 
    SET failedPercentage = 0;
  END IF;
    
  select TRUNCATE(failedPercentage, 2) AS Incumplimiento, TRUNCATE((100 - failedPercentage), 2) AS Cumplimiento;
END ;;
DELIMITER ;;

-- Returns a counter of pages, url and name.
DROP procedure IF EXISTS `SP_samplePages`;

DELIMITER $$
USE `DS_EAW`$$
CREATE PROCEDURE `SP_samplePages`(
    IN p_evaluationId INT
)
BEGIN
SELECT @rownum := @rownum + 1 AS 'index',  Pages.url, REGEXP_REPLACE(title,'(\t|\n|  )+', " ")  as title
  FROM (
    select P.url, P.title  from  `DS_EAW`.`Pages` P where P.evaluationsId = p_evaluationId
) as Pages, (SELECT @rownum := 0) r;
END$$

DELIMITER ;


-- SP for Complete Report
-- Return the diferent failed criterion quantity for guideline
DROP procedure IF EXISTS `SP_manualAnswersByGuidelineForPackage3`;

DELIMITER ;;
CREATE PROCEDURE `SP_manualAnswersByGuidelineForPackage3`(
  IN p_evaluationId  INT
)
BEGIN
SELECT concat(G.numberGuidelines," ",G.name) as Pautas, count(DISTINCT(MA.criterionsId)) as `Criterios(Cantidad)`
	FROM Pages P 
    JOIN ManualPages MP on MP.pagesId = P.id
    JOIN SpecificationsByManualPages SMP on SMP.manualPagesId = MP.id
    JOIN ManualAnswers MA on MA.specificationsByManualPagesId = SMP.id
    JOIN Criterions C on C.id = MA.criterionsId
    JOIN Guidelines G on G.id = C.guidelinesId
    where P.evaluationsId = p_evaluationId and complyState = -1
    group by G.id
    order by G.numberGuidelines
  ;
END ;;

DELIMITER ;;

-- Return the diferent failed criterion quantity for page in all manual evaluations
DROP procedure IF EXISTS `SP_failedCriterionsByPageForManual`;

DELIMITER ;;
CREATE PROCEDURE `SP_failedCriterionsByPageForManual`(IN p_evaluationId int)
BEGIN
    
  select * from (
    SELECT 
    	@rownum := @rownum + 1 AS `Páginas`, 
        PageStatisticsWithCounter.`Criterios(Cantidad)`
      FROM 
    	(SELECT 
    		  AllPagesT.id,
    		  IFNULL(CriterionsByPageT.`Criterios(Cantidad)`, 0) `Criterios(Cantidad)`,
              AllPagesT.url
    		FROM (
    		(SELECT * from Pages where evaluationsId = p_evaluationId) AllPagesT
    		LEFT JOIN
    		  (SELECT
    			P.id,
    			count(distinct(MA.criterionsId), 0) as `Criterios(Cantidad)`
    		   FROM Pages P
    			JOIN ManualPages MP on MP.pagesId = P.id
    			JOIN SpecificationsByManualPages SMP on SMP.manualPagesId = MP.id
    			JOIN ManualAnswers MA on MA.specificationsByManualPagesId = SMP.id
    			where P.evaluationsId = p_evaluationId and complyState = -1
    		 	group by P.id
    		  ) as CriterionsByPageT
    		 ON AllPagesT.id = CriterionsByPageT.id
    		)
      )  AS PageStatisticsWithCounter, (SELECT @rownum := 0) r
  ) AS TABLE_WITHOUT_CERO
  where TABLE_WITHOUT_CERO.`Criterios(Cantidad)` != 0;
      
END;;

DELIMITER ;;


-- Return the diferent failed criterion quantity for page in all manual evaluations.
-- And data includes URL.
DROP procedure IF EXISTS `SP_failedCriterionsByPageForManualForTable`;

DELIMITER ;;
CREATE PROCEDURE `SP_failedCriterionsByPageForManualForTable`(IN p_evaluationId int)
BEGIN
	SELECT 
	  @rownum := @rownum + 1 AS `Páginas`, 
    RESULT_TABLE.`Criterios(Cantidad)`,
    RESULT_TABLE.url
  FROM 
  	(SELECT 
  		  AllPagesT.id,
  		  IFNULL(CriterionsByPageT.`Criterios(Cantidad)`, 0) `Criterios(Cantidad)`,
            AllPagesT.url
  		FROM (
  		(SELECT * from Pages where evaluationsId = p_evaluationId) AllPagesT
  		LEFT JOIN
  		  (SELECT
  			P.id,
  			count(distinct(MA.criterionsId), 0) as `Criterios(Cantidad)`
  		   FROM Pages P
  			JOIN ManualPages MP on MP.pagesId = P.id
  			JOIN SpecificationsByManualPages SMP on SMP.manualPagesId = MP.id
  			JOIN ManualAnswers MA on MA.specificationsByManualPagesId = SMP.id
  			where P.evaluationsId = p_evaluationId and complyState = -1
  		 	group by P.id
  		  ) as CriterionsByPageT
  		 ON AllPagesT.id = CriterionsByPageT.id
  		)
    ) AS RESULT_TABLE, (SELECT @rownum := 0) r;
END ;;
DELIMITER ;;

-- Return the diferent failed criterion quantity for page in automatic evaluation.
DROP procedure IF EXISTS `SP_failedCriterionsByPageForAutomatic`;

DELIMITER ;;
CREATE PROCEDURE `SP_failedCriterionsByPageForAutomatic`(IN p_evaluationId int)
BEGIN
 SELECT * from (
  SELECT 
	@rownum := @rownum + 1 AS `Páginas`, 
    PageStatisticsWithCounter.`Criterios(Cantidad)`
  FROM 
	(
      SELECT 
		  AllPagesT.id,
		  IFNULL(CriterionsByPageT.`Criterios(Cantidad)`, 0) `Criterios(Cantidad)`,
          AllPagesT.url
		FROM (
		(SELECT * from Pages where evaluationsId = p_evaluationId) AllPagesT
		LEFT JOIN
		  (
          SELECT P.id, count(distinct(F.criterionsId)) as `Criterios(Cantidad)` FROM Pages P 
			JOIN AutomaticEvaluatorPages AP on AP.pagesId = P.id
			JOIN Findings F on F.automaticEvaluatorPagesId = AP.id
			where P.evaluationsId = p_evaluationId
		   group by P.id
		  ) as CriterionsByPageT
		 ON AllPagesT.id = CriterionsByPageT.id
		)
	 )    
	AS PageStatisticsWithCounter, (SELECT @rownum := 0) r
	) AS TABLE_WITHOUT_CERO
	where TABLE_WITHOUT_CERO.`Criterios(Cantidad)` != 0;
END ;;

DELIMITER ;;

-- Return the diferent failed criterion quantity by page for automatic evaluation
-- and data includes URL.
DROP procedure IF EXISTS `SP_failedCriterionsByPageForAutomaticForTable`;

DELIMITER ;;
CREATE PROCEDURE `SP_failedCriterionsByPageForAutomaticForTable`(IN p_evaluationId int)
BEGIN
  SELECT 
	@rownum := @rownum + 1 AS `Páginas`, 
    PageStatisticsWithCounter.`Criterios(Cantidad)`,
    PageStatisticsWithCounter.url
  FROM 
	(
      SELECT 
		  AllPagesT.id,
		  IFNULL(CriterionsByPageT.`Criterios(Cantidad)`, 0) `Criterios(Cantidad)`,
          AllPagesT.url
		FROM (
		(SELECT * from Pages where evaluationsId = p_evaluationId) AllPagesT
		LEFT JOIN
		  (
          SELECT P.id, count(distinct(F.criterionsId)) as `Criterios(Cantidad)` FROM Pages P 
			JOIN AutomaticEvaluatorPages AP on AP.pagesId = P.id
			JOIN Findings F on F.automaticEvaluatorPagesId = AP.id
			where P.evaluationsId = p_evaluationId
		   group by P.id
		  ) as CriterionsByPageT
		 ON AllPagesT.id = CriterionsByPageT.id
		)
	 )    
	AS PageStatisticsWithCounter, (SELECT @rownum := 0) r;
END ;;

DELIMITER ;;

-- Return an observation, given a page and a principle
DROP procedure IF EXISTS `SP_observationByRecomendation`;

DELIMITER ;;
CREATE PROCEDURE `SP_observationByRecomendation`(
  IN p_principleId  INT,
  IN p_manualPageId  INT
)
BEGIN
    DECLARE evaluatorObservation VARCHAR(2500) DEFAULT '';
    IF  p_principleId = 1 THEN
        SET evaluatorObservation = (
            SELECT percetibleObservation FROM DS_EAW.ManualPages WHERE id = p_manualPageId
        );
    ELSEIF p_principleId = 2 THEN
        SET evaluatorObservation = (
            SELECT operableObservation FROM DS_EAW.ManualPages WHERE id = p_manualPageId
        );
    ELSEIF p_principleId = 3 THEN
        SET evaluatorObservation = (
            SELECT distinguishableObservation FROM DS_EAW.ManualPages WHERE id = p_manualPageId
        );
    ELSEIF p_principleId = 4 THEN
        SET evaluatorObservation = (
            SELECT robustObservation FROM DS_EAW.ManualPages WHERE id = p_manualPageId
        );
    END IF;

    IF (evaluatorObservation IS NULL) THEN
        SET evaluatorObservation = 'No hay ninguna observación por parte del Evaluador para este principio.';
    END IF;

    SELECT evaluatorObservation AS evaluatorObservation;
END ;;
DELIMITER ;;

-- SP for pie graphic data for manual evaluation.
DROP procedure IF EXISTS `SP_generalEvaluationStateForManual`;

DELIMITER ;;
CREATE PROCEDURE `SP_generalEvaluationStateForManual`( 
  IN p_evaluationId  INT
)
BEGIN
	DECLARE FAILED_STATE smallint DEFAULT -1;
    DECLARE numberOfCriterionUsed INT DEFAULT 0;
	DECLARE pagesQuantity INT DEFAULT 0;
    DECLARE findingInPagesQ INT DEFAULT 0;
	-- failed percentage could be from 00,00 to 100
    DECLARE failedPercentage FLOAT default 0;

    -- Quantity of an evaluation pages
    SET numberOfCriterionUsed = (
		SELECT COUNT(DISTINCT(criterionsId)) FROM DS_EAW.Specifications S
		JOIN CriterionsByDisabilityRoles CBD on CBD.disabilitiesId = S.disabilitiesId
		where S.evaluationsId = p_evaluationId
    );
	-- Quantity of an evaluation pages
    SET pagesQuantity = (
		SELECT COUNT(Pages.id) FROM DS_EAW.Pages 
		where evaluationsId = p_evaluationId
	);
	-- Un repeated errors from idPage and criterion combination
    SET findingInPagesQ = (SELECT count(DISTINCT(concat(P.id,'-', MA.criterionsId))) FROM Pages P
		JOIN ManualPages MP on MP.pagesId = P.id
		JOIN SpecificationsByManualPages SMP on SMP.manualPagesId = MP.id
		JOIN ManualAnswers MA on MA.specificationsByManualPagesId = SMP.id
		where P.evaluationsId = p_evaluationId and MA.complyState = FAILED_STATE
	);
    
    -- Prevent division by zero
    IF  pagesQuantity != 0 THEN 
		SET failedPercentage = ( (findingInPagesQ * 100) / (pagesQuantity * numberOfCriterionUsed));
	ELSEIF pagesQuantity = 0 THEN 
		SET failedPercentage = 0;
	END IF;
    
	select TRUNCATE(failedPercentage, 2) AS Incumplimiento, TRUNCATE((100 - failedPercentage), 2) AS Cumplimiento;
END ;;

DELIMITER ;;

-- SP for Complete Report and Manual report
-- Return the diferent failed criterion with recommendations for manual evaluation section, recives the principle ID and de Specification By Manual Pages ID
DROP procedure IF EXISTS `SP_failedCriterionsWithRecommendationForManualEvaluation`;

DELIMITER ;;
CREATE PROCEDURE `SP_failedCriterionsWithRecommendationForManualEvaluation`(
IN p_principlesId INT, IN p_specificationsByManualPagesId INT)
BEGIN
  -- select from the join to filter only the criterions that have recommendations
	SELECT DISTINCT CritData.idCriterion, CritData.criterionName, CritData.referenceLink  
    FROM
		(SELECT c.id idCriterion,
		CONCAT_WS( ' ','Criterio',c.numberCriterion,'-',c.name) criterionName,
		c.`referenceLink` referenceLink
		FROM `DS_EAW`.`Criterions` c
			INNER JOIN `DS_EAW`.`Guidelines` g ON 
			 c.`guidelinesId` = g.id 
		WHERE 
			g.`principlesId` = p_principlesId) AS CritData
            
		INNER JOIN

    (SELECT r.descriptionRecommendation, r.criterionsId idCriterion
    FROM DS_EAW.ManualAnswers m
			INNER JOIN DS_EAW.Recommendations r ON m.recommendationsId = r.id
		WHERE m.criterionsId =  r.criterionsId  AND 
			m.complyState =  '-1' AND
			m.specificationsByManualPagesId = p_specificationsByManualPagesId) AS Recomm 
            
            ON CritData.idCriterion = Recomm.idCriterion
		
        ORDER BY CritData.idCriterion ASC;
END ;;
DELIMITER ;;



-- ----------
-- Count all by guideline for automatic

DROP procedure IF EXISTS `SP_findingsByGuidelineForPackage1`;

DELIMITER $$
USE `DS_EAW`$$
CREATE PROCEDURE `SP_findingsByGuidelineForPackage1`(
  IN p_evaluationId  INT
)
BEGIN
	Select T1.Pautas, T1.`Criterios(Cantidad)`, T2.`CriteriosPorPauta` from (  
	  SELECT concat(G.numberGuidelines," ",G.name) as Pautas, count(Distinct((F.criterionsId))) as `Criterios(Cantidad)`
		FROM Pages P
		JOIN AutomaticEvaluatorPages AP on AP.pagesId = P.id
		JOIN Findings F on F.automaticEvaluatorPagesId = AP.id
		JOIN Criterions C on C.id = F.criterionsId
		JOIN Guidelines G on G.id = C.guidelinesId
		where P.evaluationsId = p_evaluationId
		group by G.id
		order by G.numberGuidelines
	) T1 JOIN (
	  SELECT concat(G.numberGuidelines," ",G.name) as Pautas, count(C.id) as `CriteriosPorPauta` FROM DS_EAW.Criterions C
		JOIN Guidelines G on G.id = C.guidelinesId
        -- where C.isEvaluatedByAutomatic = 1
		-- Un comment if you need to filter by the evaluated by automatic
		group by C.guidelinesId
	) T2
	  on T1.Pautas = T2.Pautas;
END$$

DELIMITER ;


-- -----------------------------------------------------------
-- SP for counting findings and failed criterion by guideline

USE `DS_EAW`;
DROP procedure IF EXISTS `SP_CountAllFindingsCriterionsByGuidelineForAutomaticForJasper`;

DELIMITER $$
USE `DS_EAW`$$
CREATE PROCEDURE `SP_CountAllFindingsCriterionsByGuidelineForAutomaticForJasper`(
  IN p_evaluationId  INT
)
BEGIN
	Select T1.Pautas, T1.`Criterios(Cantidad)`, T1.`Hallazgos(cantidad)`, T2.`CriteriosPorPauta` from (  
	  SELECT 
		concat(G.numberGuidelines," ",G.name) as Pautas,
        COUNT(F.criterionsId) AS `Hallazgos(cantidad)`,
		count(Distinct((F.criterionsId))) as `Criterios(Cantidad)`
		FROM Pages P
		JOIN AutomaticEvaluatorPages AP on AP.pagesId = P.id
		JOIN Findings F on F.automaticEvaluatorPagesId = AP.id
		JOIN Criterions C on C.id = F.criterionsId
		JOIN Guidelines G on G.id = C.guidelinesId
		where P.evaluationsId = p_evaluationId
		group by G.id
		order by G.numberGuidelines
	) T1 JOIN (
	  SELECT concat(G.numberGuidelines," ",G.name) as Pautas, count(C.id) as `CriteriosPorPauta` FROM DS_EAW.Criterions C
		JOIN Guidelines G on G.id = C.guidelinesId
		-- where C.isEvaluatedByAutomatic = 1
		-- Un comment if you need to filter by the evaluated by automatic
		group by C.guidelinesId
	) T2
	  on T1.Pautas = T2.Pautas;
END$$

DELIMITER ;




-- ------------------------------------------------------------------------------
-- All quantity for criterions and findings by page, criterion and url for table

USE `DS_EAW`;
DROP procedure IF EXISTS `SP_CountAllFindingsCriterionsByPageForAutomaticForJasper`;

DELIMITER $$
USE `DS_EAW`$$
CREATE PROCEDURE `SP_CountAllFindingsCriterionsByPageForAutomaticForJasper`(IN p_evaluationId int)
BEGIN
  DECLARE numberOfCriterionUsed INT DEFAULT 0;
  SET numberOfCriterionUsed = (
    SELECT count(*) FROM DS_EAW.Criterions where isEvaluatedByAutomatic = 1
  );
    
  SELECT
	@rownum := @rownum + 1 AS `Páginas`,
    PageStatisticsWithCounter.`Criterios(Cantidad)`,
	PageStatisticsWithCounter.`Hallazgos(Cantidad)`,
    PageStatisticsWithCounter.url,
    numberOfCriterionUsed as totalCriterios
  FROM
	(
      SELECT
		  AllPagesT.id,
		  IFNULL(CriterionsByPageT.`Criterios(Cantidad)`, 0) `Criterios(Cantidad)`,
          IFNULL(CriterionsByPageT.`Hallazgos(Cantidad)`, 0) `Hallazgos(Cantidad)`,
          AllPagesT.url
		FROM (
		(SELECT * from Pages where evaluationsId = p_evaluationId) AllPagesT
		LEFT JOIN
		  (
          SELECT P.id, 
			count(distinct(F.criterionsId)) as `Criterios(Cantidad)`, 
			count(F.criterionsId) as `Hallazgos(Cantidad)`
            FROM Pages P
			JOIN AutomaticEvaluatorPages AP on AP.pagesId = P.id
			JOIN Findings F on F.automaticEvaluatorPagesId = AP.id
			where P.evaluationsId = p_evaluationId
		   group by P.id
		  ) as CriterionsByPageT
		 ON AllPagesT.id = CriterionsByPageT.id
		)
	 )
	AS PageStatisticsWithCounter, (SELECT @rownum := 0) r;
END$$

DELIMITER ;

-- Count all noComply answers and failed criterion and all by guideline

USE `DS_EAW`;
DROP procedure IF EXISTS `SP_CountAllFailedAnswersCriterionsByGuidelineForManualForJasper`;

DELIMITER $$
USE `DS_EAW`$$
CREATE PROCEDURE `SP_CountAllFailedAnswersCriterionsByGuidelineForManualForJasper`(
  IN p_evaluationId  INT
)
BEGIN
	Select T1.Pautas, T1.`Criterios(Cantidad)`, T1.`Hallazgos(Cantidad)`, T2.`CriteriosPorPauta` from (
	 SELECT 
		concat(G.numberGuidelines," ",G.name) as Pautas, 
		count(DISTINCT(MA.criterionsId)) as `Criterios(Cantidad)`,
		count(MA.criterionsId) as `Hallazgos(Cantidad)`
		FROM Pages P
		  JOIN ManualPages MP on MP.pagesId = P.id
		  JOIN SpecificationsByManualPages SMP on SMP.manualPagesId = MP.id
		  JOIN ManualAnswers MA on MA.specificationsByManualPagesId = SMP.id
		  JOIN Criterions C on C.id = MA.criterionsId
		  JOIN Guidelines G on G.id = C.guidelinesId
		  where P.evaluationsId = p_evaluationId and complyState = -1
		  group by G.id
		  order by G.numberGuidelines
	) T1 JOIN (
	  SELECT 
		concat(G.numberGuidelines," ",G.name) as Pautas, count(C.id) as `CriteriosPorPauta`
		FROM DS_EAW.Criterions C
		  JOIN Guidelines G on G.id = C.guidelinesId
		  group by C.guidelinesId
	) T2
	  on T1.Pautas = T2.Pautas;
END$$

DELIMITER ;

--------------------------------------
-- Count all noComply answers and failed criterion and all by evaluated page

USE `DS_EAW`;
DROP procedure IF EXISTS `SP_CountAllFailedAnswersCriterionsByPageForManualForJasper`;

DELIMITER $$
USE `DS_EAW`$$
CREATE PROCEDURE `SP_CountAllFailedAnswersCriterionsByPageForManualForJasper`(
  IN p_evaluationId  INT
)
BEGIN
	DECLARE FAILED_STATE smallint DEFAULT -1;
    DECLARE numberOfCriterionUsed INT DEFAULT 0;
    
	SET numberOfCriterionUsed = (
	  SELECT COUNT(DISTINCT(criterionsId)) FROM DS_EAW.Specifications S
		JOIN CriterionsByDisabilityRoles CBD on CBD.disabilitiesId = S.disabilitiesId
		where S.evaluationsId = p_evaluationId
	);
    
	SELECT
		@rownum := @rownum + 1 AS `Páginas`,
		RESULT_TABLE.`Criterios(Cantidad)`,
        numberOfCriterionUsed as `totalCriterios`,
		RESULT_TABLE.`Hallazgos(Cantidad)`,
		RESULT_TABLE.url
	FROM
	(SELECT
	  AllPagesT.id,
	  IFNULL(CriterionsByPageT.`Criterios(Cantidad)`, 0) `Criterios(Cantidad)`,
	  IFNULL(CriterionsByPageT.`Hallazgos(Cantidad)`, 0) `Hallazgos(Cantidad)`,
	  AllPagesT.url
	FROM (
	  (SELECT * from Pages where evaluationsId = p_evaluationId) AllPagesT
		LEFT JOIN
	  (SELECT
		P.id,
		count(distinct(MA.criterionsId), 0) as `Criterios(Cantidad)`,
		count(MA.criterionsId) as `Hallazgos(Cantidad)`
	   FROM Pages P
		JOIN ManualPages MP on MP.pagesId = P.id
		JOIN SpecificationsByManualPages SMP on SMP.manualPagesId = MP.id
		JOIN ManualAnswers MA on MA.specificationsByManualPagesId = SMP.id
		where P.evaluationsId = p_evaluationId and complyState = FAILED_STATE
		group by P.id
	  ) as CriterionsByPageT
	 ON AllPagesT.id = CriterionsByPageT.id
	)
	) AS RESULT_TABLE, (SELECT @rownum := 0) r;
END$$

DELIMITER ;

