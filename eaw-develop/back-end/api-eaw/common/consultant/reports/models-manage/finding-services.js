'use strict';

const CustomErrorLog = require('../../../shared/shared-services/errorLog-shared-services');

const app = require('../../../../server/server');

/**
 * Manage findings data for reports.
 */
module.exports = function ReportsFindingServices() {
  const automaticEvaluatorPagesModel = app.models.AutomaticEvaluatorPages;
  const findingsModel = app.models.Findings;
  const pagesModel = app.models.Pages;

  /**
   * Function to return all automatic findings
   * by evaluation.
   */
  this.findingsByEvaluation = async function(idEvaluation) {
    const returnObj = {results: [], count: null, message: []};
    try {
      const pagesIdList = await pagesModel
        .find({
          where: {
            evaluationsId: idEvaluation,
          },
        })
        .then(pages => getIdList(pages));
      const automaticPagesIdList = await automaticEvaluatorPagesModel
        .find({
          where: {
            pagesId: {inq: pagesIdList},
          },
        })
        .then(automaticPages => getIdList(automaticPages));

      returnObj.results = await findingsModel
        .find({
          where: {
            automaticEvaluatorPagesId: {inq: automaticPagesIdList},
          },
          include: [
            {
              relation: 'findingsAutomaticEvaluatorPages',
              scope: {
                include: [{relation: 'automaticEvaluatorPagesPages'}],
              },
            },
          ],
        })
        .then(findings => {
          findings = JSON.parse(JSON.stringify(findings));
          return findings.map(data => {
            data.pageId =
              data.findingsAutomaticEvaluatorPages.automaticEvaluatorPagesPages.id;
            data.title =
              data.findingsAutomaticEvaluatorPages.automaticEvaluatorPagesPages.title;
            data.url =
              data.findingsAutomaticEvaluatorPages.automaticEvaluatorPagesPages.url;
            delete data.findingsAutomaticEvaluatorPages;
            return data;
          });
        });

      return returnObj;
    } catch (error) {
      throw handleError(error, 'findingsByEvaluation', idEvaluation);
    }
  };

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
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId) {
    new CustomErrorLog(
      'BE > Consultant > Reports > ReportsFindingServices >' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
