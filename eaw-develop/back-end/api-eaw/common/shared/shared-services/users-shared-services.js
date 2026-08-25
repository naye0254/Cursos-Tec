'use strict';

const contactEmail = require('../../htmlEmails/contactEmail');
const CustomErrorLog = require('./errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');
const EmailSharedService = require('./email-shared-services');
const ForgotPasswordRequest = require('../../htmlEmails/forgotPasswordRequest');
const TranslationsManager = require('../translations/translations-manager');
const UserRegisteredEmail = require('../../htmlEmails/userRegisteredEmail');

const app = require('../../../server/server');
const md5 = require('md5');

/**
 * Contains user shared services.
 */
module.exports = class UsersSharedService {
  constructor() {
    this.eawConstants = new EAWConstants();
  }

  async forgotPsswordRequest(info) {
    try {
      const translationsManager = new TranslationsManager(
        'translations-htmlEmails',
      );
      const language = await app.models.Languages.findOne({
        where: {
          id: info.user.languagesId,
        },
      });
      const userIana =
        language == null
          ? this.eawConstants.OTAI_DEFAULT_LANGUAGE
          : language.iana;
      const translatedData = await translationsManager.getTranslation(userIana);
      const html = await new ForgotPasswordRequest(
        info.accessToken.id,
        info.accessToken.userId,
        translatedData,
      ).getHtml();

      return new EmailSharedService().sendEmail(
        info.email,
        translatedData.administrator.forgotPasswordRequest.emailTag,
        html,
      );
    } catch (error) {
      return this.handleError(
        new Error('> error sending password reset email\n', error),
        'forgotPsswordRequest',
      );
    }
  }

  /**
   * Send an email contact for the customer to OTAI.
   * @param {string} name
   * @param {string} company
   * @param {string} telephone
   * @param {string} email
   * @param {string} message
   */
  async sendMessageContact(name, company, telephone, email, message) {
    try {
      const eawConstants = new EAWConstants();
      const translationsManager = new TranslationsManager(
        'translations-htmlEmails',
      );
      const translatedData = await translationsManager.getTranslation(
        eawConstants.OTAI_DEFAULT_LANGUAGE,
      );
      const html = await new contactEmail(
        name,
        company,
        telephone,
        email,
        message,
        translatedData,
      ).getHtml();

      return new EmailSharedService().sendEmail(
        eawConstants.emailOTAI,
        translatedData.administrator.contactEmail.emailTag + company,
        html,
      );
    } catch (error) {
      return this.handleError(
        new Error('> error sending contact email\n', error),
        'sendMessageContact',
      );
    }
  }

  /**
   * markNotificationAsSeen
   * @param {number} id
   * @param {number} iana
   */
  async updateUserLanguajePreference(userId, iana) {
    const languagesModel = app.models.Languages;
    const usersModel = app.models.Users;
    const returnObj = {
      results: {},
      messages: {},
      hasError: false,
    };
    try {
      const language = await languagesModel.findOne({
        where: {
          iana: iana,
        },
      });
      if (language != null) {
        returnObj.results = await usersModel
          .update({id: userId}, {languagesId: language.id})
          .then((returnObj.messages = language));
      } else {
        throw new Error('Language not supported.');
      }
    } catch (error) {
      throw this.handleError(error, 'updateUserLanguajePreference');
    }
    return returnObj;
  }

  async generatePassword() {
    const randomSeed = await Math.random().toString(35);
    const longerSeed = await md5(randomSeed);
    return longerSeed.slice(5, 15);
  }

  async notifyUserCreated(user) {
    const languagesModel = app.models.Languages;
    const usersModel = app.models.Users;
    const roleTypesModel = app.models.RoleTypes;
    const returnObj = {
      results: {},
      messages: {},
      hasError: false,
    };
    try {
      const translationsManager = new TranslationsManager(
        'translations-htmlEmails',
      );
      const userRoles = await roleTypesModel.findOne({
        where: {id: user.roleTypesId},
        fields: ['roleType'],
      });
      const roleName = userRoles.roleType;
      const newPassword = await this.generatePassword();
      const fullName = user.firstName + ' ' + user.lastName;
      const storedUser = await usersModel.findOne({
        where: {
          id: user.id,
        },
      });
      if (storedUser != null) {
        const language = await languagesModel.findOne({
          where: {
            id: storedUser.languagesId,
          },
        });
        const userIana =
          language == null
            ? this.eawConstants.OTAI_DEFAULT_LANGUAGE
            : language.iana;

        storedUser.password = newPassword;
        await usersModel
          .update(
            {
              id: storedUser.id,
            },
            {
              password: storedUser.password,
            },
          )
          .then(async successfullyAdded => {
            const translatedData = await translationsManager.getTranslation(
              userIana,
            );
            const userRegisteredEmail = new UserRegisteredEmail(
              fullName,
              roleName,
              storedUser.email,
              newPassword,
              translatedData,
            );
            const userRegisteredHTML = await userRegisteredEmail.getHtml();
            new EmailSharedService().sendEmail(
              storedUser.email,
              translatedData.administrator.userRegisteredEmail.emailTag,
              userRegisteredHTML,
            );
          })
          .catch(error => {
            throw this.handleError(error, 'Creating first user password');
          });
      } else {
        throw this.handleError(
          'Cannot find registered user!',
          'notifyUserCreated',
        );
      }
    } catch (error) {
      throw this.handleError(error, 'notifyUserCreated');
    }
    return returnObj;
  }

  /**
   * Verify code and URL of an evaluation
   * @param {string} url
   * @param {string} code
   */
  async verifyCredentialsOfEvaluations(url, code) {
    const evaluationModel = app.models.Evaluations;

    const returnObj = {
      results: {},
      messages: [],
      hasError: false,
    };
    try {
      const evaluation = await evaluationModel.findOne({
        where: {
          evaluationCode: code,
          mainUrl: url,
        },
      });
      if (evaluation !== null) {
        returnObj.results = evaluation;
      } else {
        returnObj.hasError = true;
      }
    } catch (error) {
      throw this.handleError(error, 'verifyCredentialsOfEvaluations');
    }
    return returnObj;
  }

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  handleError(error, functionName = '') {
    new CustomErrorLog(
      'BE > NotificationSharedService > ' + functionName,
      error,
    ).saveError();
    return error;
  }
};
