'use strict';

const ClientsBySegmentsManager = require('../../../administrator/evaluations-manage/evaluations-manage');

module.exports = function(ClientsBySegments) {
  /**
   * Service to get all user segments
   */
  ClientsBySegments.getAllSegmentsByClient = async function(clientId) {
    const clientsBySegmentsManager = new ClientsBySegmentsManager();
    return await clientsBySegmentsManager.getAllSegmentsByClients(clientId);
  };

  ClientsBySegments.remoteMethod('getAllSegmentsByClient', {
    description: 'Return an array with all segment of a client.',
    accepts: [{arg: 'clientId', type: 'any', required: false}],
    http: {path: '/get-segments-by-client', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
