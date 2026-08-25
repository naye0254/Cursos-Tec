'use strict';

const CustomErrorLog = require('../../../shared/shared-services/errorLog-shared-services');

const app = require('../../../../server/server');

/**
 * Manage findings data for reports.
 */
module.exports = function ReportManualAnswersServices() {
  const manualAnswersModel = app.models.ManualAnswers;
  const specificationsModel = app.models.Specifications;
  const specificationsByManualPagesModel =
    app.models.SpecificationsByManualPages;

  /**
   * Function to get manual answers with pages
   * filtered by evaluation and specification with more data
   * for statistics.
   * @param {*} evaluationId
   * @param {*} specificationId
   */
  this.getManualAnswersBySpecificationOrEvaluation = async function(
    evaluationId,
    specificationId = null,
  ) {
    try {
      let specificationsIdList = [specificationId];
      if (specificationId === null) {
        const specifications = await specificationsModel.find({
          where: {
            evaluationsId: evaluationId,
          },
        });
        specificationsIdList = await getIdList(specifications);
      }
      const specsByManualPages = await specificationsByManualPagesModel.find({
        where: {
          specificationsId: {inq: specificationsIdList},
        },
      });
      const specsByManualPagesIdList = await getIdList(specsByManualPages);

      const manualAnswers = await manualAnswersModel
        .find({
          where: {
            specificationsByManualPagesId: {inq: specsByManualPagesIdList},
          },
          include: [
            {
              relation: 'manualAnswersSpecificationsByManualPages',
              scope: {
                include: [
                  {
                    relation: 'SpecificationsByManualPagesManualPages',
                    scope: {
                      include: [{relation: 'manualPagesPages'}],
                    },
                  },
                ],
              },
            },
          ],
        })
        .then(async answers => {
          answers = await JSON.parse(JSON.stringify(answers));
          return answers.map(data => {
            const pageRelation =
              data.manualAnswersSpecificationsByManualPages
                .SpecificationsByManualPagesManualPages.manualPagesPages;
            data.specByManualPageId =
              data.manualAnswersSpecificationsByManualPages.id;
            data.manualPageId =
              data.manualAnswersSpecificationsByManualPages.manualPagesId;
            data.specificationId =
              data.manualAnswersSpecificationsByManualPages.specificationsId;
            data.evaluationsId = pageRelation.evaluationsId;
            data.url = pageRelation.url;
            data.title = pageRelation.title;
            data.pageId = pageRelation.id;
            data.pageRel = pageRelation;
            delete data.manualAnswersSpecificationsByManualPages;
            return data;
          });
        });

      return manualAnswers;
    } catch (error) {
      throw handleError(
        error,
        'getManualAnswersBySpecificationOrEvaluation',
        evaluationId,
      );
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
      'BE > Reports > ReportManualAnswersServices > ' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
