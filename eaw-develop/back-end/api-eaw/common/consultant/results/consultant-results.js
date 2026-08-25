'use strict';
const _ = require('lodash');

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');

const app = require('../../../server/server');

module.exports = function ConsultantResults() {
  const manualAnswersModel = app.models.ManualAnswers;
  const specificationsByManualPagesModel = app.models.SpecificationsByManualPages;
  const specificationsModel = app.models.Specifications;
  const automaticPagesModel = app.models.AutomaticEvaluatorPages;
  const findingsModel = app.models.Findings;
  const automaticDescriptionsModel = app.models.AutomaticDescriptions;

  /**
   * Get findings data from automatic evaluation data filtered by rol and
   * automaticPageList grouped by criterion.
   * @param {number} evaluationId
   * @param {number} rolId
   * @param {array} automaticPageList
   */
  this.getFindingsByAutomaticPage = async function(
    evaluationId,
    guidelines = [],
    criterion = [],
    automaticPageList = [],
    limit = null,
    skip = 0
  ) {
    const returnObj = {count: 0, results: [], message: []};
    try {
      if (automaticPageList.length === 0) {
        const pagesList = await app.models.Pages.find({
          fields: ['id', 'evaluationsId'],
          where: {evaluationsId: evaluationId}
        });
        const pagesIdList = await getIdList(pagesList);
        automaticPageList = await automaticPagesModel.find({
          fields: ['id', 'pagesId'],
          where: {pagesId: {inq: pagesIdList}}
        });
      }
      const automaticPagesIds = await getIdList(automaticPageList);

      const criterionByGuidelineFilter = {where: {and: []}};
      if (guidelines.length > 0) {
        const guidelinesIdList = await getIdList(guidelines);

        criterionByGuidelineFilter.where.and.push({
          guidelinesId: {inq: guidelinesIdList}
        });
      }
      if (criterion.length > 0) {
        const criterionIdList = await getIdList(criterion);

        criterionByGuidelineFilter.where.and.push({
          id: {inq: criterionIdList}
        });
      }
      const criterionFilteredByGuideline = await app.models.Criterions.find(
        criterionByGuidelineFilter
      );
      const criterionFilteredByGuidelineIdList = await getIdList(criterionFilteredByGuideline);

      returnObj.count = await findingsModel.count({
        and: [
          {automaticEvaluatorPagesId: {inq: automaticPagesIds}},
          {criterionsId: {inq: criterionFilteredByGuidelineIdList}}
        ]
      });
      const findings = await findingsModel
        .find({
          where: {
            and: [
              {automaticEvaluatorPagesId: {inq: automaticPagesIds}},
              {criterionsId: {inq: criterionFilteredByGuidelineIdList}}
            ]
          },
          include: [
            {
              relation: 'findingsCriterions',
              scope: {
                fields: ['id', 'numberCriterion']
              }
            }
          ],
          limit: limit,
          skip: skip
        })
        .then(result => {
          return JSON.parse(JSON.stringify(result));
        });

      const hashIdXdescription = await createAutomaticdescriptionHashIdXText();
      for (let finding of findings) {
        finding['findingsCriterions'] = finding.findingsCriterions.numberCriterion;
        finding['recommendation'] = hashIdXdescription[finding.automaticDescriptionsId];
        delete finding.automaticEvaluatorPagesId;
        delete finding.criterionsId;
        delete finding.automaticDescriptionsId;
      }
      returnObj.results = findings;

      return returnObj;
    } catch (error) {
      throw handleError(error, 'getFindingsByAutomaticPage', evaluationId);
    }
  };

  /**
   * Generate a hash where ids as keys and recommendations
   * as values.
   */
  async function createAutomaticdescriptionHashIdXText() {
    const hashIdXdescription = {};
    const automaticDescriptions = await automaticDescriptionsModel.find();
    for (const modelObject of automaticDescriptions) {
      hashIdXdescription[modelObject.id] = modelObject.description;
    }
    return hashIdXdescription;
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
   * Service get manual answers data from manual evaluation filtered by
   * rol and pageList grouped by criterion.
   * @param {number} evaluationId
   * @param {number} disabiliyRolId
   * @param {array} pageList
   */
  this.getAnwersByManualPage = async function(
    evaluationId,
    disabiliyRolId = null,
    principleId,
    pageList = null
  ) {
    const returnObj = {results: [], count: null, message: []};
    try {
      let specificationFilter = {
        where: {
          evaluationsId: evaluationId
        }
      };
      if (disabiliyRolId != null) {
        specificationFilter = {
          where: {
            and: [
              {
                evaluationsId: evaluationId
              },
              {disabilitiesId: disabiliyRolId}
            ]
          }
        };
      }

      const specifications = await specificationsModel.find(specificationFilter);

      let specificationsPagesList = [];
      for (const specification of specifications) {
        specificationsPagesList = specificationsPagesList.concat(
          await specificationsByManualPagesModel
            .find({
              where: {
                specificationsId: specification.id
              },
              include: [
                {
                  relation: 'SpecificationsByManualPagesManualPages',
                  scope: {
                    fields: ['id', 'pagesId']
                  }
                }
              ]
            })
            .then(specificationsByManualPages => {
              return JSON.parse(JSON.stringify(specificationsByManualPages));
            })
        );
      }
      let pagesIdList = [];
      if (pageList != null) {
        for (const page of pageList) {
          pagesIdList.push(page.id);
        }
      }

      let answerFilter = {
        include: [
          {
            relation: 'manualAnswersCriterions',
            scope: {
              fields: [
                'id',
                'level',
                'name',
                'referenceLink',
                'numberCriterion',
                'guidelinesId',
                'criterionDescription'
              ],
              include: [
                {
                  relation: 'criterionsGuidelines'
                }
              ]
            }
          },
          {
            relation: 'manualAnswersRecommendations',
            scope: {
              fields: ['id', 'descriptionRecommendation']
            }
          }
        ]
      };

      let answersList = [];
      let specificationInfo = null;
      let mAnswers = [];

      for (const specByManualPage of specificationsPagesList) {
        specificationInfo = await specificationsModel.specificationAndPageInfo(
          specByManualPage.specificationsId,
          specByManualPage.manualPagesId1
        );
        specificationInfo = specificationInfo.results;
        answerFilter.where = {
          specificationsByManualPagesId: specByManualPage.id
        };

        mAnswers = await manualAnswersModel.find(answerFilter).then(result => {
          result = JSON.parse(JSON.stringify(result));
          return result.map(data => {
            const dataAux = {
              criterionsId: data.criterionsId,
              id: data.id,
              recommendationsId: data.recommendationsId,
              specificationsByManualPagesId: data.specificationsByManualPagesId,
              criterionLevel: data.manualAnswersCriterions.level,
              criterionName: data.manualAnswersCriterions.name,
              criterionNumberCriterion: data.manualAnswersCriterions.numberCriterion,
              criterionReferenceLink: data.manualAnswersCriterions.referenceLink,
              criterionDescription: data.manualAnswersCriterions.criterionDescription,
              recommendation: data.manualAnswersRecommendations.descriptionRecommendation,
              specificationInfo: specificationInfo
            };
            if (data.manualAnswersCriterions.criterionsGuidelines.principlesId == principleId) {
              return dataAux;
            }
          });
        });

        mAnswers = await mAnswers.filter(answer => {
          return answer !== undefined;
        });

        if (mAnswers !== undefined) {
          mAnswers.specificationInfo = specificationInfo;

          if (pageList != null) {
            if (
              pagesIdList.includes(specByManualPage.SpecificationsByManualPagesManualPages.pagesId)
            ) {
              answersList = answersList.concat(mAnswers);
            }
          } else {
            answersList = answersList.concat(mAnswers);
          }
        }
      }
      returnObj.results = answersList;
      return await returnObj;
    } catch (error) {
      throw handleError(error, 'getAnwersByManualPage', evaluationId);
    }
  };

  /**
   * Service get manual answers data from manual evaluation filtered by
   * rol and pageList grouped by criterion.
   * @param {number} evaluationId
   * @param {number} disabiliyRolId
   * @param {array} pageList
   */
  this.getObservationsByManualPage = async function(
    evaluationId,
    disabiliyRolId = null,
    principleId,
    pageList = null
  ) {
    const returnObj = {results: [], count: null, message: []};
    try {
      let specificationFilter = {
        where: {
          evaluationsId: evaluationId
        }
      };
      if (disabiliyRolId != null) {
        specificationFilter = {
          where: {
            and: [
              {
                evaluationsId: evaluationId
              },
              {disabilitiesId: disabiliyRolId}
            ]
          }
        };
      }

      const specifications = await specificationsModel.find(specificationFilter);

      let specificationsPagesList = [];
      for (const specification of specifications) {
        specificationsPagesList = specificationsPagesList.concat(
          await specificationsByManualPagesModel
            .find({
              where: {
                specificationsId: specification.id
              },
              include: [
                {
                  relation: 'SpecificationsByManualPagesManualPages',
                  fields: [
                    'id',
                    'operableObservation',
                    'percetibleObservation',
                    'robustObservation',
                    'distinguishableObservation'
                  ]
                }
              ]
            })
            .then(specificationsByManualPages => {
              return JSON.parse(JSON.stringify(specificationsByManualPages));
            })
        );
      }

      let pagesIdList = [];
      if (pageList != null) {
        for (const page of pageList) {
          pagesIdList.push(page.id);
        }
      }

      const listRecomendations = [];

      for (const specByManualPage of specificationsPagesList) {
        if (pageList != null) {
          if (
            pagesIdList.includes(specByManualPage.SpecificationsByManualPagesManualPages.pagesId)
          ) {
            const observation =
              specByManualPage.SpecificationsByManualPagesManualPages[
                await getScopeFieldsByPrincipleId(principleId)
              ];

            if (observation !== null) {
              listRecomendations.push(observation);
            }
          }
        } else {
          const observation =
            specByManualPage.SpecificationsByManualPagesManualPages[
              await getScopeFieldsByPrincipleId(principleId)
            ];
          if (observation !== null) {
            listRecomendations.push(observation);
          }
        }
      }
      returnObj.results = listRecomendations;
      return await returnObj;
    } catch (error) {
      throw handleError(error, 'getObservationsByManualPage', evaluationId);
    }
  };

  async function getScopeFieldsByPrincipleId(principleId) {
    switch (principleId) {
      case 1:
        return 'percetibleObservation';
      case 2:
        return 'operableObservation';
      case 3:
        return 'distinguishableObservation';
      case 4:
        return 'robustObservation';
    }
  }

  /**
   * Create a map with lists grouped by a field name
   * @param {array<Object>} objects
   * @param {string} fieldName
   */
  async function groupObjectsListByFieldName(objects, fieldName) {
    let groups = {};
    try {
      for (let index = 0; index < objects.length; index++) {
        const finding = objects[index];
        if (finding[fieldName] in groups) {
          groups[finding[fieldName]].push(finding);
        } else {
          groups[finding[fieldName]] = [finding];
        }
      }
    } catch (error) {
      handleError(error, 'groupObjectsListByFieldName');
    }

    return groups;
  }

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId) {
    new CustomErrorLog(
      'BE > consultant-results > ' + functionName,
      error,
      evaluationId
    ).saveError();
    return error;
  }
};
