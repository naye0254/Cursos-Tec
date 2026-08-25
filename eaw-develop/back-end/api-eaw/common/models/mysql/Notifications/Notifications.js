'use strict';

const NotificationSharedService = require('../../../shared/shared-services/notification-shared-services');

/**
 * Custom notifications model services
 */
module.exports = function(Notifications) {
  /**
   * Service for mark notifications as seen.
   * @param {number} id
   */
  Notifications.markNotificationAsSeen = async function(id) {
    const notificationSharedService = new NotificationSharedService();

    return await notificationSharedService.markNotificationAsSeen(id);
  };

  Notifications.remoteMethod('markNotificationAsSeen', {
    description: 'Change state of a notification by id.',
    accepts: [{arg: 'id', type: 'any', required: false}],
    http: {path: '/markNotificationAsSeen', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to get las 'n' unseen notifications by user id.
   * @param {number} userId
   * @param {number} quantity
   */
  Notifications.lastUnSeenNotifications = async function(userId, quantity) {
    const notificationSharedService = new NotificationSharedService();
    return await notificationSharedService.lastUnSeenNotifications(
      userId,
      quantity,
    );
  };
  Notifications.remoteMethod('lastUnSeenNotifications', {
    description: 'Get las "n" unseen  notifications by user id.',
    accepts: [
      {arg: 'userId', type: 'any', required: true},
      {arg: 'quantity', type: 'any', required: false},
    ],
    http: {path: '/lastUnSeenNotifications', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });

  /**
   * Service to get las 'n' unseen notifications by user id.
   * @param {number} userId
   * @param {number} quantity
   */
  Notifications.lastNotifications = async function(userId, quantity) {
    const notificationSharedService = new NotificationSharedService();
    return await notificationSharedService.lastNotifications(userId, quantity);
  };
  Notifications.remoteMethod('lastNotifications', {
    description: 'Get las "n" notifications by user id.',
    accepts: [
      {arg: 'userId', type: 'any', required: true},
      {arg: 'quantity', type: 'any', required: false},
    ],
    http: {path: '/lastNotifications', verb: 'get'},
    returns: {root: true, type: 'Object'},
  });
};
