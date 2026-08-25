'use strict';
const EvaluationsManager = require('../../../administrator/evaluations-manage/evaluations-manage');

module.exports = function(DisabilitiesByUsers) {
  /**
   * Service to get all evaluator by disability
   */
  DisabilitiesByUsers.getEvaluatorsByDisability = async function(disabilityId) {
    const evaluationsManager = new EvaluationsManager();
    return await evaluationsManager.getAllEvaluatorByDisability(disabilityId);
  };
  DisabilitiesByUsers.remoteMethod('getEvaluatorsByDisability', {
    description: 'Return an array with segments.',
    accepts: [{arg: 'disabilityId', type: 'number', required: true}],
    http: {path: '/get-evaluators-by-disability', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
