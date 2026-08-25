'use strict';

const WcagManager = require('../../../super-admin/wcag-manage/wcag-manage');
const ReportsCriterionsServices = require('../../../consultant/reports/models-manage/criterions-services');

module.exports = function(Criterions) {
  /**
   * Service to get all criterions by state
   */
  Criterions.getAllCriterions = async function(isActive) {
    const wcagManager = new WcagManager();
    return await wcagManager.getAllCriterionsByState(isActive);
  };
  Criterions.remoteMethod('getAllCriterions', {
    description: 'Return an array with all criterions.',
    accepts: [{arg: 'isActive', type: 'any', required: true}],
    http: {path: '/get-all-criterions', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to get all guide lines by principle
   */
  Criterions.getGuidesByPrinciple = async function(principleId) {
    const wcagManager = new WcagManager();
    return await wcagManager.getGuidesByPrinciple(principleId);
  };
  Criterions.remoteMethod('getGuidesByPrinciple', {
    description: 'Return an array with all guide lines of a principle.',
    accepts: [{arg: 'principleId', type: 'any', required: true}],
    http: {path: '/get-guide-by-principle', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to create a criterion
   */
  Criterions.postCriterion = async function(newCriterion) {
    const wcagManager = new WcagManager();
    return await wcagManager.postNewCriterion(newCriterion);
  };
  Criterions.remoteMethod('postCriterion', {
    description: 'Return an array with criterion created.',
    accepts: [{arg: 'newCriterion', type: 'any', required: true}],
    http: {path: '/post-criterion', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to update a criterion
   */
  Criterions.updateCriterion = async function(criterionToUpdate) {
    const wcagManager = new WcagManager();
    return await wcagManager.updateCriterion(criterionToUpdate);
  };
  Criterions.remoteMethod('updateCriterion', {
    description: 'Return an object with criterion updated.',
    accepts: [{arg: 'criterionToUpdate', type: 'any', required: true}],
    http: {path: '/update-criterion', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to return a map with criterion as key and
   * principleId as a value.
   */
  Criterions.generateMapIdCritrionXIdPrinciple = async function() {
    const reportsCriterionsServices = new ReportsCriterionsServices();
    return await reportsCriterionsServices.generateMapIdCritrionXIdPrinciple();
  };
  Criterions.remoteMethod('generateMapIdCritrionXIdPrinciple', {
    description:
      'Return a map with criterion as key and principleId as a value.',
    accepts: [],
    http: {path: '/generateMapIdCritrionXIdPrinciple', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
