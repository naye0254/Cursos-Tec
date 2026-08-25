'use strict';

const EvaluatorManager = require('../../../super-admin/evaluators-manage/evaluator-manager');
const PromoterManager = require('../../../super-admin/promoters-manage/promoter-manager');
const UsersSharedService = require('../../../shared/shared-services/users-shared-services');

module.exports = function(Users) {
  /**
   * Send password reset link when requested
   */
  Users.on('resetPasswordRequest', async function(info) {
    const usersSharedService = new UsersSharedService();
    return usersSharedService.forgotPsswordRequest(info);
  });

  /**
   * Send an email contact for the customer to OTAI.
   */
  Users.sendMessageContact = async function(
    name,
    company,
    telephone,
    email,
    message,
  ) {
    const usersSharedService = new UsersSharedService();
    return await usersSharedService.sendMessageContact(
      name,
      company,
      telephone,
      email,
      message,
    );
  };
  Users.remoteMethod('sendMessageContact', {
    description: 'Send an email of contact.',
    accepts: [
      {arg: 'name', type: 'string', required: true},
      {arg: 'company', type: 'string', required: true},
      {arg: 'telephone', type: 'string', required: true},
      {arg: 'email', type: 'string', required: true},
      {arg: 'message', type: 'string', required: false},
    ],
    http: {path: '/sendMessageContact', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to get all user promoters
   */
  Users.getAllPromoters = async function(isActive) {
    const promoterManager = new PromoterManager();
    return await promoterManager.getAllPromoters(isActive);
  };

  Users.remoteMethod('getAllPromoters', {
    description: 'Return an array with all Promoters Users.',
    accepts: [{arg: 'isActive', type: 'any', required: true}],
    http: {path: '/get-all-promoters', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to get all users evaluators
   */
  Users.getAllEvaluators = async function(isActive) {
    const evaluatorManager = new EvaluatorManager();
    return await evaluatorManager.getAllEvaluators(isActive);
  };

  Users.remoteMethod('getAllEvaluators', {
    description: 'Return an array with all Evaluators Users.',
    accepts: [{arg: 'isActive', type: 'any', required: true}],
    http: {path: '/evaluators', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to create an evaluator
   */
  Users.postEvaluator = async function(newEvaluator) {
    const evaluatorManager = new EvaluatorManager();
    return await evaluatorManager.postNewEvaluator(newEvaluator);
  };
  Users.remoteMethod('postEvaluator', {
    description: 'Create a evaluator in the database.',
    accepts: [{arg: 'newEvaluator', type: 'any', required: true}],
    http: {path: '/evaluators', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to update an Evaluator
   */
  Users.updateEvaluator = async function(evaluatorToUpdate) {
    const evaluatorManager = new EvaluatorManager();
    return await evaluatorManager.updateEvaluator(evaluatorToUpdate);
  };
  Users.remoteMethod('updateEvaluator', {
    description: 'Return an user object with data changed.',
    accepts: [{arg: 'evaluatorToUpdate', type: 'any', required: true}],
    http: {path: '/update-evaluator', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to update an Evaluator
   * @param {number} userId
   * @param {String} iana
   */
  Users.updateUserLanguajePreference = async function(userId, iana) {
    const usersSharedService = new UsersSharedService();
    return await usersSharedService.updateUserLanguajePreference(userId, iana);
  };
  Users.remoteMethod('updateUserLanguajePreference', {
    description: 'Return an user object with data changed.',
    accepts: [
      {arg: 'userId', type: 'any', required: true},
      {arg: 'iana', type: 'String', required: true},
    ],
    http: {path: '/updateUserLanguajePreference', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Every time a user is created, excecute an email notification.
   */
  Users.afterRemote('create', async function(ctx, userInstance) {
    if (ctx.req != undefined) {
      if (ctx.req.accessToken) {
        const usersSharedService = new UsersSharedService();
        usersSharedService.notifyUserCreated(userInstance);
      }
    }
    /* Prevent returns more information in callbacks. */
    ctx = null;
    return true;
  });
};
