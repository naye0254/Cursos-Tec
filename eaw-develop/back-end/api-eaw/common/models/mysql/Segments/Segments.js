'use strict';
const SegmentsManager = require('../../../super-admin/segments-manage/segments-manage');

module.exports = function(Segments) {
  /**
   * Service to get all segments by state
   */
  Segments.getAllSegments = async function(isActive) {
    const segmentManager = new SegmentsManager();
    return await segmentManager.getAllSegments(isActive);
  };
  Segments.remoteMethod('getAllSegments', {
    description: 'Return an array with segments.',
    accepts: [{arg: 'isActive', type: 'any', required: true}],
    http: {path: '/get-all-segments', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
