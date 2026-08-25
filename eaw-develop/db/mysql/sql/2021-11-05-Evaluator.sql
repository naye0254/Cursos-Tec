
-- Changes used in EAW Jasper report
-- ------------------------------------
-- update to fix unexpected blank spaces

USE `DS_EAW`;
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

-- ------------------------------------
-- Update criterion table

USE `DS_EAW`;

-- ALTER TABLE `DS_EAW`.`Criterions` ADD COLUMN `isEvaluatedByAutomatic` TINYINT(1) NULL DEFAULT b'0' COMMENT 'Evaluated by pa11y 5.1.0.' ;

UPDATE `DS_EAW`.`Criterions` SET `isEvaluatedByAutomatic`= 1
	WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 43, 44, 48, 50, 51, 53, 54, 56, 60, 61, 62, 63, 65, 74, 75);

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
	Select T1.Pautas, T1.`Criterios(Cantidad)`, T1.`Hallazgos(Cantidad)`, T2.`CriteriosPorPauta` from (  
	  SELECT 
		concat(G.numberGuidelines," ",G.name) as Pautas,
        COUNT(F.criterionsId) AS `Hallazgos(Cantidad)`,
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

-- ------------------------------------
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

-- Add missin level A criterions for disabilties 1 and 2... and others

-- INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('2', '27');
-- INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('3', '27');
-- INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('5', '27');

-- INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('1', '26');
-- INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('2', '26');

-- INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('1', '73');
-- INSERT INTO `DS_EAW`.`CriterionsByDisabilityRoles` (`disabilitiesId`, `criterionsId`) VALUES ('2', '73');



-- UPDATE `DS_EAW`.`Criterions` SET `criterionDescription`='Para cada límite de tiempo impuesto por el contenido, se cumple al menos uno de los siguientes casos. Ese tiempo límite se puede: \"Apagar\", \"Ajustar\" o \"Extender\"; excepto: En tiempo real, si es esencial, si son 20 horas o más.' WHERE `id`='26';

