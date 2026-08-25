'use strict';

const app = require('../../../server/server');

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');
const EmailSharedService = require('../../shared/shared-services/email-shared-services');
const OtaiToClientReportResultsEmail = require('../../htmlEmails/html-report-notifications/otaiToClientReportResults');
const ReportSuccessfullFinished = require('../../htmlEmails/html-report-notifications/reportSuccessfullFinished');
const ReportCreationFailed = require('../../htmlEmails/html-report-notifications/reportCreationFailed');
const TranslationsManager = require('../../shared/translations/translations-manager');

module.exports = function ReportNotificationsServices() {
  const languagesModel = app.models.Languages;
  const usersModel = app.models.Users;
  const evaluationModel = app.models.Evaluations;
  const eawConstants = new EAWConstants();

  /**
   * An OTAI user send the access to results to the
   * client that request the evaluation.
   * @param {number} evaluationId
   */
  this.sendReportAcessOtaiToClient = async function(evaluationId) {
    const returnObj = {
      results: {},
      messages: {},
      count: 0,
    };
    try {
      const evaluation = await evaluationModel.findOne({
        where: {
          id: evaluationId,
        },
      });

      const clientUser = await usersModel.findOne({
        where: {
          id: evaluation.clientsId,
          isActive: 1,
        },
        fields: ['id', 'firstName', 'lastName', 'isActive', 'email'],
      });
      if (clientUser == null) {
        throw handleError(
          new Error(`Error: Client is not active: ${clientUser.email}`),
          'sendReportAcessOtaiToClient',
          evaluationId,
        );
      }
      const language = await languagesModel.findOne({
        where: {
          id: clientUser.languagesId,
        },
      });
      const userIana =
        language == null ? eawConstants.OTAI_DEFAULT_LANGUAGE : language.iana;
      const translationsManager = new TranslationsManager(
        'translations-htmlEmails',
      );
      const translatedData = await translationsManager.getTranslation(userIana);
      const otaiToClientReportResultsEmail = await new OtaiToClientReportResultsEmail(
        evaluation.siteName,
        evaluation.mainUrl,
        evaluation.evaluationCode,
        translatedData,
      ).getHtml();
      const wasSent = await new EmailSharedService().sendEmail(
        clientUser.email,
        translatedData.administrator.otaiToClientReportResults.emailTag,
        otaiToClientReportResultsEmail,
      );
      if (!wasSent) {
        throw new Error('Error sending the otai email.');
      }
      returnObj.results = clientUser;
    } catch (error) {
      throw handleError(error, 'sendReportAcessOtaiToClient', evaluationId);
    }

    return returnObj;
  };

  /**
   * Notify the report finalization, Send an email
   * to the otai user that create the evaluation.
   * @param {number} evaluationId
   */
  this.notifySuccessfullReportFinished = async function(evaluationId) {
    const returnObj = {
      results: {},
      messages: {},
      count: 0,
    };
    try {
      const evaluation = await evaluationModel.findOne({
        where: {
          id: evaluationId,
        },
      });

      let user = await usersModel.findOne({
        where: {
          id: evaluation.createdBy,
          isActive: 1,
        },
        fields: ['id', 'firstName', 'lastName', 'isActive', 'email'],
      });
      if (user == null) {
        user = await usersModel.findOne({
          where: {
            roleTypesId: 2,
            isActive: 1,
          },
          fields: ['id', 'firstName', 'lastName', 'isActive', 'email'],
        });

        throw handleError(
          new Error(`Error: User is not active: ${user.email}`),
          'notifySuccessfullReportFinished',
          evaluationId,
        );
      }
      const fullName = user.firstName + ' ' + user.lastName;
      const language = await languagesModel.findOne({
        where: {
          id: user.languagesId,
        },
      });
      const userIana =
        language == null ? eawConstants.OTAI_DEFAULT_LANGUAGE : language.iana;
      const translationsManager = new TranslationsManager(
        'translations-htmlEmails',
      );
      const translatedData = await translationsManager.getTranslation(userIana);
      const reportSuccessfullFinished = await new ReportSuccessfullFinished(
        fullName,
        evaluation.siteName,
        evaluation.mainUrl,
        evaluation.evaluationCode,
        translatedData,
      ).getHtml();
      new EmailSharedService().sendEmail(
        user.email,
        translatedData.administrator.reportSuccessfullFinished.emailTag,
        reportSuccessfullFinished,
      );
      returnObj.results = user;
    } catch (error) {
      handleError(error, 'notifySuccessfullReportFinished', evaluationId);
    }

    return returnObj;
  };

  /**
   * Notify the report finalization error, send an email
   * to the otai user that create the evaluation or to the next
   * enable otai user.
   * @param {number} evaluationId
   */
  this.notifyFailedCreationReport = async function(evaluationId) {
    const returnObj = {
      results: {},
      messages: {},
      count: 0,
    };
    try {
      const evaluation = await evaluationModel.findOne({
        where: {
          id: evaluationId,
        },
      });

      let user = await usersModel.findOne({
        where: {
          id: evaluation.createdBy,
          isActive: 1,
        },
        fields: ['id', 'firstName', 'lastName', 'isActive', 'email'],
      });
      if (user == null) {
        user = await usersModel.findOne({
          where: {
            roleTypesId: 2,
            isActive: 1,
          },
          fields: ['id', 'firstName', 'lastName', 'isActive', 'email'],
        });

        throw handleError(
          new Error(`Error: User is not active: ${user.email}`),
          'notifyFailedCreationReport',
          evaluationId,
        );
      }
      const language = await languagesModel.findOne({
        where: {
          id: user.languagesId,
        },
      });
      const userIana =
        language == null ? eawConstants.OTAI_DEFAULT_LANGUAGE : language.iana;
      const translationsManager = new TranslationsManager(
        'translations-htmlEmails',
      );
      const translatedData = await translationsManager.getTranslation(userIana);
      const reportCreationFailed = await new ReportCreationFailed(
        evaluation.siteName,
        evaluation.mainUrl,
        evaluation.id,
        translatedData,
      ).getHtml();
      new EmailSharedService().sendEmail(
        user.email,
        translatedData.administrator.reportCreationFailed.emailTag,
        reportCreationFailed,
      );
      returnObj.results = user;
    } catch (error) {
      handleError(error, 'notifyFailedCreationReport', evaluationId);
    }

    return returnObj;
  };

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId) {
    new CustomErrorLog(
      'BE > ReportNotificationsServices > ' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
