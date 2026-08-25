'use strict';

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');

const app = require('../../../server/server');
const axios = require('axios');
const pa11y = require('pa11y');

module.exports = function PallyEvaluation(mapCodeXIdAutomaticDescriptions) {
  const eawConstants = new EAWConstants();

  async function proccessEntryCode(code) {
    try {
      const pallyCode = code;
      let parameterNodeName = '';
      let onlyCode = '';

      if (pallyCode != undefined) {
        const allButCodeRegex = `.*\.Principle[0-9]\.Guideline[0-9][0-9]?_[0-9][0-9]?\.`;
        const allButCode = pallyCode.match(allButCodeRegex)[0];
        onlyCode = pallyCode.replace(allButCode, '');

        if (onlyCode.indexOf('H49') !== -1) {
          const value = await onlyCode.match('H49.*')[0].split('.')[1];
          parameterNodeName = value;
          if (value != 'AlignAttr') {
            onlyCode = '1_3_1.H49.[NodeName]';
          }
        }
        if (onlyCode.indexOf('H91') !== -1) {
          let name = await onlyCode.match(`H91\..*\.Name`);
          let value = await onlyCode.match(`H91\..*\.Value`);
          if (name != null) {
            parameterNodeName = await name[0].split('.')[1];
            onlyCode = '4_1_2.H91.[NodeName].Name';
          } else if (value != null) {
            parameterNodeName = await value[0].split('.')[1];
            onlyCode = '4_1_2.H91.[NodeName].Value';
          }
        }
        /*
        Fix pally issue. Example:
          Input:
            1_4_3_F24.F24.FGColour
          expected:
            1_4_3.F24.FGColour
        */
        let criterionRegex = `[0-9][0-9]?_[0-9][0-9]?_[0-9][0-9]?`;
        let criterion = onlyCode.match(criterionRegex)[0];
        let codeWithoutCriterion = onlyCode.replace(criterion, '');
        if (codeWithoutCriterion.indexOf('_') === 0) {
          codeWithoutCriterion = codeWithoutCriterion.slice(1);
          let parts = codeWithoutCriterion.split('.');
          if (
            parts[0] == parts[1] &&
            parts[0] != undefined &&
            parts[1] != undefined
          ) {
            let removedFailPair = codeWithoutCriterion.replace(parts[0], '');
            onlyCode = criterion + removedFailPair;
          }
        }
      }
      const result = {
        htmlElement: parameterNodeName,
        codeSnifferCode: onlyCode,
      };
      return result;
    } catch (error) {
      new CustomErrorLog(
        'BE > pallyManager.js > proccessEntryCode error',
        error.toString(),
      ).saveError();
    }
  }

  /**
   * Save an issue in Findings model.
   * @param {object} issue
   * @param {object} criterionObj
   * @param {number} idPage
   */
  async function saveFinding(issue, criterionObj, idPage) {
    let issueCriteria = [];
    try {
      let regex = `[0-9][0-9]?_[0-9][0-9]?_[0-9][0-9]?`;
      issueCriteria = await issue.code.match(regex);
      if (issueCriteria != null) {
        issueCriteria = issueCriteria[0];
      }
      let pallyIssue = await proccessEntryCode(issue.code);
      let automaticDescriptionId = await mapCodeXIdAutomaticDescriptions[
        pallyIssue.codeSnifferCode
      ];

      if (automaticDescriptionId == undefined) {
        new CustomErrorLog(
          'BE > pallyManager.js > proccessEntryCode > code not found',
          'pallyCode: ' +
            issue.code +
            ' - parsedCode: ' +
            pallyIssue.codeSnifferCode +
            ' - pa11y description: ' +
            issue.message +
            ' - type: ' +
            issue.type,
        ).saveError();
      } else {
        if (issue.context != null) {
          let findingData = {
            id: 0,
            automaticEvaluatorPagesId: idPage,
            criterionsId: criterionObj[issueCriteria],
            htmlCode: issue.context,
            htmlSelectorPath: issue.selector,
            description: issue.message,
            findingType: issue.type,
            automaticDescriptionsId: automaticDescriptionId,
          };
          await app.models.Findings.create(findingData);
        }
      }
    } catch (error) {
      new CustomErrorLog(
        'BE > pallyManager.js > saveFinding > idPage: ' +
          idPage +
          ' idCriteria: ' +
          issueCriteria +
          ' pallyIssue: ' +
          issue.code,
        error,
      ).saveError();
    }
  }

  /**
   * Return the results of an analisys
   * for one url.
   * @param {String} link
   * @param {Object} criterionObj
   * @param {number} idPage
   * @returns {Object}
   */
  async function analysePage(link, criterionObj, idPage) {
    let aLevels = eawConstants.PallyConstants.CONFORMITY_LEVELS;
    try {
      const options = {
        /*
          Pally warning: Could be fine, but need manual review
          Pally notices: Not reviewed by pa11y, but give a recommendation. */
        includeNotices: eawConstants.PallyConstants.INCLUDE_NOTICES,
        includeWarnings: eawConstants.PallyConstants.INCLUDE_WARNINGS,
        timeout: 120000,
        chromeLaunchConfig: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        ignore: [],
      };
      const levelAIgnoredRules = [
        'WCAG2A.Principle2.Guideline2_1.2_1_1.SCR20.DblClick',
        'WCAG2A.Principle2.Guideline2_1.2_1_1.SCR20.MouseOver',
        'WCAG2A.Principle2.Guideline2_1.2_1_1.SCR20.MouseOut',
        'WCAG2A.Principle2.Guideline2_1.2_1_1.SCR20.MouseMove',
        'WCAG2A.Principle2.Guideline2_1.2_1_1.SCR20.MouseDown',
        'WCAG2A.Principle2.Guideline2_1.2_1_1.SCR20.MouseUp',
        'WCAG2A.Principle2.Guideline2_2.2_2_2.F4',
        'WCAG2A.Principle4.Guideline4_1.4_1_2.H91.A.Empty',
        'WCAG2A.Principle4.Guideline4_1.4_1_2.H91.A.EmptyWithName',
        'WCAG2A.Principle4.Guideline4_1.4_1_2.H91.A.NoHref',
        'WCAG2A.Principle4.Guideline4_1.4_1_2.H91.A.Placeholder',
        'WCAG2A.Principle1.Guideline1_1.1_1_1.H35.2',
        'WCAG2A.Principle1.Guideline1_1.1_1_1.H35.3',
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H44.NonExistentFragment',
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H44.NoForAttr',
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H44.NoId',
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H65',
        'WCAG2A.Principle1.Guideline1_3.1_3_1.H43.MissingHeaderIds',
        'WCAG2A.Principle1.Guideline1_3.1_3_5_H98.FaultyValue',
      ];
      const levelAAIgnoredRules = [
        'WCAG2AA.Principle2.Guideline2_1.2_1_1.SCR20.DblClick',
        'WCAG2AA.Principle2.Guideline2_1.2_1_1.SCR20.MouseOver',
        'WCAG2AA.Principle2.Guideline2_1.2_1_1.SCR20.MouseOut',
        'WCAG2AA.Principle2.Guideline2_1.2_1_1.SCR20.MouseMove',
        'WCAG2AA.Principle2.Guideline2_1.2_1_1.SCR20.MouseDown',
        'WCAG2AA.Principle2.Guideline2_1.2_1_1.SCR20.MouseUp',
        'WCAG2AA.Principle2.Guideline2_2.2_2_2.F4',
        'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.Empty',
        'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.EmptyWithName',
        'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.NoHref',
        'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.A.Placeholder',
        'WCAG2AA.Principle1.Guideline1_1.1_1_1.H35.2',
        'WCAG2AA.Principle1.Guideline1_1.1_1_1.H35.3',
        'WCAG2AA.Principle1.Guideline1_3.1_3_1.H44.NonExistentFragment',
        'WCAG2AA.Principle1.Guideline1_3.1_3_1.H44.NoForAttr',
        'WCAG2AA.Principle1.Guideline1_3.1_3_1.H44.NoId',
        'WCAG2AA.Principle1.Guideline1_3.1_3_1.H65',
        'WCAG2AA.Principle1.Guideline1_3.1_3_1.H43.MissingHeaderIds',
        'WCAG2AA.Principle1.Guideline1_3.1_3_5_H98.FaultyValue',
      ];
      const levelAAAIgnoredRules = [
        'WCAG2AAA.Principle2.Guideline2_1.2_1_1.SCR20.DblClick',
        'WCAG2AAA.Principle2.Guideline2_1.2_1_1.SCR20.MouseOver',
        'WCAG2AAA.Principle2.Guideline2_1.2_1_1.SCR20.MouseOut',
        'WCAG2AAA.Principle2.Guideline2_1.2_1_1.SCR20.MouseMove',
        'WCAG2AAA.Principle2.Guideline2_1.2_1_1.SCR20.MouseDown',
        'WCAG2AAA.Principle2.Guideline2_1.2_1_1.SCR20.MouseUp',
        'WCAG2AAA.Principle2.Guideline2_2.2_2_2.F4',
        'WCAG2AAA.Principle4.Guideline4_1.4_1_2.H91.A.Empty',
        'WCAG2AAA.Principle4.Guideline4_1.4_1_2.H91.A.EmptyWithName',
        'WCAG2AAA.Principle4.Guideline4_1.4_1_2.H91.A.NoHref',
        'WCAG2AAA.Principle4.Guideline4_1.4_1_2.H91.A.Placeholder',
        'WCAG2AAA.Principle1.Guideline1_1.1_1_1.H35.2',
        'WCAG2AAA.Principle1.Guideline1_1.1_1_1.H35.3',
        'WCAG2AAA.Principle1.Guideline1_3.1_3_1.H44.NonExistentFragment',
        'WCAG2AAA.Principle1.Guideline1_3.1_3_1.H44.NoForAttr',
        'WCAG2AAA.Principle1.Guideline1_3.1_3_1.H44.NoId',
        'WCAG2AAA.Principle1.Guideline1_3.1_3_1.H65',
        'WCAG2AAA.Principle1.Guideline1_3.1_3_1.H43.MissingHeaderIds',
        'WCAG2AAA.Principle1.Guideline1_3.1_3_5_H98.FaultyValue',
      ];

      if ('A' in aLevels) {
        options.standard = `WCAG2A`;
        options.ignore = levelAIgnoredRules;
        const result = await pa11y(link, options).then(results => results);
        for (const finding of result.issues) {
          await saveFinding(finding, criterionObj, idPage);
        }
      }
      if ('AA' in aLevels) {
        options.standard = `WCAG2AA`;
        options.ignore = levelAAIgnoredRules;
        const result = await pa11y(link, options).then(results => results);
        for (const finding of result.issues) {
          await saveFinding(finding, criterionObj, idPage);
        }
      }
      if ('AAA' in aLevels) {
        options.standard = `WCAG2AAA`;
        options.ignore = levelAAAIgnoredRules;
        const result = await pa11y(link, options).then(results => results);
        for (const finding of result.issues) {
          await saveFinding(finding, criterionObj, idPage);
        }
      }

      await app.models.AutomaticEvaluatorPages.update(
        {id: idPage},
        {evaluationPageState: eawConstants.EvaluationStates.FINISHED},
      );
    } catch (error) {
      const internetAvailadble = await checkInternetConnection();
      if (!internetAvailadble) {
        await resetEvaluationForLastAutomaticPage(idPage);
        await waitForInternet();
        analysePage(link, criterionObj, idPage);
      } else {
        app.models.AutomaticEvaluatorPages.update(
          {id: idPage},
          {evaluationPageState: eawConstants.EvaluationStates.FAILED},
        );
        new CustomErrorLog(
          'BE > pallyManager.js > analysePage > idAutomaticPage:' +
            idPage +
            ' link:' +
            link,
          error,
        ).saveError();
      }
    }
  }

  /**
   * Set an automatic page to be evaluated again
   * if is needed.
   * @param {*} idAutomaticEvaluatorPage
   */
  async function resetEvaluationForLastAutomaticPage(idAutomaticEvaluatorPage) {
    try {
      await app.models.AutomaticEvaluatorPages.update(
        {id: idAutomaticEvaluatorPage},
        {evaluationPageState: -2},
      );
      try {
        await app.models.Findings.destroyAll({
          automaticEvaluatorPagesId: idAutomaticEvaluatorPage,
        });
      } catch (error) {
        /* Expected error*/
      }
      return 1;
    } catch (error) {
      new CustomErrorLog(
        'DB > pallyManager.js > resetEvaluationForLastAutomaticPage > idAutomaticPage: ' +
          idAutomaticEvaluatorPage,
        error,
      ).saveError();
      throw error;
    }
  }

  /**
   * Function to get a map where criterion numbers field
   * is the key and the criterion id is the value.
   */
  async function getDBCriterion() {
    try {
      let criterion = await app.models.Criterions.find();
      let criterionObj = {};
      criterion.forEach(element => {
        let issueCriteria = element.numberCriterion.split('.').join('_');
        criterionObj[issueCriteria] = element.id;
      });

      return criterionObj;
    } catch (error) {
      new CustomErrorLog(
        'DB > pallyManager.js > getDBCriterion',
        error,
      ).saveError();

      return error;
    }
  }

  /**
   * Iterate all links provided to execute the analisys
   * for each link.
   * @param {Array} automaticPages
   * @returns {Object}
   */
  async function analysePages(automaticPages) {
    try {
      let criterionObj = await getDBCriterion();
      for (let index = 0; index < automaticPages.length; index++) {
        await analysePage(
          automaticPages[index].url,
          criterionObj,
          automaticPages[index].id,
        );
        const internetAvailadble = await checkInternetConnection();
        if (!internetAvailadble) {
          throw new Error('No Internet connection');
        } else {
          // Do nothing.
        }
      }
    } catch (error) {
      new CustomErrorLog(
        'BE > pallyManager.js > analysePages > ',
        error,
      ).saveError();
    }
  }

  function sleepFor(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) {
      /* do nothing */
    }
  }

  /**
   * An infinite still theres available
   * internet connection.
   */
  async function waitForInternet() {
    let keepWaiting = false;
    while (!keepWaiting) {
      keepWaiting = await checkInternetConnection();
      if (keepWaiting) {
        return await keepWaiting;
      } else {
        sleepFor(5000);
      }
    }
  }

  /**
   * Function to check internet connection
   * using known functional sites.
   */
  async function checkInternetConnection() {
    let response = {};
    const urls = [eawConstants.EnvVars.API_ENDPOINT, 'https://www.google.com/'];
    for (let index = 0; index < urls.length; index++) {
      const URL = urls[index];
      response = await axios({
        url: URL,
        method: 'head',
      })
        .then(response => true)
        .catch(error => false);
      if (response) {
        return true;
      }
    }

    return false;
  }

  /**
   * Update automatic evaluation ending date
   * in models: Evaluation and DatesByEvaluations
   * @param {number} idEvaluation
   * @param {date} endingDate
   */
  async function updateEvaluationEndingDate(idEvaluation, endingDate = null) {
    try {
      if (endingDate === null) {
        endingDate = await new Date();
      }
      await app.models.DatesByEvaluations.update(
        {
          evaluationsId: idEvaluation,
        },
        {
          automaticFinishedDateAt: endingDate,
          evaluationFinishedAt: endingDate,
        },
      );
    } catch (error) {
      new CustomErrorLog(
        'BE > pallyManager.js > updateEvaluationEndingDate',
        error,
        idEvaluation,
      ).saveError();
    }
  }

  /**
   * @param {number} idEvaluation
   * @param {number} state
   */
  async function updateAutomaticEvaluationState(idEvaluation, state) {
    return await app.models.Evaluations.update(
      {id: idEvaluation},
      {automaticEvaluationState: state},
    );
  }

  /**
   * Update automatic evaluation start date
   * in DatesByEvaluations model.
   * @param {number} idEvaluation
   * @param {date} endingDate
   */
  async function updateEvaluationStartDate(idEvaluation, startDate = null) {
    if (startDate == null) {
      startDate = await new Date();
    }
    await app.models.DatesByEvaluations.update(
      {evaluationsId: idEvaluation},
      {automaticStartDateAt: startDate},
    );
  }

  /**
   * Function to insert a notification for all promoter active users.
   */
  async function notifyPromoterUsers(notificationPath, clientName) {
    try {
      const currentDate = await new Date();
      const promoterUsers = await app.models.Users.find({
        where: {
          and: [{roleTypesId: 2}, {isActive: true}],
        },
      });
      for (const promoterUser of promoterUsers) {
        const notificationData = {
          date: currentDate,
          descriptionPath: notificationPath,
          usersId: promoterUser.id,
          viewed: 0,
          parameters: `{name: '${clientName}'}`,
        };
        await app.models.Notifications.create(notificationData);
      }
    } catch (error) {
      new CustomErrorLog(
        'BE > pallyManager.js > notifyPromoterUsers',
        error,
        idEvaluation,
      ).saveError();
    }
  }

  /**
   * Get client full name from an evaluation
   * by evaluation id.
   * @param {number} idEvaluation
   */
  async function getClientName(idEvaluation) {
    try {
      const evaluation = await app.models.Evaluations.findOne({
        where: {
          id: idEvaluation,
        },
        fields: ['clientsId'],
      });
      if (evaluation !== null) {
        const clientUser = await app.models.Users.findOne({
          where: {
            id: evaluation.clientsId,
          },
        });

        return clientUser.firstName + ' ' + clientUser.lastName;
      }
    } catch (error) {
      new CustomErrorLog(
        'BE > pallyManager.js > getClientName',
        error,
        idEvaluation,
      ).saveError();
    }

    return 'undefined';
  }
  /**
   * Main function to start the analisys
   * @param {Number} idEvaluation
   * @returns {Object}
   */
  this.excecAutomaticAnalyse = async function(idEvaluation) {
    await updateEvaluationStartDate(idEvaluation);

    try {
      const automaticEvaluatorPagesModel = app.models.AutomaticEvaluatorPages;
      let automaticPages = await automaticEvaluatorPagesModel.automaticPagesByEvaluation(
        idEvaluation,
      );
      await analysePages(automaticPages);
      const internetAvailadble = await checkInternetConnection();
      if (internetAvailadble) {
        await updateAutomaticEvaluationState(
          idEvaluation,
          eawConstants.EvaluationStates.FINISHED,
        );
      } else {
        await updateAutomaticEvaluationState(idEvaluation, -2);
        throw 'No Internet connection';
      }
      const clientName = await getClientName(idEvaluation);
      await notifyPromoterUsers(
        eawConstants.pallyNotificationPaths.SUCCESSFULL,
        clientName,
      );
      await updateEvaluationEndingDate(idEvaluation);
    } catch (error) {
      const internetAvailadble = await checkInternetConnection();
      if (internetAvailadble) {
        await updateAutomaticEvaluationState(
          idEvaluation,
          eawConstants.EvaluationStates.FAILED,
        );
      } else {
        await updateAutomaticEvaluationState(idEvaluation, -2);
      }
      await updateEvaluationEndingDate(idEvaluation);
      const clientName = await getClientName(idEvaluation);
      await notifyPromoterUsers(
        eawConstants.pallyNotificationPaths.FAIL,
        clientName,
      );
      new CustomErrorLog(
        'BE > pallyManager.js > excecAutomaticAnalyse',
        error,
        idEvaluation,
      ).saveError();

      return error;
    }
  };
};
