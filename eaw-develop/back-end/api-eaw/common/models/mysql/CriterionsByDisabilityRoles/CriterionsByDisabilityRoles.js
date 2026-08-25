'use strict';

const EvaluatorFormLoadServices = require('../../../evaluator/form-services/load-services');

module.exports = function(CriterionsByDisabilityRoles) {
  CriterionsByDisabilityRoles.remoteMethod('formCriterionsByDisability', {
    description: 'Get a list of pages by specification.',
    accepts: [
      {arg: 'evaluationsId', type: 'number', required: true},
      {arg: 'specificationsId', type: 'number', required: true},
      {arg: 'principleId', type: 'number', required: true},
    ],
    http: {path: '/formCriterionsByDisability', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to get criterions filtered principle and by
   * evaluator profiles for equal specifications for an
   * evaluator, grouped by conformity level.
   */
  CriterionsByDisabilityRoles.formCriterionsByDisability = async function(
    evaluationsId,
    specificationsId,
    principleId,
  ) {
    const evaluatorFormLoadServices = new EvaluatorFormLoadServices();
    return await evaluatorFormLoadServices.formCriterionsByDisability(
      evaluationsId,
      specificationsId,
      principleId,
    );
  };
};
