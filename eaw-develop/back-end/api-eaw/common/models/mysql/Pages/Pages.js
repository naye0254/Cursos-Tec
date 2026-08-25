'use strict';

const app = require('../../../../server/server');

const CustomErrorLog = require('../../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../../eaw-constants');
const PagesServices = require('../../../administrator/evaluations-manage/pages-services');

module.exports = function(Pages) {
  const eawConstants = new EAWConstants();
  /**
   * Save random generated pages and save that list of pages
   * in Pages model and update the json selectedMapSite in
   * evaluation model.
   */
  Pages.saveRandomSelectedPages = async function(idEvaluation) {
    const pagesServices = new PagesServices();
    return await pagesServices.saveRandomSelectedPages(idEvaluation);
  };

  Pages.remoteMethod('saveRandomSelectedPages', {
    description:
      'Save random generated pages and save the list of pages from an evaluation.',
    accepts: [{arg: 'idEvaluation', type: 'any', required: true}],
    http: {path: '/saveRandomSelectedPages', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to create evaluations
   */
  Pages.saveSelectedPages = async function(
    evaluatorId,
    selectedPages,
    selectedSiteMap,
  ) {
    const pagesServices = new PagesServices();
    return await pagesServices.saveSelectedPages(
      evaluatorId,
      selectedPages,
      selectedSiteMap,
    );
  };

  Pages.remoteMethod('saveSelectedPages', {
    description: 'Generate a list of pages from an evaluation.',
    accepts: [
      {arg: 'evaluatorId', type: 'any', required: true},
      {arg: 'selectedPages', type: 'array', required: true},
      {arg: 'selectedSiteMap', type: 'any', required: true},
    ],
    http: {path: '/saveSelectedPages', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * TODO :
   * This service is used only in manual evaluation when
   * mark the option to dont start evaluation automatically.
   * @param {number} idEvaluation
   */
  Pages.addPageToManualEvaluation = async function(idEvaluation, url, title) {
    const evaluationsModel = app.models.Evaluations;
    const pagesServices = new PagesServices();
    const returnObj = {
      results: {
        idEvaluation: idEvaluation,
        url: url,
        title: title,
      },
      count: 1,
      message: [],
    };
    try {
      let isPackage3 = await evaluationsModel
        .findOne({
          where: {
            id: idEvaluation,
          },
          fields: ['id', 'packagesId'],
        })
        .then(data => {
          if (data) {
            return data.packagesId === 3;
          } else {
            throw 'Evaluation does not exist';
          }
        });
      if (isPackage3) {
        let newPageId = await pagesServices
          .createPage(idEvaluation, url, title)
          .then(response => {
            if (response) {
              return response.id;
            } else {
              throw 'Error creating new page';
            }
          });
        await evaluationsModel.update(
          {
            id: idEvaluation,
          },
          {
            pagesChoosed: eawConstants.PagesChoosedStates.SELECTED,
            scrapingState: eawConstants.ScrapingStates.FINISHED,
          },
        );
        await assignManualPageManually(idEvaluation, newPageId);
        await setManualEvaluationStartDate(idEvaluation);
        return returnObj;
      } else {
        throw 'Evaluation package must be manual specific (3).';
      }
    } catch (error) {
      new CustomErrorLog(
        'Pages.js > assignManualPageManually',
        error,
        idEvaluation,
      ).saveError();
      throw error;
    }
  };
  Pages.remoteMethod('addPageToManualEvaluation', {
    description: 'Used to add pages on selected pages',
    accepts: [
      {arg: 'idEvaluation', type: 'number', required: true},
      {arg: 'url', type: 'string', required: true},
      {arg: 'title', type: 'string', required: true},
    ],
    http: {path: '/addPageToManualEvaluation', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * This function is used only in manual evaluation when
   * mark the option to dont start evaluation automatically.
   * @param {number} idEvaluation
   * @param {number} pageId
   */
  async function assignManualPageManually(idEvaluation, pageId) {
    const specificationsModel = app.models.Specifications;
    const manualPagesModel = app.models.ManualPages;
    const specificationsByManualPagesModel =
      app.models.SpecificationsByManualPages;

    try {
      const specifications = await specificationsModel.find({
        where: {evaluationsId: idEvaluation},
      });

      for (const specification of specifications) {
        const createdManualPage = await manualPagesModel.create({
          pagesId: pageId,
          evaluationPageState: eawConstants.EvaluationStates.PENDING,
        });
        await specificationsByManualPagesModel.create({
          manualPagesId: createdManualPage.id,
          specificationsId: specification.id,
        });
      }
    } catch (error) {
      new CustomErrorLog(
        'Pages.js > assignManualPageManually',
        error,
        idEvaluation,
      ).saveError();
      throw error;
    }
  }

  /**
   * Function to save the start date of a manual
   * evaluation.
   * @param {number} idEvaluation
   */
  async function setManualEvaluationStartDate(idEvaluation) {
    try {
      const startDate = await new Date();
      await app.models.DatesByEvaluations.update(
        {evaluationsId: idEvaluation},
        {manualStartDateAt: startDate},
      );
      return startDate;
    } catch (error) {
      new CustomErrorLog(
        'Pages.js > addPageToManualEvaluation',
        error,
        idEvaluation,
      ).saveError();
      throw error;
    }
  }
};
