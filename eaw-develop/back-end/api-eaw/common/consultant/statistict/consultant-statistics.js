'use strict';

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');
const AutomaticPagesServices = require('../../administrator/evaluations-manage/automatic-pages-services');
const ManualPagesServices = require('../../administrator/evaluations-manage/manual-pages-services');
const _ = require('lodash');
const app = require('../../../server/server');

module.exports = function ConsultantStatistics() {
  const eAWConstants = new EAWConstants();
  const criterionModel = app.models.Criterions;
  const findingsModel = app.models.Findings;
  const guidelinesModel = app.models.Guidelines;
  const manualAnswersModel = app.models.ManualAnswers;
  const specificationsByManualPagesModel = app.models.SpecificationsByManualPages;
  const manualPagesModel = app.models.ManualPages;
  const evaluationsModel = app.models.Evaluations;
  const segmentModel = app.models.Segments;
  const usersModel = app.models.Users;

  /**
   * Get statistics from automatic evaluation data.
   * @param {number} evaluationId
   * @param {string} conformityLevel
   * @param {array} guidelines
   * @param {array} pageList
   */
  this.getStatisticsByGuideLineAutomatic = async function(
    evaluationId,
    conformityLevel = null,
    guidelines = [],
    pageList = [],
    cb
  ) {
    const returnObj = {results: {}, count: null, message: []};
    const automaticPagesServices = new AutomaticPagesServices();
    const showStatistisByCriterion = guidelines.length > 0;
    let automaticPagesList = [];
    try {
      const pagesIdList = await getIdList(pageList);
      const filteredCriterion = await getCriterionByGuidelineAndLevel(conformityLevel, guidelines);
      automaticPagesList = await automaticPagesServices
        .automaticPagesByEvaluation(evaluationId)
        .then(automaticPages => {
          return automaticPages.filter(result => {
            return pagesIdList.includes(result.pagesId) || pageList.length === 0;
          });
        });

      let findingsByPage = await getFindingsByAutomaticPages(automaticPagesList);
      let findingCounterLists = {error: [], warning: [], notice: []};
      let columnVariableNames = [];
      let listZeroFieldsRemoved = {};

      if (showStatistisByCriterion) {
        let criterionListIndexedByCriterionId = await createCriterionListIndexedByCriterionId(
          filteredCriterion
        );
        findingCounterLists = await countAutomaticFindingsByCriteria(
          findingsByPage,
          findingCounterLists
        );
        columnVariableNames = await getColumnsNamesByCriterion(
          findingCounterLists,
          criterionListIndexedByCriterionId
        );
        listZeroFieldsRemoved = await removeNullAndZeroFields(
          findingCounterLists,
          columnVariableNames
        );
      } else {
        let guidelineListIndexedByCriterionId = await createGuidelineListIndexedByCriterionId(
          filteredCriterion
        );
        findingCounterLists = await countAutomaticFindingsByGuideline(
          guidelineListIndexedByCriterionId,
          findingsByPage,
          findingCounterLists
        );
        let guidelineIndexedByGuidelineId = await createGuidelineIndexedByGuidelineId();
        columnVariableNames = await getColumnsNamesByGuideline(
          findingCounterLists,
          guidelineIndexedByGuidelineId
        );
        listZeroFieldsRemoved = await removeNullAndZeroFields(
          findingCounterLists,
          columnVariableNames
        );
      }

      findingCounterLists = listZeroFieldsRemoved.newfindingCounters;
      columnVariableNames = listZeroFieldsRemoved.newColumnVariableNames;
      let multi_Y_VariableList = [
        {name: 'No cumple', data: findingCounterLists.error},
        {name: 'Advertencias', data: findingCounterLists.warning}
      ];
      if (!eAWConstants.StatisticsConstants.TREAT_NOTICES_AS_WARNINGS) {
        multi_Y_VariableList.push({
          name: 'Requiere revisión humana',
          data: findingCounterLists.notice
        });
      }
      returnObj.results = {
        xVariableList: columnVariableNames,
        yVariableList: multi_Y_VariableList
      };

      return await returnObj;
    } catch (error) {
      throw handleError(error, 'getStatisticsByGuideLineAutomatic', evaluationId);
    }
  };

  /**
   * Get statistics from manual evaluation data.
   * @param {number} evaluationId
   * @param {string} conformityLevel
   * @param {array} guidelines
   * @param {array} pageList
   */
  this.getStatisticsByGuideLineManual = async function(
    evaluationId,
    specificationId = null,
    conformityLevel = null,
    guidelines = [],
    pageList = [],
    cb
  ) {
    const returnObj = {results: {}, count: null, message: []};
    const showStatistisByCriterion = guidelines.length > 0;
    const pagesIdList = await getIdList(pageList);
    let manualPages = [];

    try {
      let filteredCriterion = await getCriterionByGuidelineAndLevel(conformityLevel, guidelines);

      manualPages = await getManualPagesBySpecificationOrEvaluation(
        evaluationId,
        specificationId
      ).then(manualPages => {
        return manualPages.filter(result => {
          return pagesIdList.includes(result.pagesId) || pageList.length === 0;
        });
      });

      let findingsByPage = await getFindingsByManualPages(manualPages);
      let findingCounterLists = {comply: [], noComply: [], noApply: []};
      let columnVariableNames = [];
      let listZeroFieldsRemoved = {};

      if (showStatistisByCriterion) {
        let criterionListIndexedByCriterionId = await createCriterionListIndexedByCriterionId(
          filteredCriterion
        );
        findingCounterLists = await countManualFindingsByCriteria(
          findingsByPage,
          findingCounterLists
        );
        columnVariableNames = await getColumnsNamesByCriterion(
          findingCounterLists,
          criterionListIndexedByCriterionId
        );
        listZeroFieldsRemoved = await removeNullAndZeroFields(
          findingCounterLists,
          columnVariableNames
        );
      } else {
        let guidelineListIndexedByCriterionId = await createGuidelineListIndexedByCriterionId(
          filteredCriterion
        );
        findingCounterLists = await countManualFindingsByGuideline(
          guidelineListIndexedByCriterionId,
          findingsByPage,
          findingCounterLists
        );
        let guidelineIndexedByGuidelineId = await createGuidelineIndexedByGuidelineId(guidelines);
        columnVariableNames = await getColumnsNamesByGuideline(
          findingCounterLists,
          guidelineIndexedByGuidelineId
        );
        listZeroFieldsRemoved = await removeNullAndZeroFields(
          findingCounterLists,
          columnVariableNames
        );
      }

      findingCounterLists = listZeroFieldsRemoved.newfindingCounters;
      columnVariableNames = listZeroFieldsRemoved.newColumnVariableNames;
      let multi_Y_VariableList = [
        {name: 'No cumple', data: findingCounterLists.noComply},
        {name: 'No aplica', data: findingCounterLists.noApply},
        {name: 'Cumple', data: findingCounterLists.comply}
      ];
      returnObj.results = {
        xVariableList: columnVariableNames,
        yVariableList: multi_Y_VariableList
      };
    } catch (error) {
      throw handleError(error, 'getStatisticsByGuideLineManual', evaluationId);
    }

    return await returnObj;
  };

  /**
   * Function to get manual pages filtered by specification
   * or evaluation.
   * @param {number} specificationId
   */
  async function getManualPagesBySpecificationOrEvaluation(evaluationId, specificationId = null) {
    const manualPagesServices = new ManualPagesServices();
    let manualPagesIdsList = [];
    try {
      if (specificationId !== null) {
        await specificationsByManualPagesModel
          .find({
            where: {
              specificationsId: specificationId
            }
          })
          .then(specificationsByManualPages => {
            return specificationsByManualPages.forEach(specificationsByManualPage => {
              manualPagesIdsList.push(specificationsByManualPage.manualPagesId);
            });
          });
        return await manualPagesModel.find({
          where: {
            id: {inq: manualPagesIdsList}
          },
          fields: ['id', 'pagesId', 'evaluationPageState']
        });
      } else {
        const manualPages = await manualPagesServices.manualPagesByEvaluation(evaluationId);
        return manualPages.results;
      }
    } catch (error) {
      throw handleError(error, 'getManualPagesBySpecification', evaluationId);
    }
  }

  /**
   * Get the quantity of evaluations for each client, segment and year provided.
   * @param {*} clients
   * @param {*} segments
   * @param {*} dateInicial
   * @param {*} dateFinal
   * @returns
   */
  this.getGeneralStatisticsByClientsAndSegments = async function(
    clients = [],
    segments = [],
    dateInicial,
    dateFinal
  ) {
    let filteredData = [];
    const filter = {
      where: {
        and: []
      },
      fields: {
        createdAt: true,
        clientsId: true,
        segmentsId: true
      }
    };
    let clientsList = [];
    let segmentsList = [];

    try {
      if (clients.length > 0) {
        filter.where.and.push({clientsId: {inq: clients}});
      }
      if (segments.length > 0) {
        filter.where.and.push({segmentsId: {inq: segments}});
      }
      filter.where.and.push({createdAt: {between: [dateInicial, dateFinal]}});
      filteredData = await evaluationsModel.find(filter);

      for (const d of filteredData) {
        clientsList.push(d['clientsId']);
      }

      for (const d of filteredData) {
        segmentsList.push(d['segmentsId']);
      }
    } catch (error) {
      throw handleError(error);
    }

    const clientsFirstNames = await getAllClients(clientsList);
    const segmentsNames = await getAllSegments(segmentsList);

    let newFilteredData = [];

    for (var i = 0; i < filteredData.length; i++) {
      const data = filteredData[i];
      const datetime = new Date(data['createdAt']);

      const year = datetime.getFullYear().toString();
      const firstName = clientsFirstNames[data['clientsId']];
      const segmentName = segmentsNames[data['segmentsId']];

      const newDict = {
        createdAt: year,
        clientsId: firstName,
        segmentsId: segmentName
      };

      newFilteredData.push(newDict);
    }

    const groupedData = grouparray(newFilteredData, ['createdAt', 'clientsId', 'segmentsId']);
    let result = {};

    for (const data of groupedData) {
      const year = data['k1'];
      const clientFirstName = data['k2'];
      const segmentName = data['k3'];
      const field = data['data'];

      if (!(year in result)) {
        result[year] = {};
      }

      if (!(clientFirstName in result[year])) {
        result[year][clientFirstName] = {};
      }

      if (!(segmentName in result[year][clientFirstName])) {
        result[year][clientFirstName][segmentName] = {count: field.length};
      }
    }

    return result;
  };

  /**
   * Get the quantity of evaluations for each client, segment and year provided.
   * If no client is provided, only retrive by segment
   * @param {*} clients
   * @param {*} segments
   * @param {*} dateInicial
   * @param {*} dateFinal
   * @returns
   */
  this.getGeneralStatisticsBySegmentAndYear = async function(
    clients = [],
    segments = [],
    dateInicial,
    dateFinal
  ) {
    const filter = {
      where: {
        and: []
      },
      fields: {
        createdAt: true,
        clientsId: true,
        segmentsId: true
      }
    };

    try {
      const hasElements = list => list.length > 0;
      const doesNotExist = key => key == undefined;
      const thereAreClients = hasElements(clients);
      const thereAreSegments = hasElements(segments);

      if (thereAreClients) {
        filter.where.and.push({clientsId: {inq: clients}});
      }
      if (thereAreSegments) {
        filter.where.and.push({segmentsId: {inq: segments}});
      }
      filter.where.and.push({createdAt: {between: [dateInicial, dateFinal]}});
      const evaluationsList = await evaluationsModel.find(filter);

      const clientsFirstNames = await getAllClients(clients);
      const segmentsNames = await getAllSegments(segments);

      const groupedEvaluations = {};
      for (const evaluation of evaluationsList) {
        const year = new Date(evaluation.createdAt).getFullYear();
        const clientName = clientsFirstNames[evaluation.clientsId];
        const segmentName = segmentsNames[evaluation.segmentsId];

        if (!thereAreClients && !thereAreSegments) {
          // Count years only
          if (doesNotExist(groupedEvaluations[year])) {
            groupedEvaluations[year] = {count: 1};
          } else {
            groupedEvaluations[year].count += 1;
          }
        } else {
          if (doesNotExist(groupedEvaluations[year])) {
            groupedEvaluations[year] = {};
          }
          if (thereAreClients && thereAreSegments) {
            if (doesNotExist(groupedEvaluations[year][clientName])) {
              groupedEvaluations[year][clientName] = {};
            }
            if (doesNotExist(groupedEvaluations[year][clientName][segmentName])) {
              groupedEvaluations[year][clientName][segmentName] = {count: 1};
            } else {
              groupedEvaluations[year][clientName][segmentName].count += 1;
            }
          } else {
            if (thereAreClients || thereAreSegments) {
              if (!thereAreClients) {
                if (doesNotExist(groupedEvaluations[year][segmentName])) {
                  groupedEvaluations[year][segmentName] = {count: 1};
                } else {
                  groupedEvaluations[year][segmentName].count += 1;
                }
              }
              if (!thereAreSegments) {
                if (doesNotExist(groupedEvaluations[year][clientName])) {
                  groupedEvaluations[year][clientName] = {count: 1};
                } else {
                  groupedEvaluations[year][clientName].count += 1;
                }
              }
            }
          }
        }
      }

      return groupedEvaluations;
    } catch (error) {
      throw handleError(error);
    }
  };

  /**
   * Gets all the clients' first names from a list of user ids
   * @param {*} idList
   * @returns
   */
  async function getAllClients(idList = []) {
    let firstNamesList = [];
    const filter = {
      where: {
        and: []
      },
      fields: {
        id: true,
        firstName: true
      }
    };

    let firstNamesById = {};

    try {
      if (idList.length > 0) {
        filter.where.and.push({id: {inq: idList}});
      }
      firstNamesList = await usersModel.find(filter);
    } catch (error) {
      throw handleError(error, 'getAllClients');
    }

    for (const d of firstNamesList) {
      firstNamesById[d.id] = d.firstName;
    }

    return firstNamesById;
  }

  /**
   * Gets all the segments' names from a list of segments ids
   * @param {*} idList
   * @returns
   */
  async function getAllSegments(idList = []) {
    let segmentNameList = [];
    const filter = {
      where: {
        and: []
      },
      fields: {
        id: true,
        name: true
      }
    };

    let namesById = {};

    try {
      if (idList.length > 0) {
        filter.where.and.push({id: {inq: idList}});
      }
      segmentNameList = await segmentModel.find(filter);
    } catch (error) {
      throw handleError(error, 'getAllSegments');
    }

    for (const d of segmentNameList) {
      namesById[d.id] = d.name;
    }
    return namesById;
  }

  /**
   * Get criterions filtered by guideline and conformityLevel
   * @param {string} conformityLevel
   * @param {array<object>} guidelineList
   */
  async function getCriterionByGuidelineAndLevel(conformityLevel = null, guidelineList = []) {
    let criterion = [];
    const filter = {
      where: {
        and: []
      },
      fields: {
        createdAt: false,
        updatedAt: false,
        createdBy: false,
        updatedBy: false
      }
    };
    try {
      if (conformityLevel !== null) {
        filter.where.and.push({
          level: conformityLevel.toUpperCase()
        });
      }
      if (guidelineList.length > 0) {
        const guidelineIdList = [];
        for (const guideline of guidelineList) {
          guidelineIdList.push(guideline.id);
        }
        filter.where.and.push({guidelinesId: {inq: guidelineIdList}});
      }
      criterion = await criterionModel.find(filter);
    } catch (error) {
      throw handleError(error, 'getCriterionByGuidelineAndLevel');
    }

    return criterion;
  }

  /**
   * Function to get a list of ids.
   * @param {*} modelObjects
   */
  async function getIdList(modelObjects) {
    let IdList = [];
    for (const modelObject of modelObjects) {
      IdList.push(modelObject.id);
    }
    return IdList;
  }

  /**
   * Recive a list of pages and a finding type and return a list of findings
   * @param {Array<Object>} pageList
   * @param {String} findingType
   */
  async function getFindingsByAutomaticPages(automaticPageList = []) {
    let automaticPagesIdLIst = [];
    for (let automaticPage of automaticPageList) {
      automaticPagesIdLIst.push(automaticPage.id);
    }
    let findings = [];
    try {
      findings = await findingsModel.find({
        where: {
          automaticEvaluatorPagesId: {inq: automaticPagesIdLIst}
        }
      });

      return findings;
    } catch (error) {
      new CustomErrorLog('BE > apiStatistics.js > getFindingsByAutomaticPages', error).saveError();
      return findings;
    }
  }

  /**
   * Create a list of criterions indexed by id.
   * @param {array} criterionList
   * @returns {array}
   */
  async function createCriterionListIndexedByCriterionId(criterionList) {
    let criterionListIndexedByCriterion = [];
    for (let criteria of criterionList) {
      criterionListIndexedByCriterion[criteria.id] = criteria;
    }
    return criterionListIndexedByCriterion;
  }

  /**
   * Count findings by criterion filtered
   * by guideline and conformity level.
   * @param {Array<Object>} criterionIndexList
   * @param {Array<Object>} findingList
   * @param {Array<object>} counterLists
   */
  async function countAutomaticFindingsByCriteria(findingList, counterLists) {
    let countNoticesAndWarnings = false;

    for (let finding of findingList) {
      let idCriteria = finding.criterionsId;
      let findingType = finding.findingType;
      if (findingType === eAWConstants.PallyConstants.FINDING_ERROR) {
        if (counterLists.error[idCriteria] == undefined) {
          counterLists.error[idCriteria] = 1;
        } else {
          counterLists.error[idCriteria] = counterLists.error[idCriteria] + 1;
        }
      }
      countNoticesAndWarnings = eAWConstants.StatisticsConstants.TREAT_NOTICES_AS_WARNINGS
        ? findingType === eAWConstants.PallyConstants.FINDING_WARNING ||
          findingType === eAWConstants.PallyConstants.FINDING_NOTICE
        : findingType === eAWConstants.PallyConstants.FINDING_WARNING;
      if (countNoticesAndWarnings) {
        if (counterLists.warning[idCriteria] == undefined) {
          counterLists.warning[idCriteria] = 1;
        } else {
          counterLists.warning[idCriteria] = counterLists.warning[idCriteria] + 1;
        }
      }
      if (!eAWConstants.StatisticsConstants.TREAT_NOTICES_AS_WARNINGS) {
        if (findingType === eAWConstants.PallyConstants.FINDING_NOTICE) {
          if (counterLists.notice[idCriteria] == undefined) {
            counterLists.notice[idCriteria] = 1;
          } else {
            counterLists.notice[idCriteria] = counterLists.notice[idCriteria] + 1;
          }
        }
      }
    }

    return counterLists;
  }

  /**
   * Find and get criterion names if the current position in the list
   * that match a criterion id is not null.
   * @param {map<number, array<number>>} findingCounterLists
   * @param {map<number, object>} criterionListIndexedByCriterionId
   */
  async function getColumnsNamesByCriterion(
    findingCounterLists,
    criterionListIndexedByCriterionId
  ) {
    let criterionNameList = [];

    let criteriaName;
    Object.keys(findingCounterLists).forEach(key => {
      let currentFieldList = findingCounterLists[key];
      currentFieldList.forEach((element, index) => {
        if (element != undefined) {
          if (criterionListIndexedByCriterionId[index] != undefined) {
            criteriaName =
              criterionListIndexedByCriterionId[index].numberCriterion +
              ' - ' +
              criterionListIndexedByCriterionId[index].name;
            criterionNameList[index] = criteriaName;
          }
        }
      });
    });

    return criterionNameList;
  }

  /**
   * Remove null and zero fields if the same position
   * of all arrays inside findingCounterLists are null or zero
   * and maintain names in columnVariableNames that does
   * not match those removed fields.
   * @param {Array<Array<number>>} findingCounterLists
   * @param {Array<string>} columnVariableNames
   */
  async function removeNullAndZeroFields(findingCounterLists, columnVariableNames) {
    const result = {
      newfindingCounters: {},
      newColumnVariableNames: []
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
            allGuidelineGraderZero = allGuidelineGraderZero + iterableLists[index][nameIndex];
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
   * Get guidelines hash where the id is the key and
   * a respective guideline object is the value.
   * @returns {map<number, object>}
   */
  async function createGuidelineIndexedByGuidelineId() {
    const guidelineList = await guidelinesModel.find();
    const guidelineListIndexedByCriterion = [];
    for (const guideline of guidelineList) {
      guidelineListIndexedByCriterion[guideline.id] = guideline;
    }
    return guidelineListIndexedByCriterion;
  }

  /**
   * Return a map with criterion id as the key and
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
   * Count automatic findings by guideline.
   * @param {Array<int>} guidelineListIndexedByCriterionId
   * @param {Array<object>} findingList
   * @param {Array<Array<int>>} counterLists
   */
  async function countAutomaticFindingsByGuideline(
    guidelineListIndexedByCriterionId,
    findingList,
    counterLists
  ) {
    let countNoticesAndWarnings = false;
    try {
      for (let finding of findingList) {
        let idGuideLine = guidelineListIndexedByCriterionId[finding.criterionsId];
        let findingType = finding.findingType;

        if (findingType === eAWConstants.PallyConstants.FINDING_ERROR) {
          if (counterLists.error[idGuideLine] == undefined) {
            counterLists.error[idGuideLine] = 1;
          } else {
            counterLists.error[idGuideLine] = counterLists.error[idGuideLine] + 1;
          }
        }
        countNoticesAndWarnings = eAWConstants.StatisticsConstants.TREAT_NOTICES_AS_WARNINGS
          ? findingType === eAWConstants.PallyConstants.FINDING_WARNING ||
            findingType === eAWConstants.PallyConstants.FINDING_NOTICE
          : findingType === eAWConstants.PallyConstants.FINDING_WARNING;
        if (countNoticesAndWarnings) {
          if (counterLists.warning[idGuideLine] == undefined) {
            counterLists.warning[idGuideLine] = 1;
          } else {
            counterLists.warning[idGuideLine] = counterLists.warning[idGuideLine] + 1;
          }
        }
        if (!eAWConstants.StatisticsConstants.TREAT_NOTICES_AS_WARNINGS) {
          if (findingType === eAWConstants.PallyConstants.FINDING_NOTICE) {
            if (counterLists.notice[idGuideLine] == undefined) {
              counterLists.notice[idGuideLine] = 1;
            } else {
              counterLists.notice[idGuideLine] = counterLists.notice[idGuideLine] + 1;
            }
          }
        }
      }
    } catch (error) {
      throw handleError(error, 'countAutomaticFindingsByGuideline');
    }

    return counterLists;
  }

  /**
   * Get the corresponding guideline name of columns
   * that are not undefined in all the arrays inside
   * the object findingCounterLists.
   * @param {array<object>} findingCounterLists
   * @param {array} guidelineIndexedByGuidelineId
   */
  async function getColumnsNamesByGuideline(findingCounterLists, guidelineIndexedByGuidelineId) {
    const nameList = [];
    try {
      if (eAWConstants.StatisticsConstants.TREAT_NOTICES_AS_WARNINGS) {
        await delete findingCounterLists.notice;
      }
      let guidelineName;
      Object.keys(findingCounterLists).forEach(key => {
        let currentList = findingCounterLists[key];
        currentList.forEach((element, index) => {
          if (element != undefined) {
            guidelineName =
              guidelineIndexedByGuidelineId[index].numberGuidelines +
              ' - ' +
              guidelineIndexedByGuidelineId[index].name;
            nameList[index] = guidelineName;
          }
        });
      });
    } catch (error) {
      throw handleError(error, 'getColumnsNamesByGuideline');
    }

    return nameList;
  }

  /**
   * Recive a list of pages and a finding type and return a list of findings
   *
   * @param {Array<Object>} manualPages
   */
  async function getFindingsByManualPages(manualPages = []) {
    let manualAnswers = [];
    try {
      const manualPagesIdList = [];
      for (const manualPage of manualPages) {
        manualPagesIdList.push(manualPage.id);
      }
      const specificationsByManualPages = await specificationsByManualPagesModel.find({
        where: {
          manualPagesId: {inq: manualPagesIdList}
        }
      });
      const idsList = [];
      for (const specificationByManualPage of specificationsByManualPages) {
        idsList.push(specificationByManualPage.id);
      }
      manualAnswers = await manualAnswersModel.find({
        where: {
          specificationsByManualPagesId: {inq: idsList}
        }
      });
    } catch (error) {
      throw handleError(error, 'getFindingsByManualPages');
    }

    return manualAnswers;
  }

  /**
   * Count findings by criterion filtered
   * by guideline and conformity level.
   * @param {Array<Object>} criterionIndexList
   * @param {Array<Object>} findingList
   * @param {Array<object>} counterLists
   */
  async function countManualFindingsByCriteria(findingList, counterLists) {
    try {
      for (let finding of findingList) {
        let idCriteria = finding.criterionsId;
        let complyState = finding.complyState;
        if (complyState === eAWConstants.ComplyState.COMPLY) {
          if (counterLists.comply[idCriteria] == undefined) {
            counterLists.comply[idCriteria] = 1;
          } else {
            counterLists.comply[idCriteria] = counterLists.comply[idCriteria] + 1;
          }
        }
        if (complyState === eAWConstants.ComplyState.NO_COMPLY) {
          if (counterLists.noComply[idCriteria] == undefined) {
            counterLists.noComply[idCriteria] = 1;
          } else {
            counterLists.noComply[idCriteria] = counterLists.noComply[idCriteria] + 1;
          }
        }
        if (complyState === eAWConstants.ComplyState.NO_APPLY) {
          if (counterLists.noApply[idCriteria] == undefined) {
            counterLists.noApply[idCriteria] = 1;
          } else {
            counterLists.noApply[idCriteria] = counterLists.noApply[idCriteria] + 1;
          }
        }
      }
    } catch (error) {
      throw handleError(error, 'countManualFindingsByCriteria');
    }

    return counterLists;
  }

  /**
   * Count manual answers by guideline.
   * @param {array} guidelineListIndexedByCriterionId
   * @param {array} findingList
   * @param {array} counterLists
   */
  async function countManualFindingsByGuideline(
    guidelineListIndexedByCriterionId,
    findingList,
    counterLists
  ) {
    try {
      for (let finding of findingList) {
        let idGuideLine = guidelineListIndexedByCriterionId[finding.criterionsId];
        let complyState = finding.complyState;

        if (complyState === eAWConstants.ComplyState.COMPLY) {
          if (counterLists.comply[idGuideLine] == undefined) {
            counterLists.comply[idGuideLine] = 1;
          } else {
            counterLists.comply[idGuideLine] = counterLists.comply[idGuideLine] + 1;
          }
        }
        if (complyState === eAWConstants.ComplyState.NO_COMPLY) {
          if (counterLists.noComply[idGuideLine] == undefined) {
            counterLists.noComply[idGuideLine] = 1;
          } else {
            counterLists.noComply[idGuideLine] = counterLists.noComply[idGuideLine] + 1;
          }
        }
        if (complyState === eAWConstants.ComplyState.NO_APPLY) {
          if (counterLists.noApply[idGuideLine] == undefined) {
            counterLists.noApply[idGuideLine] = 1;
          } else {
            counterLists.noApply[idGuideLine] = counterLists.noApply[idGuideLine] + 1;
          }
        }
      }
    } catch (error) {
      throw handleError(error, 'countManualFindingsByGuideline');
    }

    return counterLists;
  }

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId) {
    new CustomErrorLog(
      'BE > ConsultantStatistics > ' + functionName,
      error,
      evaluationId
    ).saveError();
    return error;
  }
};

/**
 * Generates the array filled with groups dictionaries by key-data
 * @param {array} groups
 * @param {string} groupKey
 * @returns
 */
function genrows(groups, groupKey) {
  return _.toPairs(groups).map(([key, data]) => ({[groupKey]: key, data}));
}

/**
 * Groups the data by a specified key
 * @param {array} arr
 * @param {function} iteratee
 * @param {string} key
 * @returns
 */
function gengroups(arr, iteratee, key) {
  const grouped = _.groupBy(arr, iteratee);
  return genrows(grouped, key);
}

/**
 * Group collection's data by multiple iteratees
 * @param data
 * @param {Array<String|GroupByProp>} props Array of group by objects or property names
 *   This parameter also can contain both property names and group by objects together
 * @returns {Array}
 */

function grouparray(data, props) {
  let result = [{data}];

  props.forEach((prop, i) => {
    const key = prop.key || `k${i + 1}`;
    const iteratee = prop.iteratee || prop;

    result = _.flatten(
      result.map(row => {
        return gengroups(row.data, iteratee, key).map(group =>
          Object.assign({}, row, {
            [key]: group[key],
            data: group.data
          })
        );
      })
    );
  });

  return _.flatten(result);
}
