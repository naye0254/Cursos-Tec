'use strict';

const app = require('../../../server/server');
const CustomErrorLog = require('./errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');

/**
 * Contains user shared services.
 */
module.exports = class EmailSharedService {
  constructor() {
    this.eawConstants = new EAWConstants();
  }

  /**
   * Function to send emails
   * @param {string} receptorEmail
   * @param {string} mailSubject
   * @param {string} htmlBody
   */
  async sendEmail(receptorEmail, mailSubject, htmlBody) {
    const emailOptions = {
      to: receptorEmail,
      subject: mailSubject,
      html: htmlBody
    };
    const usersModel = app.models.Users;
    return new Promise(function(resolve, reject) {
      usersModel.app.models.Email.send(emailOptions, function(error, mail) {
        if (error) {
          handleError(error);
          resolve(false);
        } else {
          resolve(mail);
        }
      });
    });
  }
};

function handleError(error) {
  new CustomErrorLog('BE > EmailSharedService > sendEmail()', error).saveError();
  return error;
}
