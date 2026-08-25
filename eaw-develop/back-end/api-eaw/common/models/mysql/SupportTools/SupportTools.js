'use strict';
const SupportToolManager = require('../../../super-admin/support-tool-manage/support-tool-manage');

module.exports = function(SupportTools) {
  /**
   * Service to update a support tool
   */
  SupportTools.updateSupportTool = async function(supportToolToUpdate) {
    const supportToolManager = new SupportToolManager();
    return await supportToolManager.updateSupportTool(supportToolToUpdate);
  };
  SupportTools.remoteMethod('updateSupportTool', {
    description: 'Return an object with support tool updated.',
    accepts: [{arg: 'supportToolToUpdate', type: 'any', required: true}],
    http: {path: '/update-support-tool', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to get all support tool by state
   */
  SupportTools.getAllSupportTool = async function(isActive) {
    const supportToolManager = new SupportToolManager();
    return await supportToolManager.getAllSupportTools(isActive);
  };
  SupportTools.remoteMethod('getAllSupportTool', {
    description: 'Return an array with all Support Tools.',
    accepts: [{arg: 'isActive', type: 'any', required: true}],
    http: {path: '/get-all-support-tool', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to create a support tool
   */
  SupportTools.postSupportTool = async function(newSupportTool) {
    const supportToolManager = new SupportToolManager();
    return await supportToolManager.postNewSupportTool(newSupportTool);
  };
  SupportTools.remoteMethod('postSupportTool', {
    description: 'Return an array with all Support Tools.',
    accepts: [{arg: 'newSupportTool', type: 'any', required: true}],
    http: {path: '/post-support-tool', verb: 'post'},
    returns: {root: true, type: 'Object'},
  });
};
