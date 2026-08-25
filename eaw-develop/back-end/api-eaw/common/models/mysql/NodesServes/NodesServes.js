'use strict';
const PromoterEvaluationsManager = require('../../../administrator/evaluations-manage/evaluations-manage');

module.exports = function(NodesServes) {

    /**
     * Set a node to update a queue
     * @param {number} nodeId
     * @param {number} isRunning
    */
    NodesServes.updateQueueRunningState = async function(nodeId, isRunning) {
      const promoterEvaluationsManager = new PromoterEvaluationsManager();
      return await promoterEvaluationsManager.updateQueueRunningState(nodeId, isRunning);
    };
  
    NodesServes.remoteMethod('updateQueueRunningState', {
      description: 'Return an array with all evaluations created.',
      accepts: [
        {arg: 'nodeId', type: 'number', required: true},
        {arg: 'isRunning', type: 'number', required: true},
      ],
      http: {path: '/updateQueueRunningState', verb: 'get'},
      returns: {root: true, type: 'Object'},
    });

    /**
     * Check if one serve node is running a queue
     * @param {number} nodesServeId;
    */
     NodesServes.getQueueRunningState = async function(nodesServeId) {
      const promoterEvaluationsManager = new PromoterEvaluationsManager();
      return await promoterEvaluationsManager.getQueueRunningState(nodesServeId);
    };
  
    NodesServes.remoteMethod('getQueueRunningState', {
      description: 'Return an array with all evaluations created.',
      accepts: [
        {arg: 'nodesServeId', type: 'number', required: true},
      ],
      http: {path: '/getQueueRunningState', verb: 'get'},
      returns: {root: true, type: 'Object'},
    });

};
