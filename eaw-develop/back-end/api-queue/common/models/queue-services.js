'use strict';

const InitQueue = require('./../InitQueue');
const fs = require('fs');

module.exports = function (Queueservices) {
  /**
   * Function to create a folder to store errors
   * @param {String} folderPath path without folder name
   * @param {String} folderName
   * @returns {any}
   */
  function createLogsFolder(folderPath = './server/local-storage/', folderName = 'logs') {
    try {
      const fullPath = folderPath + folderName;
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
        return `Folder '${folderName}' created.`;
      } else {
        return `Folder '${folderName}' exists.`;
      }
    } catch (error) {
      return error;
    }
  }

  /**
   * Start the Q for Evaluations.
   */
  Queueservices.startQueue = async function () {
    const folderCreated = await createLogsFolder();
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(1000);

    return {
      folderCreatedResponse: folderCreated,
      initQueue: new InitQueue().startQueue()
    };
  };

  Queueservices.remoteMethod('startQueue', {
    description: 'Start the Q for Evaluations.',
    accepts: [],
    http: {path: '/startQueue', verb: 'get'},
    returns: {root: true, type: 'any'}
  });

  /**
   * Starts the Q for pending reports.
   */
  Queueservices.startQueuePendingReports = async function () {
    return await new InitQueue().startQueuePendingReports().then((result) => result);
  };

  Queueservices.remoteMethod('startQueuePendingReports', {
    description: 'Starts the Q for pending reports with Jasper.',
    accepts: [],
    http: {path: '/startQueuePendingReports', verb: 'get'},
    returns: {root: true, type: 'Object'}
  });

  /**
   * Set a node to update a queue
   * @param {number} nodeId
   * @param {number} isRunning
   */
  Queueservices.updateQueueRunningStateFromNode = async function (nodeId, isRunning) {
    const initQueue = new InitQueue();

    return initQueue.updateQueueRunningStateFromNode(nodeId, isRunning).then((result) => {
      return result.data;
    });
  };

  Queueservices.remoteMethod('updateQueueRunningStateFromNode', {
    description: 'Update queueIsRunning state. Gets 0 or 1.',
    accepts: [
      {arg: 'nodeId', type: 'number', required: true},
      {arg: 'isRunning', type: 'number', required: true}
    ],
    http: {path: '/updateQueueRunningStateFromNode', verb: 'get'},
    returns: {root: true, type: 'Object'}
  });
};
