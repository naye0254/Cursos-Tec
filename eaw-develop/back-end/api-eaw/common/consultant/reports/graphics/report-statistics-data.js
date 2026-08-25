const app = require('../../../../server/server');

const CustomErrorLog = require('../../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../../eaw-constants');

/**
 * Service to manage data to show in the report
 * graphic charts.
 */
module.exports = function ReportStatisticsData() {
  const eAWConstants = new EAWConstants();

  const criterionsModel = app.models.Criterions;
  const findingsModel = app.models.Findings;
  const guidelinesModel = app.models.Guidelines;
  const manualAnswersModel = app.models.ManualAnswers;

  const manualPagesModel = app.models.ManualPages;
  const automaticPagesModel = app.models.AutomaticEvaluatorPages;

  /**
   * Generate statistics for un evaluated criteria by page.
   * data: [
   *  { name: 'No cumple', y: 61.41, sliced: true},
   *  { name: 'Cumple', y: 10.85}
   * ]
   * @param {number} evaluationId
   */
  this.getGeneralAccesibilityGraphicData = async function(evaluationId, type) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      const columnVariableNames = ['Incumplimiento', 'Cumplimiento'];
      let automaticPagesQuantity = 0;
      let failedAutomaticPages = 0;
      let manualPagesQuantity = 0;
      let failedManualPages = 0;

      if (
        type === eAWConstants.GeneralGraphicDataTypes.AUTOMATIC ||
        type === eAWConstants.GeneralGraphicDataTypes.BOTH
      ) {
        automaticPagesQuantity = await automaticPagesModel
          .automaticPagesByEvaluation(evaluationId)
          .then(data => data.length);
        failedAutomaticPages = await this.reportFindingsByPage(
          evaluationId,
        ).then(data => data.results.xVariableList.length);
      }
      if (
        type === eAWConstants.GeneralGraphicDataTypes.MANUAL ||
        type === eAWConstants.GeneralGraphicDataTypes.BOTH
      ) {
        manualPagesQuantity = await app.models.Specifications.findOne({
          where: {
            evaluationsId: evaluationId,
          },
          fields: ['id', 'evaluationsId'],
        }).then(async specification => {
          if (specification === null) {
            return 0;
          }
          return await manualPagesModel
            .manualPagesBySpecification(specification.id)
            .then(data => data.length);
        });
        failedManualPages = await this.getManualStatisticsByPage(
          evaluationId,
        ).then(data => data.results.xVariableList.length);
      }

      const totalPagesQuantity = automaticPagesQuantity + manualPagesQuantity;
      const totalFailed = failedManualPages + failedAutomaticPages;
      const percentage =
        totalPagesQuantity === 0 ? 0 : (totalFailed / totalPagesQuantity) * 100;
      const truncPercentage = Math.trunc(100 * percentage) / 100;

      const yVariablesData = [
        {
          name: 'Incumplimiento',
          y: truncPercentage,
          sliced: true,
        },
        {
          name: 'Cumplimiento',
          y: 100 - truncPercentage,
        },
      ];

      const yVariablePieFormat = [
        {
          name: 'Accesibilidad',
          colorByPoint: true,
          data: yVariablesData,
        },
      ];

      returnObj.results = {
        xVariableList: columnVariableNames,
        yVariableForPie: yVariablePieFormat,
        yVariableList: [
          {
            name: 'Porcentaje',
            data: [truncPercentage, 100 - truncPercentage],
          },
        ],
      };

      return returnObj;
    } catch (error) {
      throw handleError(
        error,
        'getGeneralAccesibilityGraphicData',
        evaluationId,
      );
    }
  };

  /**
   * Generate statistics for un evaluated criteria by guideline.
   * @param {number} evaluationId
   */
  this.reportFindingsByGuideline = async function(evaluationId) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      let columnVariableNames = await createGuidelineIndexedByGuidelineId();

      const findings = await findingsModel
        .findingsByEvaluation(evaluationId)
        .then(result => result.results);
      const criterions = await criterionsModel.find({
        where: {
          id: {
            inq: eAWConstants.PallyConstants.EVALUATED_CRITERION_LIST,
          },
        },
      });
      const guidelinesIndexedByCriterionId = await createGuidelineListIndexedByCriterionId(
        criterions,
      );

      let compyOrNotCriterion = [];
      for (const finding of findings) {
        if (finding.findingType === eAWConstants.PallyConstants.FINDING_ERROR) {
          compyOrNotCriterion[finding.criterionsId] = false;
        }
      }

      let noComplyGuidelinesCounter = [];
      for (const criterionId in compyOrNotCriterion) {
        if (!compyOrNotCriterion[criterionId]) {
          if (
            noComplyGuidelinesCounter[
              guidelinesIndexedByCriterionId[criterionId]
            ] == null
          ) {
            noComplyGuidelinesCounter[
              guidelinesIndexedByCriterionId[criterionId]
            ] = 1;
          } else {
            noComplyGuidelinesCounter[
              guidelinesIndexedByCriterionId[criterionId]
            ] =
              noComplyGuidelinesCounter[
                guidelinesIndexedByCriterionId[criterionId]
              ] + 1;
          }
        }
      }

      const filteredData = await removeNullAndZeroFields(
        [noComplyGuidelinesCounter],
        columnVariableNames,
      );
      noComplyGuidelinesCounter = filteredData.newfindingCounters['0'];
      columnVariableNames = filteredData.newColumnVariableNames;

      let multi_Y_VariableList = [
        {name: 'No cumple', data: noComplyGuidelinesCounter},
      ];
      returnObj.results = {
        xVariableList: columnVariableNames,
        yVariableList: multi_Y_VariableList,
      };
      return returnObj;
    } catch (error) {
      throw handleError(error, 'reportFindingsByGuideline', evaluationId);
    }
  };

  /**
   * Get automatic data for statistics report by page.
   * @param {number} evaluationId
   */
  this.reportFindingsByPage = async function(evaluationId) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      const findings = await findingsModel
        .findingsByEvaluation(evaluationId)
        .then(result => result.results);
      let pages = {};
      for (const finding of findings) {
        if (finding.findingType === eAWConstants.PallyConstants.FINDING_ERROR) {
          if (pages[finding.url] == undefined) {
            pages[finding.url] = {};
          } else {
            pages[finding.url][finding.criterionsId] = true;
          }
        }
      }
      for (const key in pages) {
        pages[key] = Object.keys(pages[key]).length;
      }

      let index = 1;
      const pageURLs = [];
      const columnNames = [];
      const noComplyCounter = [];
      for (const url in pages) {
        if (pages[url] !== 0) {
          pageURLs.push(url);
          noComplyCounter.push(pages[url]);
          columnNames.push(index);
          index++;
        }
      }
      const multi_Y_VariableList = [{name: 'No cumple', data: noComplyCounter}];
      returnObj.results = {
        xVariableList: columnNames,
        yVariableList: multi_Y_VariableList,
        variableYForTables: {name: 'URL', data: pageURLs},
      };

      return returnObj;
    } catch (error) {
      throw handleError(error, 'reportFindingsByPage', evaluationId);
    }
  };

  /**
   * Get manual data for statistics report by page.
   * @param {number} evaluationId
   */
  this.getManualStatisticsByPage = async function(evaluationId) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      const manualAnswers = await manualAnswersModel.getManualAnswersBySpecificationOrEvaluation(
        evaluationId,
      );

      let pages = {};
      const unRepeatedCriterion = {};
      for (const manualAnswer of manualAnswers) {
        if (manualAnswer.complyState === eAWConstants.ComplyState.NO_COMPLY) {
          pages[manualAnswer.url] = 0;
          unRepeatedCriterion[manualAnswer.criterionsId] = manualAnswer.url;
        }
      }

      let url = '';
      for (const criterionId in unRepeatedCriterion) {
        url = unRepeatedCriterion[criterionId];
        pages[url] = pages[url] + 1;
      }

      let index = 1;
      const pageURLs = [];
      const columnNames = [];
      const noComplyCounter = [];
      for (const url in pages) {
        if (pages[url] !== 0) {
          pageURLs.push(url);
          noComplyCounter.push(pages[url]);
          columnNames.push(index);
          index++;
        }
      }

      const multi_Y_VariableList = [{name: 'No cumple', data: noComplyCounter}];
      returnObj.results = {
        xVariableList: columnNames,
        yVariableList: multi_Y_VariableList,
        variableYForTables: {name: 'URL', data: pageURLs},
      };

      return returnObj;
    } catch (error) {
      throw handleError(error, 'getManualStatisticsByPage', evaluationId);
    }
  };

  /**
   * Generate statistics for un evaluated criteria by page.
   * @param {number} evaluationId
   */
  this.getManualStatisticsByGuideline = async function(evaluationId) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      let columnVariableNames = await createGuidelineIndexedByGuidelineId();

      const manualAnswers = await manualAnswersModel.getManualAnswersBySpecificationOrEvaluation(
        evaluationId,
      );
      const criterions = await criterionsModel.find({
        where: {
          id: {
            inq: eAWConstants.PallyConstants.EVALUATED_CRITERION_LIST,
          },
        },
      });
      const guidelinesIndexedByCriterionId = await createGuidelineListIndexedByCriterionId(
        criterions,
      );

      let compyOrNotCriterion = [];
      for (const manualAnswer of manualAnswers) {
        if (manualAnswer.complyState == eAWConstants.ComplyState.NO_COMPLY) {
          compyOrNotCriterion[manualAnswer.criterionsId] = false;
        }
      }

      let noComplyGuidelinesCounter = [];
      for (const criterionId in compyOrNotCriterion) {
        if (!compyOrNotCriterion[criterionId]) {
          if (
            noComplyGuidelinesCounter[
              guidelinesIndexedByCriterionId[criterionId]
            ] == undefined
          ) {
            noComplyGuidelinesCounter[
              guidelinesIndexedByCriterionId[criterionId]
            ] = 1;
          } else {
            noComplyGuidelinesCounter[
              guidelinesIndexedByCriterionId[criterionId]
            ] =
              noComplyGuidelinesCounter[
                guidelinesIndexedByCriterionId[criterionId]
              ] + 1;
          }
        }
      }
      const filteredData = await removeNullAndZeroFields(
        [noComplyGuidelinesCounter],
        columnVariableNames,
      );
      noComplyGuidelinesCounter = filteredData.newfindingCounters['0'];
      columnVariableNames = filteredData.newColumnVariableNames;

      let multi_Y_VariableList = [
        {name: 'No cumple', data: noComplyGuidelinesCounter},
      ];
      returnObj.results = {
        xVariableList: columnVariableNames,
        yVariableList: multi_Y_VariableList,
      };
      return returnObj;
    } catch (error) {
      throw handleError(error, 'getManualStatisticsByGuideline', evaluationId);
    }
  };

  /**
   * Return a list of guideline names by criterion
   */
  async function createGuidelineIndexedByGuidelineId() {
    const guidelineList = await guidelinesModel.find();
    const guidelinesListIndexedByGuidelinesId = [];
    for (const guideline of guidelineList) {
      guidelinesListIndexedByGuidelinesId[guideline.id] =
        guideline.numberGuidelines + ' ' + guideline.name;
    }
    return guidelinesListIndexedByGuidelinesId;
  }

  /**
   * Return a list with criterion id as index and
   * a guideline id as the value
   * @param {array<object>} criterionList
   * @returns {map<number, number>}
   */
  async function createGuidelineListIndexedByCriterionId(criterionList) {
    let guidelineListIndexedByCriterionId = [];
    for (let criteria of criterionList) {
      guidelineListIndexedByCriterionId[criteria.id] = criteria.guidelinesId;
    }
    return guidelineListIndexedByCriterionId;
  }

  /**
   * Remove null and zero fields if the same position
   * of all arrays inside findingCounterLists are null or zero
   * and maintain names in columnVariableNames that does
   * not match those removed fields.
   * @param {Array<Array<number>>} findingCounterLists
   * @param {Array<string>} columnVariableNames
   */
  async function removeNullAndZeroFields(
    findingCounterLists,
    columnVariableNames,
  ) {
    const result = {
      newfindingCounters: {},
      newColumnVariableNames: [],
    };
    let newfindingCounterLists = [];
    const iterableLists = [];

    Object.keys(findingCounterLists).forEach(key => {
      iterableLists.push(findingCounterLists[key]);
      newfindingCounterLists.push([]);
      result.newfindingCounters[key] = [];
    });
    columnVariableNames.forEach((name, nameIndex) => {
      if (name != undefined) {
        let allGuidelineGraderZero = 0;
        for (let index = 0; index < iterableLists.length; index++) {
          let errorListByType = iterableLists[index][nameIndex];
          if (errorListByType != undefined) {
            allGuidelineGraderZero =
              allGuidelineGraderZero + iterableLists[index][nameIndex];
          }
        }
        if (!(allGuidelineGraderZero == 0)) {
          result.newColumnVariableNames.push(name);
          for (let index2 = 0; index2 < iterableLists.length; index2++) {
            let errorListByType = iterableLists[index2][nameIndex];
            if (errorListByType == undefined) {
              newfindingCounterLists[index2].push(0);
            } else {
              newfindingCounterLists[index2].push(errorListByType);
            }
          }
        }
      }
    });
    Object.keys(result.newfindingCounters).forEach((key, index) => {
      result.newfindingCounters[key] = newfindingCounterLists[index];
    });

    return result;
  }

  /**
   * Function to store errors
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId = null) {
    new CustomErrorLog(
      'BE > ChartPDFCreator > ' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
