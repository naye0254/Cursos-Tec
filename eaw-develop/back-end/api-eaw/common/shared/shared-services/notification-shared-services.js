'use strict';

const app = require('../../../server/server');
const CustomErrorLog = require('./errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');

/**
 * Contains notification shared services.
 */
module.exports = class NotificationSharedService {
  constructor() {
    this.eawConstants = new EAWConstants();
  }

  /**
   * markNotificationAsSeen
   * @param {number} id
   */
  async markNotificationAsSeen(id) {
    const notificationsModel = app.models.Notifications;
    const returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    try {
      returnObj.results = await notificationsModel.update(
        {id: id},
        {viewed: this.eawConstants.NOTIFICATION_STATES.SEEN},
      );
    } catch (error) {
      throw this.handleError(error, 'markNotificationAsSeen');
    }
    return returnObj;
  }

  /**
   * Service to get las 'n' unseen notifications by user id.
   * @param {number} userId
   * @param {number} quantity
   */
  async lastUnSeenNotifications(
    userId,
    quantity = this.eawConstants.NOTIFICATION_LIMIT,
  ) {
    const notificationsModel = app.models.Notifications;
    const returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    try {
      returnObj.results = await notificationsModel.find({
        where: {
          and: [
            {usersId: userId},
            {viewed: this.eawConstants.NOTIFICATION_STATES.UNSEEN},
          ],
        },
        order: 'date DESC',
        limit: quantity,
      });
    } catch (error) {
      throw this.handleError(error, 'lastUnSeenNotifications');
    }
    return returnObj;
  }

  /**
   * Service to get las 'n' unseen notifications by user id.
   * @param {number} userId
   * @param {number} quantity
   */
  async lastNotifications(userId, quantity = null) {
    const notificationsModel = app.models.Notifications;
    const returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    try {
      returnObj.results = await notificationsModel.find({
        where: {
          usersId: userId,
        },
        order: 'date DESC',
        limit: quantity,
      });
    } catch (error) {
      throw this.handleError(error, 'lastNotifications');
    }
    return returnObj;
  }

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  handleError(error, functionName) {
    new CustomErrorLog(
      'BE > NotificationSharedService > ' + functionName,
      error,
    ).saveError();
    return error;
  }
};
