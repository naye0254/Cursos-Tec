'use strict';
const SpecificationsManager = require('../../../evaluator/speficications-manager/specifications-manager');
const EvaluatorFormLoadServices = require('../../../evaluator/form-services/load-services');
const ReportSpecificationServices = require('../../../consultant/reports/models-manage/specification-services');

module.exports = function(Specifications) {
  Specifications.remoteMethod('getSpecificationsByEvaluationAndEvaluator', {
    description: 'Get a list of specifications by evaluator and evaluation.',
    accepts: [
      {arg: 'evaluationId', type: 'number', required: true},
      {arg: 'evaluatorId', type: 'any', required: false},
    ],
    http: {path: '/evaluations-id', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Get specifications by evaluator and evaluation id
   */
  Specifications.getSpecificationsByEvaluationAndEvaluator = async function(
    evaluationId,
    evaluatorId,
  ) {
    const specificationManager = new SpecificationsManager();
    return await specificationManager.getSpecificationsByEvaluationAndEvaluator(
      evaluationId,
      evaluatorId,
    );
  };

  Specifications.remoteMethod('getPagesBySpecificationId', {
    description: 'Get a list of pages by specification.',
    accepts: [{arg: 'specificationId', type: 'number', required: true}],
    http: {path: '/pages', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Get pages by specification id
   */
  Specifications.getPagesBySpecificationId = async function(specificationId) {
    const specificationManager = new SpecificationsManager();
    return await specificationManager.getPagesBySpecificationId(
      specificationId,
    );
  };

  Specifications.remoteMethod('disabilityProfilesByEqualSpecifications', {
    description:
      'Get the disability profiles for equal specifications for an evaluator.',
    accepts: [
      {arg: 'evaluationsId', type: 'number', required: true},
      {arg: 'specificationId', type: 'number', required: true},
    ],
    http: {path: '/disabilityProfilesByEqualSpecifications', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Get the disability profiles for equal specifications for an evaluator.
   */
  Specifications.disabilityProfilesByEqualSpecifications = async function(
    evaluationsId,
    specificationId,
  ) {
    const evaluatorFormLoadServices = new EvaluatorFormLoadServices();
    return await evaluatorFormLoadServices.disabilityProfilesByEqualSpecifications(
      evaluationsId,
      specificationId,
    );
  };

  /**
   * Service to get specification information and page info for an evaluator manual form.
   */
  Specifications.remoteMethod('specificationAndPageInfo', {
    description: 'Get specification information by page for evaluator form.',
    accepts: [
      {arg: 'specificationId', type: 'number', required: true},
      {arg: 'idPage', type: 'number', required: true},
    ],
    http: {path: '/specificationAndPageInfo', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  Specifications.specificationAndPageInfo = async function(
    specificationId,
    idPage,
  ) {
    const evaluatorFormLoadServices = new EvaluatorFormLoadServices();
    return await evaluatorFormLoadServices.specificationAndPageInfo(
      specificationId,
      idPage,
    );
  };

  Specifications.remoteMethod('getEspecificationsAndDisabilitiesByEvaluation', {
    description:
      'Get specifications grouped by disabilities filtered by evaluation.',
    accepts: [{arg: 'evaluationId', type: 'number', required: true}],
    http: {path: '/getEspecificationsAndDisabilitiesByEvaluation', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Get specifications grouped by disabilities filtered by evaluation.
   */
  Specifications.getEspecificationsAndDisabilitiesByEvaluation = async function(
    evaluationId,
  ) {
    const reportSpecificationServices = new ReportSpecificationServices();
    return await reportSpecificationServices.getEspecificationsAndDisabilitiesByEvaluation(
      evaluationId,
    );
  };
  /**
   * Get the disabilities assigned to an evaluation
   */
  Specifications.getDisabilitiesByEvaluation = async function(evaluationId) {
    const specificationManager = new SpecificationsManager();
    return await specificationManager.getDisabilitiesByEvaluation(evaluationId);
  };

  Specifications.remoteMethod('getDisabilitiesByEvaluation', {
    description: 'Get the disabilities assigned to an evaluation.',
    accepts: [{arg: 'evaluationId', type: 'number', required: true}],
    http: {path: '/evaluation-id/disabilities', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
