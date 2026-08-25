'use strict';

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');

const app = require('../../../server/server');

/**
 * Manage specifications model services logic.
 */
module.exports = function EvaluatorFormLoadServices() {
  const criterionsByDisabilityModel = app.models.CriterionsByDisabilityRoles;
  const disabilitiesModel = app.models.Disabilities;
  const specificationsModel = app.models.Specifications;
  const recommendationsModel = app.models.Recommendations;
  const pagesModel = app.models.Pages;
  const manualPagesModel = app.models.ManualPages;
  const eawConstants = new EAWConstants();

  /**
   * Get the disability profiles for equal
   * specifications for an evaluator.
   */
  this.disabilityProfilesByEqualSpecifications = async function(
    evaluationsId,
    specificationsId,
  ) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      const specification = await specificationsModel.findOne({
        where: {
          id: specificationsId,
          evaluationsId: evaluationsId,
        },
      });
      const userEqualSpecifications = await specificationsModel.find({
        where: {
          evaluationsId: evaluationsId,
          browsersId: specification.browsersId,
          devicesId: specification.devicesId,
          operativeSystemsId: specification.operativeSystemsId,
          supportToolsId: specification.supportToolsId,
          usersId: specification.usersId,
        },
      });
      let disabilityProfiles = [];
      let disability;
      for (const userEqualSpecification of userEqualSpecifications) {
        disability = await disabilitiesModel.findOne({
          where: {id: userEqualSpecification.disabilitiesId},
        });
        disabilityProfiles.push({
          specificationsId: userEqualSpecification.id,
          disabilitiesId: disability.id,
          disabilityName: disability.name,
        });
      }
      returnObj.results = disabilityProfiles;
    } catch (error) {
      throw handleError(
        error,
        'disabilityProfilesByEqualSpecifications',
        evaluationsId,
      );
    }
    return returnObj.results;
  };

  /**
   * Get criterions filtered principle and by evaluator profiles for equal
   * specifications for an evaluator, grouped by conformity level.
   * @param {number} evaluationsId
   * @param {number} specificationsId
   * @param {number} principleId
   */
  this.formCriterionsByDisability = async function(
    evaluationsId,
    specificationsId,
    principleId,
  ) {
    try {
      const disabilityProfiles = await this.disabilityProfilesByEqualSpecifications(
        evaluationsId,
        specificationsId,
      );
      const disabilitiesIdList = [];
      const disabilityIdXdisabilityHash = {};
      for (const disabilityProfile of disabilityProfiles) {
        disabilitiesIdList.push(disabilityProfile.disabilitiesId);
        disabilityIdXdisabilityHash[
          disabilityProfile.disabilitiesId
        ] = disabilityProfile;
      }
      const criterionIdXRecommendationsHash = await getMapCriterionIdXRecommendations();
      let criterionsByDisabilities = await criterionsByDisabilityModel.find({
        where: {
          disabilitiesId: {inq: disabilitiesIdList},
        },
        include: [
          {
            relation: 'criterionsByDisabilityRolesCriterions',
            scope: {
              fields: [
                'criterionDescription',
                'guidelinesId',
                'id',
                'level',
                'name',
                'referenceLink',
                'numberCriterion',
              ],
              include: {
                relation: 'criterionsGuidelines',
                scope: {
                  fields: ['principlesId'],
                },
              },
            },
          },
        ],
      });
      criterionsByDisabilities = JSON.parse(
        JSON.stringify(criterionsByDisabilities),
      );
      let formatedCriterionObject = [];
      let criterion;
      for (const criterionsByDisability of criterionsByDisabilities) {
        criterion =
          criterionsByDisability.criterionsByDisabilityRolesCriterions;
        criterion.disabilitiesId = criterionsByDisability.disabilitiesId;
        criterion.principlesId = criterion.criterionsGuidelines.principlesId;
        delete criterion.criterionsGuidelines;
        if (criterion.principlesId == principleId) {
          criterion.recommendations =
            criterionIdXRecommendationsHash[criterion.id];
          formatedCriterionObject.push(criterion);
        }
      }

      const disabilityGroup = {};
      let disabilityProfile;
      for (const criterionObject of formatedCriterionObject) {
        disabilityProfile =
          disabilityIdXdisabilityHash[criterionObject.disabilitiesId];
        if (criterionObject['id'] in disabilityGroup) {
          disabilityGroup[criterionObject['id']].disabilitiesId.push(
            disabilityProfile,
          );
        } else {
          criterionObject.disabilitiesId = [disabilityProfile];
          disabilityGroup[criterionObject['id']] = criterionObject;
        }
      }
      const formatedCriterionList = [];
      for (const key in disabilityGroup) {
        formatedCriterionList.push(disabilityGroup[key]);
      }
      const disabilitiesGroupedByCriterion = await groupObjectsListByFieldName(
        formatedCriterionList,
        'level',
      );

      return disabilitiesGroupedByCriterion;
    } catch (error) {
      throw handleError(error, 'formCriterionsByDisability');
    }
  };

  /**
   * Create a map with criterion as a key and a recommendations
   * descriptions inside an array object as the value.
   * @return {Map<number, array>}
   */
  async function getMapCriterionIdXRecommendations() {
    let criterionIdXRecommendationsHash = {};
    const recommendations = await recommendationsModel.find();

    let recommendationValue = null;
    for (const recommendation of recommendations) {
      recommendationValue = {
        id: recommendation.id,
        recommendation: recommendation.descriptionRecommendation,
      };
      if (recommendation.criterionsId in criterionIdXRecommendationsHash) {
        criterionIdXRecommendationsHash[recommendation.criterionsId].push(
          recommendationValue,
        );
      } else {
        criterionIdXRecommendationsHash[recommendation.criterionsId] = [
          recommendationValue,
        ];
      }
    }

    return criterionIdXRecommendationsHash;
  }

  /**
   * Create a map with lists grouped by a field name
   * @param {array<Object>} objects
   * @param {string} fieldName
   */
  async function groupObjectsListByFieldName(objects, fieldName) {
    let groups = {};
    try {
      let finding;
      for (let index = 0; index < objects.length; index++) {
        finding = objects[index];
        if (finding[fieldName] in groups) {
          groups[finding[fieldName]].push(finding);
        } else {
          groups[finding[fieldName]] = [finding];
        }
      }
    } catch (error) {
      new CustomErrorLog(
        'DB > reportGenerator.js > groupObjectsListByFieldName > fieldName: ' +
          fieldName,
        error.message,
      ).saveError();
    }

    return groups;
  }

  /**
   * Service to get specification information and page info for an evaluator manual form.
   * @param {number} specificationId
   * @param {number} idPage
   */
  this.specificationAndPageInfo = async function(specificationId, idPage) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      returnObj.results.pageInfo = await pagesModel
        .findOne({
          where: {id: idPage},
          include: [
            {
              relation: 'pagesEvaluations',
            },
          ],
        })
        .then(page => {
          page = JSON.parse(JSON.stringify(page));
          return {
            idPage: page.id,
            url: page.url,
            title: page.title,
            domain: page.pagesEvaluations.domain,
          };
        });
      const fieldsList = ['name', 'brand', 'browserVersion', 'version'];
      returnObj.results.specificationInfo = await specificationsModel.findOne({
        where: {
          id: specificationId,
        },
        include: [
          {
            relation: 'specificationsBrowsers',
            scope: {
              fields: fieldsList,
            },
          },
          {
            relation: 'specificationsDevices',
            scope: {
              fields: fieldsList,
            },
          },
          {
            relation: 'specificationsOperativeSystems',
            scope: {
              fields: fieldsList,
            },
          },
          {
            relation: 'specificationsSupportTools',
            scope: {
              fields: fieldsList,
            },
          },
        ],
      });
    } catch (error) {
      throw handleError(error, 'specificationAndPageInfo');
    }
    return returnObj;
  };

  /**
   * Function to get an specific observation from a manual page.
   * @param {number} principleId
   * @param {number} idPage
   */
  this.getObservationField = async function(principleId, idPage) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      const observationField =
        eawConstants.EvaluatorFormConstants.OBSERVATION_FIELDS[principleId - 1];
      returnObj.results = await manualPagesModel
        .findOne({
          where: {
            id: idPage,
          },
          fields: [observationField, 'id'],
        })
        .then(data => {
          return {id: data.id, observation: data[observationField]};
        });
    } catch (error) {
      throw handleError(error, 'saveObservation');
    }
    return returnObj;
  };

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId) {
    new CustomErrorLog(
      'BE > EvaluatorFormLoadServices > ' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
