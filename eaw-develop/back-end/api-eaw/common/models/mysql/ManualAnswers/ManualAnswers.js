'use strict';

const EvaluatorFormSaveServices = require('../../../evaluator/form-services/save-services');

const ReportManualAnswersServices = require('../../../consultant/reports/models-manage/manualAnswers-services');

module.exports = function(ManualAnswers) {
  /**
   * Service to save manual answers by an specific format
   * from an evaluator manual form.
   */
  ManualAnswers.saveManualAnswers = async function(
    idManualPage,
    isFinished,
    formObject,
  ) {
    const evaluatorFormSaveServices = new EvaluatorFormSaveServices();
    return await evaluatorFormSaveServices.saveManualAnswers(
      idManualPage,
      isFinished,
      formObject,
    );
  };
  ManualAnswers.remoteMethod('saveManualAnswers', {
    description:
      'Save manual answers by an specific format from an evaluator manual form.',
    accepts: [
      {arg: 'idManualPage', type: 'number', required: true},
      {arg: 'isFinished', type: 'Boolean', required: true},
      {arg: 'formObject', type: 'Object', required: true},
    ],
    http: {path: '/saveManualAnswers', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to get manual answers with pages
   * filtered by evaluation and specification.
   */
  ManualAnswers.getManualAnswersBySpecificationOrEvaluation = async function(
    evaluationId,
    specficationId,
  ) {
    const reportManualAnswersServices = await new ReportManualAnswersServices();
    return await reportManualAnswersServices.getManualAnswersBySpecificationOrEvaluation(
      evaluationId,
      specficationId,
    );
  };
  ManualAnswers.remoteMethod('getManualAnswersBySpecificationOrEvaluation', {
    description:
      'Get manual answers with pages filtered by evaluation and specification..',
    accepts: [
      {arg: 'evaluationId', type: 'number', required: true},
      {arg: 'specficationId', type: 'number', required: false},
    ],
    http: {path: '/getManualAnswersBySpecificationOrEvaluation', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });
};
