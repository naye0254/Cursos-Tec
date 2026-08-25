'use strict';

const CustomErrorLog = require('../../../shared/shared-services/errorLog-shared-services');

const app = require('../../../../server/server');

/**
 * Manage findings data for reports.
 */
module.exports = function ReportSpecificationServices() {
  const specificationsModel = app.models.Specifications;

  /**
   * Get specifications grouped by disabilities filtered by evaluation.
   * @param {number} idEvaluation
   */
  this.getEspecificationsAndDisabilitiesByEvaluation = async function(
    idEvaluation,
  ) {
    let specifications = {};
    try {
      const fieldsList = ['name', 'brand', 'browserVersion', 'version'];
      specifications = await specificationsModel
        .find({
          where: {
            evaluationsId: idEvaluation,
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
            {
              relation: 'specificationsDisabilities',
              scope: {
                fields: fieldsList,
              },
            },
          ],
        })
        .then(result => {
          result = JSON.parse(JSON.stringify(result));
          return result.map((spec, index) => {
            return {
              index: index + 1,
              specificationId: spec.id,
              device: spec.specificationsDevices.name,
              operativeSystem: spec.specificationsOperativeSystems.name,
              browser: spec.specificationsBrowsers.name,
              disability: spec.specificationsDisabilities.name,
              supportTool: spec.specificationsSupportTools.name,
            };
          });
        });

      return specifications;
    } catch (error) {
      throw handleError(
        error,
        'getEspecificationsAndDisabilitiesByEvaluation',
        idEvaluation,
      );
    }
  };

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId) {
    new CustomErrorLog(
      'BE > Consultant > reports > specification-services.js > ' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
