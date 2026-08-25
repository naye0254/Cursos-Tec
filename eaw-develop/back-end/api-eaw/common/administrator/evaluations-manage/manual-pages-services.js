'use strict';

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');

const app = require('../../../server/server');

/**
 * Manage ManualPages EvaluatorPages model services logic.
 */
module.exports = function ManualPagesServices() {
  const eawConstants = new EAWConstants();
  const manualPagesModel = app.models.ManualPages;
  const pagesModel = app.models.Pages;
  const specificationsModel = app.models.Specifications;
  const specificationsByManualPagesModel =
    app.models.SpecificationsByManualPages;

  /**
   * Function to save manual pages. Should be used after
   * saving evaluation pages.
   */
  this.assignManualPages = async function(evaluationId) {
    const returnObj = {results: [], count: null, message: []};
    try {
      const evaluationFilter = {
        where: {evaluationsId: evaluationId},
      };
      const pages = await pagesModel.find(evaluationFilter);
      const specifications = await specificationsModel.find(evaluationFilter);
      for (const specification of specifications) {
        for (const page of pages) {
          const createdManualPage = await manualPagesModel.create({
            pagesId: page.id,
            evaluationPageState: eawConstants.EvaluationStates.PENDING,
          });
          await specificationsByManualPagesModel.create({
            manualPagesId: createdManualPage.id,
            specificationsId: specification.id,
          });
        }
      }

      return (returnObj.message = ['Manual pages created.']);
    } catch (error) {
      throw handleError(error, 'assignManualPages', evaluationId);
    }
  };

  /**
   * Function to get manual pages by evaluation id.
   */
  this.manualPagesByEvaluation = async function(evaluationId) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      const specifications = await specificationsModel.find({
        where: {evaluationsId: evaluationId},
      });
      let manualPagesIdsList = [];
      for (const specification of specifications) {
        await specificationsByManualPagesModel
          .find({
            where: {
              specificationsId: specification.id,
            },
          })
          .then(specificationsByManualPages => {
            return specificationsByManualPages.forEach(
              specificationsByManualPage => {
                manualPagesIdsList.push(
                  specificationsByManualPage.manualPagesId,
                );
              },
            );
          });
      }
      returnObj.results = await manualPagesModel.find({
        where: {
          id: {inq: manualPagesIdsList},
        },
        fields: ['id', 'pagesId', 'evaluationPageState'],
      });

      return returnObj;
    } catch (error) {
      throw handleError(error, 'manualPagesByEvaluation', evaluationId);
    }
  };

  /**
   * Function to get manual pages by specification id.
   * @param {number}
   */
  this.manualPagesBySpecification = async function(specificationId) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      let manualPagesIdsList = await specificationsByManualPagesModel
        .find({
          where: {
            specificationsId: specificationId,
          },
        })
        .then(specificationsByManualPages => {
          return specificationsByManualPages.map(
            specificationsByManualPage =>
              specificationsByManualPage.manualPagesId,
          );
        });
      returnObj.results = await manualPagesModel
        .find({
          where: {
            id: {inq: manualPagesIdsList},
          },
          include: [{relation: 'manualPagesPages'}],
          fields: {formPage: false},
        })
        .then(async result => {
          result = await JSON.parse(JSON.stringify(result));
          return result.map((manualPage, index) => {
            manualPage.title = manualPage.manualPagesPages.title;
            manualPage.url = manualPage.manualPagesPages.url;
            manualPage.index = index + 1;
            return manualPage;
          });
        });

      return returnObj.results;
    } catch (error) {
      throw handleError(error, 'manualPagesByEvaluation');
    }
  };

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId) {
    new CustomErrorLog(
      'BE > ManualPagesServices > ' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
