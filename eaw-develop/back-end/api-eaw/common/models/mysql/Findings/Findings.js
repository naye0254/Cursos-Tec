'use strict';

const ReportsFindingServices = require('../../../consultant/reports/models-manage/finding-services');

module.exports = function(Findings) {
  /**
   * Service to create evaluations
   */
  Findings.findingsByEvaluation = async function(evaluatorId) {
    const reportsFindingServices = new ReportsFindingServices();
    return await reportsFindingServices.findingsByEvaluation(evaluatorId);
  };

  Findings.remoteMethod('findingsByEvaluation', {
    description: 'Generate a list of Findings from an evaluation.',
    accepts: [{arg: 'evaluatorId', type: 'any', required: true}],
    http: {path: '/findingsByEvaluation', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });
};
