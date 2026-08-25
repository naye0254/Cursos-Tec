-- change size varchar observations
alter table ManualPages modify percetibleObservation varchar(2500) null;

alter table ManualPages modify operableObservation varchar(2500) null;

alter table ManualPages modify distinguishableObservation varchar(2500) null;

alter table ManualPages modify robustObservation varchar(2500) null;

-- Return Findings quantity by guideline
/**/
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

DROP procedure IF EXISTS `SP_generalEvaluationStateForPackage1`;;

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
DROP procedure IF EXISTS `SP_samplePages`;;

DELIMITER ;;
CREATE  PROCEDURE `SP_samplePages`(
    IN p_evaluationId INT
)
BEGIN
SELECT @rownum := @rownum + 1 AS 'index',  Pages.url, Pages.title
  FROM (
    select P.url, P.title  from  `DS_EAW`.`Pages` P where P.evaluationsId = p_evaluationId
) as Pages, (SELECT @rownum := 0) r;
END ;;
DELIMITER ;;

-- SP for Complete Report
-- Return the diferent failed criterion quantity for guideline
DROP procedure IF EXISTS `SP_manualAnswersByGuidelineForPackage3`;;

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
DROP procedure IF EXISTS `SP_failedCriterionsByPageForManual`;;

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
DROP procedure IF EXISTS `SP_failedCriterionsByPageForManualForTable`;;

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
DROP procedure IF EXISTS `SP_failedCriterionsByPageForAutomatic`;;

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

-- ##
-- Return the diferent failed criterion quantity by page for automatic evaluation
-- and data includes URL.
DROP procedure IF EXISTS `SP_failedCriterionsByPageForAutomaticForTable`;;

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


DROP procedure IF EXISTS `SP_observationByRecomendation`;;

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
DROP procedure IF EXISTS `SP_generalEvaluationStateForManual`;;

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
DROP procedure IF EXISTS `SP_failedCriterionsWithRecommendationForManualEvaluation`;;

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
DELIMITER ;

-- 26 Aug 2021

-- alter table NodesServes
--   add queueIsRunning tinyint(1) default 0 not null;

-- 15 Sep 2021

ALTER TABLE `DS_EAW`.`Evaluations` 
CHANGE COLUMN `siteName` `siteName` VARCHAR(150) NULL DEFAULT NULL ;

-- Add Column to Evaluation table 18-06-21
-- ALTER TABLE Evaluations ADD column isDeleted tinyint(1) NOT NULL DEFAULT 0;

