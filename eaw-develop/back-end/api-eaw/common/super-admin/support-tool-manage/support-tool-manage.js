'use strict';

const app = require('../../../server/server');
const EAWConstants = require('../../eaw-constants');
const _ = require('lodash');

/**
 * Manage support tools model services logic.
 */
function SupportToolManager() {
  const eawConstants = new EAWConstants();

  /**
   * Function to update support tool
   * @param supportToolToUpdate JSON support tool ti update
   */
  this.updateSupportTool = async function(supportToolToUpdate) {
    const supportToolModel = app.models.SupportTools;
    const supportToolsByDisabilitiesModel =
      app.models.SupportToolsByDisabilities;
    let _this = this;
    _this.returnObj = {
      results: {},
      messages: [],
      hasError: false,
    };
    try {
      const supportToolUpdated = await supportToolModel.update(
        {
          id: supportToolToUpdate.id,
        },
        _.omit(supportToolToUpdate, 'id'),
      );
      await supportToolsByDisabilitiesModel.destroyAll({
        supportToolId: supportToolToUpdate.id,
      });
      for (let disabilityId of supportToolToUpdate.disabilities) {
        supportToolsByDisabilitiesModel.create({
          supportToolId: supportToolToUpdate.id,
          disabilityId: disabilityId,
        });
      }
      _this.returnObj.results = supportToolUpdated;
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to get all support tools
   * @param isActive indicate the mode of support tools to get
   */
  this.getAllSupportTools = async function(isActive) {
    const supportToolsModel = app.models.SupportTools;
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    let filterSupporTools = {};
    if (isActive === `'null'`) {
      filterSupporTools = {
        include: [
          {
            relation: 'disabilities',
            scope: {
              include: [{relation: 'disabilities'}],
            },
          },
        ],
      };
    } else {
      filterSupporTools = {
        where: {
          isActive: isActive,
        },
        include: [
          {
            relation: 'disabilities',
            scope: {
              include: [{relation: 'disabilities'}],
            },
          },
        ],
      };
    }
    try {
      const supporToolData = await supportToolsModel.find(filterSupporTools);
      let supportToolToList = {};
      for (let supportTool of supporToolData) {
        supportToolToList = {};
        supportToolToList.id = supportTool.id;
        supportToolToList.name = supportTool.name;
        supportToolToList.version = supportTool.version;
        supportToolToList.isActive = supportTool.isActive;
        supportToolToList.disabilities = [];
        supportTool.toJSON().disabilities.map(disability => {
          supportToolToList.disabilities.push({
            id: disability.disabilities.id,
            name: disability.disabilities.name,
          });
        });
        _this.returnObj.results.push(supportToolToList);
      }
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to register new support tool
   * @param newSupportTool JSON to create support tool
   */
  this.postNewSupportTool = async function(newSupportTool) {
    const supportToolModel = app.models.SupportTools;
    const supportToolsByDisabilitiesModel =
      app.models.SupportToolsByDisabilities;
    let _this = this;
    _this.returnObj = {
      results: {},
      messages: [],
      hasError: false,
    };
    try {
      const supportToolCreated = await supportToolModel.create(newSupportTool);
      for (let disabilityId of newSupportTool.disabilities) {
        supportToolsByDisabilitiesModel.create({
          supportToolId: supportToolCreated.id,
          disabilityId: disabilityId,
        });
      }
      _this.returnObj.results = supportToolCreated;
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Manage the exeption
   * @param {*} reportErrorObj object to report the error
   * @param {*} error error
   */
  function handleError(reportErrorObj, error) {
    reportErrorObj.hasError = true;
    reportErrorObj.messages.push(error.toString());
    return error.toString();
  }
}

module.exports = SupportToolManager;
