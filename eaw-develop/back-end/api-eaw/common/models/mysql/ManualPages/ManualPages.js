'use strict';

const EvaluatorFormLoadServices = require('../../../evaluator/form-services/load-services');
const EvaluatorFormSaveServices = require('../../../evaluator/form-services/save-services');
const ManualPagesServices = require('../../../administrator/evaluations-manage/manual-pages-services');

module.exports = function(ManualPages) {
  /**
   * Store manual pages and specification by pages data.
   */
  ManualPages.assignManualPages = async function(evaluationId) {
    const manualPagesServices = new ManualPagesServices();
    return await manualPagesServices.assignManualPages(evaluationId);
  };
  ManualPages.remoteMethod('assignManualPages', {
    description: 'Store manual pages from pages by evaluation id.',
    accepts: [{arg: 'evaluationId', type: 'number', required: true}],
    http: {path: '/assignManualPages', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to save an specific observation in manual page model.
   */
  ManualPages.saveObservationField = async function(
    principleId,
    idManualPage,
    observation,
  ) {
    const evaluatorFormSaveServices = new EvaluatorFormSaveServices();
    return await evaluatorFormSaveServices.saveObservationField(
      principleId,
      idManualPage,
      observation,
    );
  };
  ManualPages.remoteMethod('saveObservationField', {
    description: 'Save an specific observation in manual page model.',
    accepts: [
      {arg: 'principleId', type: 'number', required: true},
      {arg: 'idManualPage', type: 'number', required: true},
      {arg: 'observation', type: 'any', required: true},
    ],
    http: {path: '/saveObservationField', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to get an specific observation from a manual page.
   */
  ManualPages.getObservationField = async function(principleId, idManualPage) {
    const evaluatorFormLoadServices = new EvaluatorFormLoadServices();
    return await evaluatorFormLoadServices.getObservationField(
      principleId,
      idManualPage,
    );
  };
  ManualPages.remoteMethod('getObservationField', {
    description: 'Get an specific observation from a manual page.',
    accepts: [
      {arg: 'principleId', type: 'number', required: true},
      {arg: 'idManualPage', type: 'number', required: true},
    ],
    http: {path: '/getObservationField', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to get manual pages by evaluation id.
   */
  ManualPages.manualPagesByEvaluation = async function(evaluationId) {
    const manualPagesServices = new ManualPagesServices();
    return await manualPagesServices.manualPagesByEvaluation(evaluationId);
  };
  ManualPages.remoteMethod('manualPagesByEvaluation', {
    description: 'Get manual pages by evaluation id.',
    accepts: [{arg: 'evaluationId', type: 'number', required: true}],
    http: {path: '/manualPagesByEvaluation', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Function to get manual pages by specification id,
   * all data.
   */
  ManualPages.manualPagesBySpecification = async function(specificationId) {
    const manualPagesServices = new ManualPagesServices();
    return await manualPagesServices.manualPagesBySpecification(
      specificationId,
    );
  };
  ManualPages.remoteMethod('manualPagesBySpecification', {
    description: 'Get manual pages by evaluation id.',
    accepts: [{arg: 'specificationId', type: 'number', required: true}],
    http: {path: '/manualPagesBySpecification', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
