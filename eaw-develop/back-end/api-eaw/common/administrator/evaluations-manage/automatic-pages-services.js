'use strict';

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');

const app = require('../../../server/server');

/**
 * Manage AutomaticEvaluatorPages model services logic.
 */
module.exports = function AutomaticPagesServices() {
  const automaticEvaluatorPagesModel = app.models.AutomaticEvaluatorPages;
  const pagesModel = app.models.Pages;

  this.automaticPagesByEvaluation = async function(idEvaluation) {
    let result = [];
    try {
      const pages = await pagesModel.find({
        where: {evaluationsId: idEvaluation},
      });
      for (const page of pages) {
        if (page != null) {
          let automaticPage = await automaticEvaluatorPagesModel.findOne({
            where: {pagesId: page.id},
          });
          automaticPage.url = page.url;
          automaticPage.title = page.title;
          automaticPage.evaluationsId = page.evaluationsId;
          result.push(automaticPage);
        }
      }
      return result;
    } catch (error) {
      new CustomErrorLog(
        'automatic-pages-services > automaticPagesByEvaluation',
        error,
        idEvaluation,
      ).saveError();
    }
    return result;
  };

  /**
   * Function to save automatic pages. Should be used after
   * saving evaluation pages.
   */
  this.assignAutomaticPages = async function(idEvaluation) {
    const returnObj = {results: [], count: null, message: []};
    try {
      const pages = await pagesModel.find({
        where: {evaluationsId: idEvaluation},
      });
      for (let page of pages) {
        const automaticPageData = {
          id: 0,
          pagesId: page.id,
          evaluationPageState: 0,
        };
        await automaticEvaluatorPagesModel.create(automaticPageData);
      }
      return (returnObj.count = pages.length);
    } catch (error) {
      new CustomErrorLog(
        'automaticPagesServices > assignAutomaticPages',
        error,
        idEvaluation,
      ).saveError();
    }
  };
};
