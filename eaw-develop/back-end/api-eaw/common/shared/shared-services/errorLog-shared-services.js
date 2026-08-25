'use strict';

const app = require('./../../../server/server');

/**
 * Save error logs in ErrorDebugs model
 * @param {String} locationName
 * @param {String} errorDescription
 * @param {number} pEvaluationsId
 */
function CustomErrorLog(
  locationName,
  errorDescription = '',
  pEvaluationsId = null,
) {
  /**
   * Function to save an error in ErrorDebugs table.
   */
  this.saveError = async function() {
    let description = '';
    try {
      if (typeof errorDescription === 'object') {
        if (errorDescription.message != undefined) {
          errorDescription = errorDescription.message;
        } else if (errorDescription.Error != undefined) {
          errorDescription = errorDescription.Error + '';
        } else {
          errorDescription = JSON.stringify(errorDescription);
        }
      } else {
        description = errorDescription + '';
      }
    } catch (error) {
      description = errorDescription + '';
    }
    description = errorDescription.slice(0, 1799);
    let errorData = {
      id: 0,
      locationName: locationName.slice(0, 254),
      errorDescription: description,
    };
    if (pEvaluationsId != null) {
      errorData.evaluationsId = pEvaluationsId;
    }

    await app.models.ErrorDebugs.create(errorData);
  };
}

module.exports = CustomErrorLog;
