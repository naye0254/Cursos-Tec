'use strict';
const AutomaticPagesServices = require('../../../administrator/evaluations-manage/automatic-pages-services');

module.exports = function(AutomaticEvaluatorPages) {
  /**
   * Return a list of automatic pages and pages data by evaluation id
   */
  AutomaticEvaluatorPages.automaticPagesByEvaluation = async function(
    idEvaluation,
  ) {
    const automaticPagesServices = new AutomaticPagesServices();
    return await automaticPagesServices.automaticPagesByEvaluation(
      idEvaluation,
    );
  };
  AutomaticEvaluatorPages.remoteMethod('automaticPagesByEvaluation', {
    description:
      'Return a list of automatic pages and pages data by evaluation id.',
    accepts: [{arg: 'idEvaluation', type: 'number', required: true}],
    http: {path: '/automaticPagesByEvaluation', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Return a list of automatic pages and pages data by evaluation id
   */
  AutomaticEvaluatorPages.assignAutomaticPages = async function(idEvaluation) {
    const automaticPagesServices = new AutomaticPagesServices();
    return await automaticPagesServices.assignAutomaticPages(idEvaluation);
  };
  AutomaticEvaluatorPages.remoteMethod('assignAutomaticPages', {
    description: 'Store automatic pages from pages by evaluation id.',
    accepts: [{arg: 'idEvaluation', type: 'number', required: true}],
    http: {path: '/assignAutomaticPages', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
