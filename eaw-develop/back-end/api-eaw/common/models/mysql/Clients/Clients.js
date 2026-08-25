'use strict';

const ClientManager = require('../../../super-admin/clients-manage/client-manager');

const ClientAdministratorManager = require('../../../administrator/clients-manage/clients.manage');

const DirectClientServices = require('../../../consultant/direct-client/direct-client-services');

/**
 * Custom clients model services
 */
module.exports = function(Clients) {
  /**
   * Service for advance search of clients.
   * @param name
   * @param email
   * @param createdBy
   * @param createdAt
   * @param isActive
   */
  Clients.clientsWithEvaluations = async function(
    name,
    email,
    createdBy,
    createdAt,
    segmentId,
    isActive,
    isDeleted
  ) {
    const clientManager = new ClientManager();
    return await clientManager.getClientsWithEvaluations(
      name,
      email,
      createdBy,
      createdAt,
      segmentId,
      isActive,
      isDeleted
    );
  };

  Clients.remoteMethod('clientsWithEvaluations', {
    description:
      'Return an array with all Clients with the quantity of evaluations.',
    accepts: [
      {arg: 'name', type: 'any', required: false},
      {arg: 'email', type: 'any', required: false},
      {arg: 'createdBy', type: 'any', required: false},
      {arg: 'createdAt', type: 'any', required: false},
      {arg: 'segmentId', type: 'any', required: false},
      {arg: 'isActive', type: 'any', required: true},
      {arg: 'isDeleted', type: 'any', required: true},
    ],
    http: {path: '/clientsWithEvaluations', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Post new client in the database
   * @param newClient
   */
  Clients.postClient = async function(newClient) {
    const clientManager = new ClientAdministratorManager();
    return await clientManager.postNewClient(newClient);
  };

  /**
   * Remote method to post client
   */
  Clients.remoteMethod('postClient', {
    description: 'Post a client and relations in the database.',
    accepts: [{arg: 'client', type: 'any', required: true}],
    http: {path: '/clients', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Edit a client in the database
   * @param clientToUpdate
   */
  Clients.editClient = async function(clientToUpdate) {
    const clientManager = new ClientAdministratorManager();
    return await clientManager.editClient(clientToUpdate);
  };

  /**
   * Remote method to edit client
   */
  Clients.remoteMethod('editClient', {
    description: 'Post a client and relations in the database.',
    accepts: [{arg: 'client', type: 'any', required: true}],
    http: {path: '/update-clients', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service used by direct client to send credentials to
   * a direct client or email.
   * @param {number} evaluationId
   * @param {string} email
   */
  Clients.notifyIndirectClient = async function(evaluationId, email) {
    const directClientServices = new DirectClientServices();
    return await directClientServices.notifyIndirectClient(evaluationId, email);
  };

  Clients.remoteMethod('notifyIndirectClient', {
    description: 'Send credentials to an email.',
    accepts: [
      {arg: 'evaluationId', type: 'number', required: true},
      {arg: 'email', type: 'string', required: true},
    ],
    http: {path: '/notifyIndirectClient', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
