'use strict';

const app = require('../../../server/server');
const EAWConstants = require('../../eaw-constants');

/**
 * Manage segments model services logic.
 */
function SegmentManager() {
  const eawConstants = new EAWConstants();

  /**
   * Function to get all segments
   * @param isActive indicate the mode of the segments to get
   */
  this.getAllSegments = async function(isActive) {
    const segmentsModel = app.models.Segments;
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    let filterSegments = {};
    if (isActive === `'null'`) {
      filterSegments = {
        include: [
          {
            relation: 'segmentsCountries',
          },
        ],
      };
    } else {
      filterSegments = {
        where: {
          isActive: isActive,
        },
        include: [
          {
            relation: 'segmentsCountries',
          },
        ],
      };
    }
    try {
      const segmentData = await segmentsModel.find(filterSegments);
      let segmentToList = {};
      for (let segment of segmentData) {
        segmentToList = {};
        segmentToList.id = segment.id;
        segmentToList.name = segment.name;
        segmentToList.isActive = segment.isActive;
        segmentToList.countryId = segment.countryId;
        segmentToList.countryName = segment.toJSON().segmentsCountries.name;
        _this.returnObj.results.push(segmentToList);
      }
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

module.exports = SegmentManager;
