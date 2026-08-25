'use strict';

const CustomErrorLog = require('../../../shared/shared-services/errorLog-shared-services');

const app = require('../../../../server/server');

/**
 * Manage findings data for reports.
 */
module.exports = function ReportsCriterionsServices() {
  const criterionModel = app.models.Criterions;

  /**
   * Function to return a map with criterion as key and
   * principleId as a value.
   */
  this.generateMapIdCritrionXIdPrinciple = async function() {
    const returnObj = {results: {}, count: null, message: []};
    try {
      let criterionPrinciples = await criterionModel
        .find({
          include: {
            relation: 'criterionsGuidelines',
            scope: {
              include: {
                relation: 'guidelinesPrinciples',
              },
            },
          },
        })
        .then(data => JSON.parse(JSON.stringify(data)));
      for (const criterionPrinciple of criterionPrinciples) {
        returnObj.results[criterionPrinciple.id] =
          criterionPrinciple.criterionsGuidelines.principlesId;
      }

      return returnObj;
    } catch (error) {
      throw handleError(error, 'generateMapIdCritrionXIdPrinciple');
    }
  };

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId = null) {
    new CustomErrorLog(
      'BE > Consultant > Reports > ReportsCriterionsServices >' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
