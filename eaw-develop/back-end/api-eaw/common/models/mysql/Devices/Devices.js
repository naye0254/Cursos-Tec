'use strict';
const DeviceManager = require('../../../super-admin/device-manage/device-manage');

module.exports = function(Devices) {
  /**
   * Service to get all devices by state
   */
  Devices.getAllDevices = async function(isActive) {
    const deviceManager = new DeviceManager();
    return await deviceManager.getAllDevices(isActive);
  };
  Devices.remoteMethod('getAllDevices', {
    description: 'Return an array with devices.',
    accepts: [{arg: 'isActive', type: 'any', required: true}],
    http: {path: '/get-all-devices', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
