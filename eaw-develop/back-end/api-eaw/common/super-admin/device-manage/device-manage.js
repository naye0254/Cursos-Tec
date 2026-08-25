'use strict';

const app = require('../../../server/server');
const EAWConstants = require('../../eaw-constants');
const _ = require('lodash');

/**
 * Manage devices model services logic.
 */
function DevicesManager() {
  const eawConstants = new EAWConstants();

  /**
   * Function to get all devices by state .
   */
  this.getAllDevices = async function(isActive) {
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    let filterEvaluators = {};
    if (isActive === `'null'`) {
      filterEvaluators = {
        include: [
          {
            relation: 'operativeSystemFk',
          },
        ],
      };
    } else {
      filterEvaluators = {
        where: {
          isActive: isActive,
        },
        include: [
          {
            relation: 'operativeSystemFk',
          },
        ],
      };
    }
    try {
      const listDevices = await app.models.Devices.find(filterEvaluators);
      listDevices.map(device => {
        _this.returnObj.results.push({
          id: device.id,
          isActive: device.isActive,
          name: device.name,
          brand: device.brand,
          version: device.version,
          operativeSystemId: device.operativeSystemId,
          operativeSystemLabel: device.toJSON().operativeSystemFk.name,
          id: device.id,
        });
      });
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to handle errors .
   */
  function handleError(reportErrorObj, error) {
    reportErrorObj.hasError = true;
    reportErrorObj.messages.push(error.toString());
    return error.toString();
  }
}

module.exports = DevicesManager;
