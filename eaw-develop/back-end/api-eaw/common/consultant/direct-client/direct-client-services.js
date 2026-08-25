'use strict';

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EmailSharedService = require('../../shared/shared-services/email-shared-services');
const TranslationsManager = require('../../shared/translations/translations-manager');
const DirectConsultantRequest = require('../../htmlEmails/directConsultantResults');
const DirectConsultantEvaluationRequest = require('../../htmlEmails/directConsultantEvaluationRequest');
const EAWConstants = require('../../eaw-constants');

const app = require('../../../server/server');

module.exports = function DirectClientServices() {
  const languagesModel = app.models.Languages;
  const usersModel = app.models.Users;
  const evaluationModel = app.models.Evaluations;
  const eawConstants = new EAWConstants();

  /**
   * Function used by a direct client to send credentials to
   * a direct client or email.
   * @param {number} evaluationId
   * @param {string} destinationEmail
   */
  this.notifyIndirectClient = async function(evaluationId, destinationEmail) {
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
        throw new Error(`Error: Client is not active: ${clientUser.email}`);
      }
      const fullName = clientUser.firstName + ' ' + clientUser.lastName;
      const language = await languagesModel.findOne({
        where: {
          id: evaluation.languagesId,
        },
      });
      const userIana =
        language == null ? eawConstants.OTAI_DEFAULT_LANGUAGE : language.iana;
      const translationsManager = new TranslationsManager(
        'translations-htmlEmails',
      );
      const translatedData = await translationsManager.getTranslation(userIana);
      const directConsultantRequest = await new DirectConsultantRequest(
        fullName,
        evaluation.siteName,
        evaluation.mainUrl,
        evaluation.evaluationCode,
        translatedData,
      ).getHtml();
      new EmailSharedService().sendEmail(
        destinationEmail,
        translatedData.administrator.DirectConsultantResult.emailTag,
        directConsultantRequest,
      );
      returnObj.results = clientUser;
    } catch (error) {
      throw handleError(error, 'notifyIndirectClient', evaluationId);
    }

    return returnObj;
  };

  this.requestEvaluationToOtai = async function(clientId, clientMessage) {
    const returnObj = {
      results: {},
      messages: {},
      count: 0,
    };
    try {
      const clientUser = await usersModel.findOne({
        where: {
          id: clientId,
          isActive: 1,
        },
      });
      if (clientUser === null) {
        throw new Error(`Error: Client is not active: ${clientUser.email}`);
      }
      const translationsManager = new TranslationsManager(
        'translations-htmlEmails',
      );
      const translatedData = await translationsManager.getTranslation(
        eawConstants.OTAI_DEFAULT_LANGUAGE,
      );

      const directConsultantEvaluationRequest = await new DirectConsultantEvaluationRequest(
        `${clientUser.firstName} ${clientUser.lastName}`,
        clientUser.telephone,
        clientUser.email,
        clientMessage,
        translatedData,
      ).getHtml();

      const promoterUsers = await usersModel.find({
        where: {
          and: [{roleTypesId: 2}, {isActive: true}],
        },
      });
      const emailSharedService = new EmailSharedService();

      for (const promoterUser of promoterUsers) {
        await emailSharedService.sendEmail(
          promoterUser.email,
          translatedData.administrator.evaluationRequest.emailTag,
          directConsultantEvaluationRequest,
        );
      }
      returnObj.count = 1;
      return await returnObj;
    } catch (error) {
      throw handleError(error, 'requestEvaluationToOtai');
    }

    return await returnObj;
  };

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId = null) {
    new CustomErrorLog(
      'BE > DirectClientServices > ' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
