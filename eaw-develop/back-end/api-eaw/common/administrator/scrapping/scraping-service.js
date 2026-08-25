'use strict';

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');
const MongoManager = require('./WebScrapingMongoManager.js');
const WebScrapping = require('./WebScraping.js');

const app = require('../../../server/server');
const URL = require('url');

/**
 * Scraping services functions */
module.exports = function ScrapingService() {
  const _EAWConstants = new EAWConstants();

  /**
   * @param {number} id
   * Change the state of the scraping to finished state
   * in database and update the finished date.
   */
  this.getFinishScrapingInCheckpoint = async function(id) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      await app.models.Evaluations.update(
        {id: id},
        {scrapingState: _EAWConstants.ScrapingStates.FINISHED},
      );
      let endingDate = await new Date();
      await app.models.DatesByEvaluations.update(
        {evaluationsId: id},
        {scrapingFinishedDateAt: endingDate},
      );
      returnObj.results = 'Updated.';

      return returnObj;
    } catch (error) {
      new CustomErrorLog(
        'BE > scraping-service.js > getFinishScrapingInCheckpoint(id)',
        error,
      ).saveError();
      returnObj.message.push('Error while finish scraping in checkpoint.');

      return returnObj;
    }
  };

  /**
   * @param {number} idEvaluation
   * Function to delete scraping data and start scraping proccess
   * again.
   * This includes refresh the start date data.
   */
  this.resetScrapingInProgress = async function(idEvaluation) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      let evaluation = await app.models.Evaluations.findOne({
        where: {
          id: idEvaluation,
        },
      });
      if (evaluation !== null) {
        const mongoManager = await new MongoManager(idEvaluation);
        await mongoManager.deleteScrapingAbsoluteLinks();
        await mongoManager.deleteScrapingBrokenLinks();
        await mongoManager.deleteScrapingDesertedLinks();
        await mongoManager.deleteScrapingExceptionLinks();
        await mongoManager.deleteScrapingFileLinks();
        await mongoManager.deleteScrapingRelativeLinks();
        await mongoManager.deleteScrapingSiteMapUrls();
        await mongoManager.deleteScrapingErrorLogs();
        await mongoManager.deleteScrapingSiteMap();
        await app.models.Evaluations.update(
          {id: idEvaluation},
          {
            siteMap: null,
            scrapingState: _EAWConstants.ScrapingStates.PROGRESS,
            pagesChoosed: _EAWConstants.PagesChoosedStates.NON_SELECTED,
          },
        );
        var now = new Date().getTime();
        while (new Date().getTime() < now + 4000) {
          /* do nothing */
        }

        const url = evaluation.mainUrl;
        const idClients = evaluation.clientsId;
        const idPackage = evaluation.packagesId;
        const scrapDynamicPage = true;
        const parsedURL = await URL.parse(url);
        const webPageProtocole = (await parsedURL.protocol) + '//';
        const webURLHasHashRedirection = parsedURL.hash != null;
        const webPathWithoutQuery = parsedURL.pathname;
        let webPageDomain = parsedURL.hostname;
        if (webURLHasHashRedirection) {
          webPageDomain = webPageDomain + webPathWithoutQuery;
        }
        const clientUser = await app.models.Users.findOne({
          where: {
            id: idClients,
          },
        });
        const clientName = clientUser.firstName + ' ' + clientUser.lastName;

        await setScrapingStartDate(idEvaluation);
        asyncScraping(
          idEvaluation,
          webURLHasHashRedirection,
          scrapDynamicPage,
          webPageDomain,
          webPageProtocole,
          url,
          _EAWConstants.ScrapingInitVariables.CRAWLED_LIST,
          _EAWConstants.ScrapingInitVariables.INBOUND_LINK_LIST,
          _EAWConstants.ScrapingInitVariables.INCREMENTAL_ID,
          _EAWConstants.ScrapingInitVariables.SCRAPED_PAGES_COUNTER,
          _EAWConstants.ScrapingInitVariables.ACTUAL_CHECKPOINT,
          _EAWConstants.ScrapingInitVariables.CHECKPOINT_RATE,
          _EAWConstants.ScrapingInitVariables.SXRAPING_EXIT,
          idClients,
          idPackage,
          clientName,
        );
      }
      returnObj.message = 'Scraping in process again.';

      return returnObj;
    } catch (error) {
      returnObj.message.push('Error on delete progress.');
      new CustomErrorLog(
        'BE > scraping-service.js > deleteScrapingInProgress > idEvaluation' +
          idEvaluation,
        error,
      ).saveError();

      app.models.Evaluations.update(
        {id: idEvaluation},
        {scrapingState: _EAWConstants.ScrapingStates.FAILED},
      );

      return returnObj;
    }
  };

  /**
   * @param {number} idEvaluation
   * Function to start scraping process if the basic data of
   * an evaluation was already set.
   * The data is a new evaluation that include the fields:
   * url, idClients, idPackage
   */
  this.triggerScraping = async function(idEvaluation) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      let evaluation = await app.models.Evaluations.findOne({
        where: {
          id: idEvaluation,
        },
      });
      if (evaluation != null) {
        const url = evaluation.mainUrl;
        const idClients = evaluation.clientsId;
        const idPackage = evaluation.packagesId;
        const scrapDynamicPage = true;
        const parsedURL = await URL.parse(url);
        const webPageProtocole = (await parsedURL.protocol) + '//';
        const webURLHasHashRedirection = parsedURL.hash != null;
        const webPathWithoutQuery = parsedURL.pathname;
        let webPageDomain = parsedURL.hostname;
        if (webURLHasHashRedirection) {
          webPageDomain = webPageDomain + webPathWithoutQuery;
        }
        await app.models.Evaluations.update(
          {id: idEvaluation},
          {
            scrapingState: _EAWConstants.ScrapingStates.PROGRESS,
            domain: webPageDomain,
          },
        );
        const clientUser = await app.models.Users.findOne({
          where: {
            id: idClients,
          },
        });
        const clientName = clientUser.firstName + ' ' + clientUser.lastName;

        await setScrapingStartDate(idEvaluation);
        asyncScraping(
          idEvaluation,
          webURLHasHashRedirection,
          scrapDynamicPage,
          webPageDomain,
          webPageProtocole,
          url,
          _EAWConstants.ScrapingInitVariables.CRAWLED_LIST,
          _EAWConstants.ScrapingInitVariables.INBOUND_LINK_LIST,
          _EAWConstants.ScrapingInitVariables.INCREMENTAL_ID,
          _EAWConstants.ScrapingInitVariables.SCRAPED_PAGES_COUNTER,
          _EAWConstants.ScrapingInitVariables.ACTUAL_CHECKPOINT,
          _EAWConstants.ScrapingInitVariables.CHECKPOINT_RATE,
          _EAWConstants.ScrapingInitVariables.SXRAPING_EXIT,
          idClients,
          idPackage,
          clientName,
        );
        returnObj.message = 'Scraping in process.';
      } else {
        throw new Error('Error: Evaluation does not exist.');
      }
    } catch (error) {
      new CustomErrorLog(
        'BE > scraping-service.js > triggerScraping > idEvaluation' +
          idEvaluation,
        error,
      ).saveError();
      app.models.Evaluations.update(
        {id: idEvaluation},
        {scrapingState: _EAWConstants.ScrapingStates.FAILED},
      );

      return error;
    }

    return returnObj;
  };
};

/**
 * Function to instance WebScraping class
 * and excecute the main function (scrap).
 * If the scrapping stop by the user action,
 * generates an excepted error.
 * @param {number} idEvaluationParam
 * @param {number} webURLHasHashRedirectionParam
 * @param {Boolean} scrapDynamicPageParam
 * @param {string} webPageDomainParam
 * @param {string} webPageProtocoleParam
 * @param {string} firstLinkParam
 * @param {Array} crawledParam
 * @param {Array} inboundLinksParam
 * @param {number} incrementalIdParam
 * @param {number} scrapedPagesCounterParam
 * @param {number} actualCheckpointParam
 * @param {number} checkpointParam
 * @param {boolean} scrapingExitParam
 * @param {number} idClients
 * @param {number} idPackage
 * @param {string} clientName
 * @param {number} scrapedPagesLimit
 */
async function asyncScraping(
  idEvaluationParam,
  webURLHasHashRedirectionParam,
  scrapDynamicPageParam,
  webPageDomainParam,
  webPageProtocoleParam,
  firstLinkParam,
  crawledParam,
  inboundLinksParam,
  incrementalIdParam,
  scrapedPagesCounterParam,
  actualCheckpointParam,
  checkpointParam,
  scrapingExitParam,
  idClients,
  idPackage,
  clientName,
  scrapedPagesLimit = 1000,
) {
  try {
    const mongoManager = await new MongoManager(idEvaluationParam);
    const webScrapping = await new WebScrapping(
      idEvaluationParam,
      webURLHasHashRedirectionParam,
      scrapDynamicPageParam,
      webPageDomainParam,
      webPageProtocoleParam,
      firstLinkParam,
      crawledParam,
      inboundLinksParam,
      incrementalIdParam,
      scrapedPagesCounterParam,
      actualCheckpointParam,
      checkpointParam,
      scrapingExitParam,
      mongoManager,
      scrapedPagesLimit,
    );
    await webScrapping.scrap(idClients, idPackage, clientName);
    mongoManager = null;

    return 1;
  } catch (error) {
    // Do nothing
  }

  return 0;
}

/**
 * Function to set initial evaluation date
 * @param {number} idEvaluation
 */
async function setScrapingStartDate(idEvaluation) {
  let startScrapingDate = await new Date();
  let currentDate = await app.models.DatesByEvaluations.findOne({
    where: {
      evaluationsId: idEvaluation,
    },
  });
  try {
    let result = {};
    if (currentDate == null) {
      await app.models.DatesByEvaluations.create({
        evaluationsId: idEvaluation,
        scrapingStartDateAt: startScrapingDate,
      });
    } else {
      await app.models.DatesByEvaluations.update(
        {evaluationsId: idEvaluation},
        {scrapingStartDateAt: startScrapingDate},
      );
    }

    return result;
  } catch (error) {
    new CustomErrorLog(
      'BE > scraping-service.js > setScrapingStartDate > idEvaluation: ' +
        idEvaluation,
      error,
    ).saveError();

    return error;
  }
}
