'use strict';
const fs = require('fs');

const app = require('./../../../../server/server');

const AdministratorPagesServices = require('../../../administrator/evaluations-manage/pages-services');
const ConsultantStatistics = require('../../../consultant/statistict/consultant-statistics');
const ConsultantResults = require('../../../consultant/results/consultant-results');
const DirectClientServices = require('../../../consultant/direct-client/direct-client-services');
const EvaluationsManager = require('../../../super-admin/evaluations-manage/evaluations-manage');
const EvaluationsService = require('../../../consultant/direct-client/evaluations/evaluations-service');
const PromoterEvaluationsManager = require('../../../administrator/evaluations-manage/evaluations-manage');
const Scrapingservice = require('../../../administrator/scrapping/scraping-service');
const SharedServices = require('../../../shared/shared-services/users-shared-services');
const ReportGenerator = require('../../../consultant/reports/reportGenerator');
const ReportNotificationsServices = require('../../../administrator/report-notifications/report-notifications');
const CustomErrorLog = require('../../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../../eaw-constants');
const JSZip = require('jszip');
const JSZipUtils = require('jszip-utils');
module.exports = function (Evaluations) {
  /**
   * Service to create evaluations
   */
  Evaluations.postEvaluation = async function (evaluationData) {
    const promoterEvaluationsManager = new PromoterEvaluationsManager();
    return await promoterEvaluationsManager.postEvaluation(evaluationData);
  };

  Evaluations.remoteMethod('postEvaluation', {
    description: 'Return an array with all evaluations created.',
    accepts: [{ arg: 'evaluationData', type: 'any', required: true }],
    http: { path: '/post-evaluation', verb: 'post' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get all evaluations
   */
  Evaluations.getAllEvaluations = async function (state, limit, skip) {
    const evaluationsManager = new EvaluationsManager();
    return await evaluationsManager.getAllEvaluations(state, limit, skip);
  };

  Evaluations.remoteMethod('getAllEvaluations', {
    description: 'Return an array with all Evaluations.',
    accepts: [
      { arg: 'state', type: 'number', required: false },
      { arg: 'limit', type: 'number', required: false },
      { arg: 'skip', type: 'number', required: false }
    ],
    http: { path: '/get-all-evaluations', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Get all the evaluations in all states, except the already complete finished and with errors.
   */
  Evaluations.getEvaluationsByYear = async function (year, state) {
    let results = { results: [] };
    try {
      let evaluations = await Evaluations.getAllEvaluations(state);
      evaluations.results.forEach(evaluation => {
        if (evaluation.createdAt.toLocaleString().includes(year)) {
          results.results.push(evaluation);
        }
      });
    } catch (error) {
      new CustomErrorLog('Evaluations > getEvaluationsByYear', error).saveError();
    }

    return await results;
  };

  Evaluations.remoteMethod('getEvaluationsByYear', {
    description: 'Return all evaluations filtered by year.',
    accepts: [
      { arg: 'year', type: 'string', required: true },
      { arg: 'state', type: 'number', required: false },
    ],
    http: { path: '/getEvaluationsByYear', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get evaluations by evaluator id and state
   */
  Evaluations.getEvaluationsByEvaluatorAndState = async function (evaluatorId, state) {
    const evaluationsManager = new EvaluationsManager();
    return await evaluationsManager.getEvaluationsByEvaluatorAndState(evaluatorId, state);
  };

  Evaluations.remoteMethod('getEvaluationsByEvaluatorAndState', {
    description: 'Return an array with all Evaluations.',
    accepts: [
      { arg: 'evaluatorId', type: 'number', required: true },
      { arg: 'state', type: 'number', required: true }
    ],
    http: { path: '/evaluations/state/evaluator/id', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });


  /**
  * Service to get all failed Evaluations
  */
  Evaluations.getAllFailedEvaluations = async function () {
    const evaluationsManager = new EvaluationsManager();
    return await evaluationsManager.getAllFailedEvaluations();
  };
  Evaluations.remoteMethod('getAllFailedEvaluations', {
    description: 'Return an array with all failed Evaluations.',
    accepts: [],
    http: { path: '/getAllFailedEvaluations', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * @param {number} idEvaluation
   * Change the state of the scraping to finished state
   * in database and update the finished date.
   */
  Evaluations.finishScrapingInCheckpoint = async function (idEvaluation) {
    const scrapingservice = new Scrapingservice();
    return scrapingservice.getFinishScrapingInCheckpoint(idEvaluation);
  };

  Evaluations.remoteMethod('finishScrapingInCheckpoint', {
    description: 'Set state of scraping in finished.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/finishScrapingInCheckpoint', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * @param {number} idEvaluation
   * Function to delete scraping data and start scraping proccess again.
   * This includes refresh the start date data.
   */
  Evaluations.resetScrapingInProgress = async function (idEvaluation) {
    const scrapingservice = new Scrapingservice();
    return scrapingservice.resetScrapingInProgress(idEvaluation);
  };

  Evaluations.remoteMethod('resetScrapingInProgress', {
    description: 'Delete sraping data by evaluation id, if scraping is in progress.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/resetScrapingInProgress', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * @param {number} idEvaluation
   * Function to start scraping process if the basic data of
   * an evaluation was already set.
   * The data is a new evaluation must include the fields:
   * url, idClients, idPackage
   */
  Evaluations.triggerScraping = async function (idEvaluation) {
    const scrapingservice = new Scrapingservice();
    return scrapingservice.triggerScraping(idEvaluation);
  };

  Evaluations.remoteMethod('triggerScraping', {
    description: 'Trigger the sraping by evaluation id.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/get-triggerScraping', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Function to get the map site from mysql. The json returned
   * include the json tree and scraping statistics data.
   */
  Evaluations.getEvaluationMapSite = async function (idEvaluation, cb) {
    return await Evaluations.findOne({
      where: { id: idEvaluation },
      fields: {
        siteMap: true,
        siteName: true,
        pagesChoosed: true,
        packagesId: true
      },
      include: [
        {
          relation: 'evaluationsPackages',
          scope: {
            fields: {
              name: true
            }
          }
        }
      ]
    });
  };
  Evaluations.remoteMethod('getEvaluationMapSite', {
    description: 'Returns an object with the site map.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/get-MapSite', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get all evaluations
   */
  Evaluations.statesByEvaluation = async function (idEvaluation) {
    const evaluationsManager = new EvaluationsManager();
    return await evaluationsManager.statesByEvaluation(idEvaluation);
  };

  Evaluations.remoteMethod('statesByEvaluation', {
    description: 'Return an object with a the states by evaluation.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/statesByEvaluation', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get years of evaluations
   */
  Evaluations.getEvaluationYears = async function () {
    const evaluationServices = new EvaluationsService();
    return await evaluationServices.getYearsOfEvaluations();
  };

  Evaluations.remoteMethod('getEvaluationYears', {
    description: 'Return an object with a list of years by evaluations.',
    accepts: [],
    http: { path: '/years', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get indirect clients of evaluations
   */
  Evaluations.getIndirectClientsByClient = async function (clientId, year, segmentId) {
    const evaluationServices = new EvaluationsService();
    return await evaluationServices.getIndirectClientsByClient(clientId, year, segmentId);
  };

  Evaluations.remoteMethod('getIndirectClientsByClient', {
    description: 'Return an object with a list of indirect clients by client.',
    accepts: [
      { arg: 'clientId', type: 'number', required: true },
      { arg: 'year', type: 'string', required: true },
      { arg: 'segmentId', type: 'number', required: true }
    ],
    http: { path: '/clients/id/indirect-client', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get indirect clients of evaluations
   */
  Evaluations.getEvaluationsByIndirectClient = async function (
    clientId,
    year,
    segmentId,
    indirectClient
  ) {
    const evaluationServices = new EvaluationsService();
    return await evaluationServices.getEvaluationsByIndirectClient(
      clientId,
      year,
      segmentId,
      indirectClient
    );
  };

  Evaluations.remoteMethod('getEvaluationsByIndirectClient', {
    description: 'Return an object with a list of evaluations by indirect client.',
    accepts: [
      { arg: 'clientId', type: 'number', required: true },
      { arg: 'year', type: 'string', required: true },
      { arg: 'segmentId', type: 'number', required: true },
      { arg: 'indirectClient', type: 'string', required: true }
    ],
    http: { path: '/clients/id/year/segment/id/indirect-client', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get an evalution by id
   */
  Evaluations.getEvaluationById = async function (evaluationId) {
    const evaluationServices = new EvaluationsService();
    return await evaluationServices.getEvaluationById(evaluationId);
  };

  Evaluations.remoteMethod('getEvaluationById', {
    description: 'Return an evaluation by Id',
    accepts: [{ arg: 'evaluationId', type: 'number', required: true }],
    http: { path: '/evaluation-id', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get pages by evalution id
   */
  Evaluations.getPagesByEvaluation = async function (evaluationId) {
    const evaluationServices = new EvaluationsService();
    return await evaluationServices.getPagesByEvaluation(evaluationId);
  };

  Evaluations.remoteMethod('getPagesByEvaluation', {
    description: 'Return a list of pages by evaluation',
    accepts: [{ arg: 'evaluationId', type: 'number', required: true }],
    http: { path: '/pages', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Obtain the las checkpoint and duration of the scraping by evaluation.
   */
  Evaluations.lastestCheckpoint = async function (idEvaluation) {
    const evaluationsManager = new PromoterEvaluationsManager();
    return await evaluationsManager.getLastedCheckpoint(idEvaluation);
  };

  Evaluations.remoteMethod('lastestCheckpoint', {
    description: 'Return an object with a lasted checkpoint, actual date and time between.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/lastestCheckpoint', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get a random list of pages from an object
   * inside a mapSite.
   */
  Evaluations.generateRandomPagesList = async function (idEvaluation) {
    const administratorPagesServices = new AdministratorPagesServices();
    return await administratorPagesServices.generateRandomPagesList(idEvaluation);
  };

  Evaluations.remoteMethod('generateRandomPagesList', {
    description: 'Return an object with a random selected pages.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/generateRandomPagesList', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Function to get the map site from mysql. The json returned
   * include the json tree and scraping statistics data.
   */
  Evaluations.getSelectedMapSite = async function (idEvaluation, cb) {
    return await Evaluations.findOne({
      where: { id: idEvaluation },
      fields: {
        selectedSiteMap: true
      }
    });
  };
  Evaluations.remoteMethod('getSelectedMapSite', {
    description: 'Returns an object with the site map.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/getSelectedMapSite', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Function to get all evaluations alongside with statistics
   * It returns void for now but a later implementation should return the file for download
   * @returns void
   */
  Evaluations.getEvaluationsStatistics = async function() {
    const evaluationsManager = new EvaluationsManager();
    return await evaluationsManager.getEvaluationsStatistics();
  };

  Evaluations.remoteMethod('getEvaluationsStatistics', {
    description: 'Return all evaluations including statistics',
    accepts: [{arg: 'filter', type: 'string', required: false}],
    http: {path: '/getEvaluationsStatistics', verb: 'get'},
    returns: {root: true, type: 'Object'}
  });

  /**
   * Function to start evaluation process and trigger pally evaluator.
   * Pages must be already saved in Pages Model.
   */
  Evaluations.startEvaluation = async function (idEvaluation, idPackage) {
    const evaluationsManager = new PromoterEvaluationsManager();
    return await evaluationsManager.startEvaluation(idEvaluation, idPackage);
  };
  Evaluations.remoteMethod('startEvaluation', {
    description: 'Save manual and automatic pages and start available evaluations',
    accepts: [
      { arg: 'idEvaluation', type: 'number', required: true },
      { arg: 'idPackage', type: 'number', required: true }
    ],
    http: { path: '/startEvaluation', verb: 'post' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Warning: To start an evaluation completly and only manual with the pages
   * assined manually. To avoid duplicity in normal start evaluation flow.
   * @param {*} idEvaluation
   */
  Evaluations.startDevelopManualEvaluation = async function (idEvaluation) {
    const evaluationsManager = new PromoterEvaluationsManager();
    return await evaluationsManager.startDevelopManualEvaluation(idEvaluation);
  };
  Evaluations.remoteMethod('startDevelopManualEvaluation', {
    description:
      'Warning: To start an evaluation completly and only manual with the pages assined manually.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/startDevelopManualEvaluation', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to parse the site map.
   */
  Evaluations.getParsedSiteMap = async function (idEvaluation) {
    const siteMap = await Evaluations.findOne({
      where: { id: idEvaluation },
      fields: {
        siteMap: true
      }
    });

    const newJSON = {
      nodes: [],
      links: []
    };

    let oldJSON = await JSON.parse(JSON.stringify(siteMap.siteMap));
    oldJSON = await JSON.parse(oldJSON);

    const flatSiteMap = await flatObject(oldJSON.data);

    await flatSiteMap.forEach(page => {
      newJSON.nodes.push({
        id: 'idNode' + page.id,
        label: page.topic,
        options: {
          url: page.Url,
          color: '#DEDEDE',
          textcolor: '#4B4B4B',
          isSelected: false
        }
      });

      if (page.parentid !== null) {
        newJSON.links.push({
          id: 'idEdge' + page.id,
          source: 'idNode' + page.parentid,
          target: 'idNode' + page.id
        });
      }
    });
    return await newJSON;
  };

  Evaluations.remoteMethod('getParsedSiteMap', {
    description: 'Return an object parsed with the format of ngx-graph.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/get-parsedSiteMap', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to create the zip file of site map
   */
  Evaluations.getFilesTree = function (idEvaluation, cb) {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip();

    let fileWithNamesName = '';
    let fileWithLinksName = '';

    const pathTree = './server/local-storage/Trees/';
    Evaluations.findOne({
      where: {
        id: idEvaluation
      }
    }).then(evaluation => {
      const path = `${pathTree}${evaluation.evaluationCode}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      fileWithNamesName = `${pathTree}${evaluation.evaluationCode}/${evaluation.evaluationCode}-nombres.txt`;
      const fileNames = fs.createWriteStream(fileWithNamesName);

      fileWithLinksName = `${pathTree}${evaluation.evaluationCode}/${evaluation.evaluationCode}-links.txt`;
      const fileLinks = fs.createWriteStream(fileWithLinksName);

      const siteMap = JSON.parse(evaluation.siteMap);
      writeFileTree(siteMap.data, 0, fileLinks, 0);
      writeStatistics(siteMap, fileLinks);

      fileLinks.end(x => {
        zip.addLocalFile(fileWithLinksName);
        writeFileTree(siteMap.data, 0, fileNames, 1);
        writeStatistics(siteMap, fileNames);
        fileNames.end(x => {
          zip.addLocalFile(fileWithNamesName);
          zip.writeZip(`${pathTree}${evaluation.evaluationCode}.zip`);
          cb(null, `${'containers/Trees/download/'}${evaluation.evaluationCode}.zip`);
        });
      });
    });
  };

  Evaluations.remoteMethod('getFilesTree', {
    description: 'Return a zip that contains files generated of the treemap by an evaluation.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/files-tree', verb: 'get' },
    returns: { root: true, type: 'any' }
  });

  /**
   * Service to get evaluations by evaluator id and state
   * @param {*} promoterId
   */
  Evaluations.getQuantityEvaluationByPromoter = async function (promoterId) {
    const promoterEvaluationsManager = new PromoterEvaluationsManager();
    return await promoterEvaluationsManager.getEvaluationsQuantityByPromoter(promoterId);
  };
  Evaluations.remoteMethod('getQuantityEvaluationByPromoter', {
    description: 'Return an array with the quantity of evaluations created by promoter.',
    accepts: [{ arg: 'promoterId', type: 'number', required: true }],
    http: { path: '/get-quantity-evaluation-by-promoter', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get evaluations by evaluator id and state
   * @param {*} promoterId
   */
  Evaluations.getEvaluationsQuantityByPromoterAndEvaluator = async function (
    promoterId,
    evaluatorId
  ) {
    const promoterEvaluationsManager = new PromoterEvaluationsManager();
    return await promoterEvaluationsManager.getEvaluationsQuantityByPromoterAndEvaluator(
      promoterId,
      evaluatorId
    );
  };
  Evaluations.remoteMethod('getEvaluationsQuantityByPromoterAndEvaluator', {
    description:
      'Return an array with the quantity of evaluations created by promoter and assign a specific evaluator.',
    accepts: [
      { arg: 'promoterId', type: 'number', required: true },
      { arg: 'evaluatorId', type: 'number', required: true }
    ],
    http: {
      path: '/get-quantity-evaluation-by-promoter-and-evaluator',
      verb: 'get'
    },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get evaluations by state and evaluator id
   */
  Evaluations.getEvaluationsByEvaluator = async function (
    manualEvaluationState,
    automaticEvaluationState,
    evaluatorId
  ) {
    const promoterEvaluationsManager = new PromoterEvaluationsManager();
    return await promoterEvaluationsManager.getEvaluationsByEvaluator(
      manualEvaluationState,
      automaticEvaluationState,
      evaluatorId
    );
  };
  Evaluations.remoteMethod('getEvaluationsByEvaluator', {
    description: 'Return an array with the all evaluations evaluated by a evaluator.',
    accepts: [
      { arg: 'manualEvaluationState', type: 'number', required: true },
      { arg: 'automaticEvaluationState', type: 'number', required: true },
      { arg: 'evaluatorId', type: 'number', required: true }
    ],
    http: { path: '/get-evaluations-by-evaluator', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });
  Evaluations.verifyCredentialsOfEvaluations = async function (url, code) {
    const sharedServices = new SharedServices();
    return await sharedServices.verifyCredentialsOfEvaluations(url, code);
  };
  Evaluations.remoteMethod('verifyCredentialsOfEvaluations', {
    description: 'Verify credentials by url and code',
    accepts: [
      { arg: 'url', type: 'string', required: true },
      { arg: 'code', type: 'string', required: true }
    ],
    http: { path: '/verify-credentials', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  Evaluations.getGeneralStatistics = async function (clients, segments, DateInitial, DateFinal) {
    const consultantStatistics = new ConsultantStatistics();
    return await consultantStatistics.getGeneralStatisticsByClientsAndSegments(
      clients,
      segments,
      DateInitial,
      DateFinal
    );
  };
  Evaluations.remoteMethod('getGeneralStatistics', {
    description: 'Gets clients and segments in a lapse of time to generate statistics',
    accepts: [
      { arg: 'clients', type: 'array', required: true },
      { arg: 'segments', type: 'array', required: true },
      { arg: 'DateInitial', type: 'any', required: true },
      { arg: 'DateFinal', type: 'any', required: true }
    ],
    http: { path: '/getGeneralStatistics', verb: 'post' },
    returns: { root: true, type: 'Object' }
  });

  /* BEGIN TEST */

  Evaluations.getGeneralStatisticsBySegmentAndYear = async function (
    clients,
    segments,
    DateInitial,
    DateFinal
  ) {
    const consultantStatistics = new ConsultantStatistics();
    return await consultantStatistics.getGeneralStatisticsBySegmentAndYear(
      clients,
      segments,
      DateInitial,
      DateFinal
    );
  };
  Evaluations.remoteMethod('getGeneralStatisticsBySegmentAndYear', {
    description: 'Gets evaluations by segments in a lapse of time to generate statistics',
    accepts: [
      { arg: 'clients', type: 'array', required: true },
      { arg: 'segments', type: 'array', required: true },
      { arg: 'DateInitial', type: 'any', required: true },
      { arg: 'DateFinal', type: 'any', required: true }
    ],
    http: { path: '/getGeneralStatisticsBySegmentAndYear', verb: 'post' },
    returns: { root: true, type: 'Object' }
  });

  /* END TEST */

  Evaluations.getStatisticsByGuideLineAutomatic = async function (
    evaluationId,
    conformityLevel,
    guidelines,
    pageList
  ) {
    const consultantStatistics = new ConsultantStatistics();
    return await consultantStatistics.getStatisticsByGuideLineAutomatic(
      evaluationId,
      conformityLevel,
      guidelines,
      pageList
    );
  };
  Evaluations.remoteMethod('getStatisticsByGuideLineAutomatic', {
    description: 'Calculate statistics by guideline for one evaluation.',
    accepts: [
      { arg: 'evaluationId', type: 'number', required: true },
      { arg: 'conformityLevel', type: 'string', required: false },
      { arg: 'guidelines', type: 'array', required: false },
      { arg: 'pageList', type: 'array', required: false }
    ],
    http: { path: '/getStatisticsByGuideLineAutomatic', verb: 'post' },
    returns: { root: true, type: 'Object' }
  });

  Evaluations.getStatisticsByGuideLineManual = async function (
    evaluationId,
    specificationId,
    conformityLevel,
    guidelines,
    pageList
  ) {
    const consultantStatistics = new ConsultantStatistics();
    return await consultantStatistics.getStatisticsByGuideLineManual(
      evaluationId,
      specificationId,
      conformityLevel,
      guidelines,
      pageList
    );
  };
  Evaluations.remoteMethod('getStatisticsByGuideLineManual', {
    description: 'Calculate statistics by guideline for one evaluation.',
    accepts: [
      { arg: 'evaluationId', type: 'number', required: true },
      { arg: 'specificationId', type: 'number', required: false },
      { arg: 'conformityLevel', type: 'string', required: false },
      { arg: 'guidelines', type: 'array', required: false },
      { arg: 'pageList', type: 'array', required: false }
    ],
    http: { path: '/getStatisticsByGuideLineManual', verb: 'post' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service get findings data from automatic evaluation
   * data filtered by rol and pageList grouped by criterion.
   */
  Evaluations.getFindingsByAutomaticPage = async function (
    evaluationId,
    guidelines,
    criterion,
    pageList,
    limit,
    skip
  ) {
    const consultantResults = new ConsultantResults();
    return await consultantResults.getFindingsByAutomaticPage(
      evaluationId,
      guidelines,
      criterion,
      pageList,
      limit,
      skip
    );
  };
  Evaluations.remoteMethod('getFindingsByAutomaticPage', {
    description:
      'Get findings data from automatic evaluation data filtered by rol and pageList grouped by criterion.',
    accepts: [
      { arg: 'evaluationId', type: 'number', required: true },
      { arg: 'guidelines', type: 'array', required: false },
      { arg: 'criterion', type: 'array', required: false },
      { arg: 'pageList', type: 'array', required: false },
      { arg: 'limit', type: 'number', required: false },
      { arg: 'skip', type: 'number', required: false }
    ],
    http: { path: '/getFindingsByAutomaticPage', verb: 'post' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service get manual answers data from manual evaluation filtered
   * by rol and pageList grouped by criterion.
   */
  Evaluations.getAnwersByManualPage = async function (
    evaluationId,
    disabiliyRolId,
    principleId,
    pageList
  ) {
    const consultantResults = new ConsultantResults();
    return await consultantResults.getAnwersByManualPage(
      evaluationId,
      disabiliyRolId,
      principleId,
      pageList
    );
  };
  Evaluations.remoteMethod('getAnwersByManualPage', {
    description:
      'Get manual answers data from manual evaluation filtered by rol and pageList grouped by criterion.',
    accepts: [
      { arg: 'evaluationId', type: 'number', required: true },
      { arg: 'disabiliyRolId', type: 'number', required: false },
      { arg: 'principleId', type: 'number', required: false },
      { arg: 'pageList', type: 'array', required: false }
    ],
    http: { path: '/getAnwersByManualPage', verb: 'post' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service get manual answers data from manual evaluation filtered
   * by rol and pageList grouped by criterion.
   */
  Evaluations.getObservationsByManualPage = async function (
    evaluationId,
    disabiliyRolId,
    principleId,
    pageList
  ) {
    const consultantResults = new ConsultantResults();
    return await consultantResults.getObservationsByManualPage(
      evaluationId,
      disabiliyRolId,
      principleId,
      pageList
    );
  };
  Evaluations.remoteMethod('getObservationsByManualPage', {
    description: 'Get observations filtered by rol and pageList grouped by criterion',
    accepts: [
      { arg: 'evaluationId', type: 'number', required: true },
      { arg: 'disabiliyRolId', type: 'number', required: false },
      { arg: 'principleId', type: 'number', required: false },
      { arg: 'pageList', type: 'array', required: false }
    ],
    http: { path: '/getObservationsByManualPage', verb: 'post' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Return a array with all site name of evaluations created
   */
  Evaluations.getAllSitesNames = async function () {
    const promoterEvaluationsManager = new PromoterEvaluationsManager();
    return await promoterEvaluationsManager.getAllSitesNames();
  };
  Evaluations.remoteMethod('getAllSitesNames', {
    description: 'Return a array with all site name of evaluations created',
    accepts: [],
    http: { path: '/get-all-sites-names', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });
  
  /**
   * Service to generate managerial and tecnical reports in range with Jasper.
   * @param minIdEvaluation this parameter is used to store the id at the 
   * start of the range of evaluations to generate reports.
   * @param maxIdEvaluation this parameter is used to store the id at the end
   * of the range of evalations to generate reports.
   */  
    Evaluations.generateReportEvaluationInIdRange = async function (minIdEvaluation, maxIdEvaluation) {
      const reportGenerator = await new ReportGenerator();
      return reportGenerator.generateReportEvaluationInIdRange(minIdEvaluation, maxIdEvaluation);
    };
    Evaluations.remoteMethod('generateReportEvaluationInIdRange', {
      description: 'Generate and save jasper reports in an id range.',
      accepts: [
        { arg: 'min', type: 'number', required: true },
        { arg: 'max', type: 'number', required: true }
      ],
      http: { path: '/generateReportEvaluationInIdRange', verb: 'get' },
      returns: { root: true, type: 'Object' }
    });

  /**
   * Service to generate managerial and tecnical reports with Jasper.
   */
  Evaluations.generateReport = async function (idEvaluation, evaluationCode) {
    const reportGenerator = await new ReportGenerator();
    return reportGenerator.generateReportSecurityFilter(idEvaluation, evaluationCode);
  };
  Evaluations.remoteMethod('generateReport', {
    description: 'Generate and save jasper reports.',
    accepts: [
      { arg: 'idEvaluation', type: 'number', required: true },
      { arg: 'evaluationCode', type: 'string', required: true }
    ],
    http: { path: '/generateReport', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to generate managerial and tecnical reports with Latex.
   */
  Evaluations.generateReportLatex = async function (idEvaluation, evaluationCode) {
    const reportGenerator = await new ReportGenerator();
    return reportGenerator.generateReportSecurityFilterWithLatex(idEvaluation, evaluationCode);
  };
  Evaluations.remoteMethod('generateReportLatex', {
    description: 'Generate and save latex reports.',
    accepts: [
      { arg: 'idEvaluation', type: 'number', required: true },
      { arg: 'evaluationCode', type: 'string', required: true }
    ],
    http: { path: '/generateReportLatex', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service to get all evaluations
   */
  Evaluations.getAllSitesStateByEvaluationsAndEvaluator = async function (
    evaluationId,
    evaluatorId
  ) {
    const promoterEvaluationsManager = new PromoterEvaluationsManager();
    return await promoterEvaluationsManager.getAllSitesStateByEvaluationsAndEvaluator(
      evaluationId,
      evaluatorId
    );
  };

  Evaluations.remoteMethod('getAllSitesStateByEvaluationsAndEvaluator', {
    description: 'Return an array pages evaluated.',
    accepts: [
      { arg: 'evaluationId', type: 'number', required: true },
      { arg: 'evaluatorId', type: 'number', required: true }
    ],
    http: { path: '/get-all-sites-state-by-evaluation-evaluator', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service used by an OTAI user to send the access to results to the
   * client that request the evaluation.
   */
  Evaluations.sendReportAcessOtaiToClient = async function (evaluationId) {
    const reportNotificationsServices = new ReportNotificationsServices();
    return await reportNotificationsServices.sendReportAcessOtaiToClient(evaluationId);
  };
  Evaluations.remoteMethod('sendReportAcessOtaiToClient', {
    description: 'send the access to results to the client that request the evaluation.',
    accepts: [{ arg: 'evaluationId', type: 'number', required: true }],
    http: { path: '/sendReportAcessOtaiToClient', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Service used by a direct client to send an email to request a new
   * evaluation.
   */
  Evaluations.requestEvaluationToOtai = async function (clientId, message) {
    const directClientServices = new DirectClientServices();
    return await directClientServices.requestEvaluationToOtai(clientId, message);
  };
  Evaluations.remoteMethod('requestEvaluationToOtai', {
    description: 'send the access to results to the client that request the evaluation.',
    accepts: [
      { arg: 'clientId', type: 'number', required: true },
      { arg: 'message', type: 'string', required: false }
    ],
    http: { path: '/requestEvaluationToOtai', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  // #################################################
  // ############# CLUSTER BEGIN #####################

  /**
   * Get all the evaluations in all states, except the already complete finished and with errors.
   */
  Evaluations.getEvaluationsPendingAndProcess = async function () {
    let returnObj = { results: [], count: null, message: [] };
    try {
      let evaluation = await Evaluations.find({
        where: {
          and: [
            { packagesId: 1 },
            {
              or: [
                {
                  technicalReportState: {
                    nin: [2]
                  }
                },
                {
                  managerialReportState: {
                    nin: [2]
                  }
                }
              ]
            },
            {
              scrapingState: {
                nin: [-1]
              }
            },
            {
              automaticEvaluationState: {
                nin: [-1]
              }
            }
          ]
        },
        fields: {
          siteMap: false,
          selectedSiteMap: false
        }
      });
      returnObj.results = evaluation;
      returnObj.count = evaluation.length;
    } catch (error) {
      returnObj.count = -1;
      new CustomErrorLog('Evaluations > getEvaluationsPendingAndProcess', error).saveError();
    }

    return await returnObj;
  };

  Evaluations.remoteMethod('getEvaluationsPendingAndProcess', {
    description: 'Return all evaluations with state pending or process with reports included.',
    accepts: [],
    http: { path: '/getEvaluationsPendingAndProcess', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Get all the evaluations that states are pending or process, without the evaluations that only have pending reports.
   */
  Evaluations.getEvaluationsPendingAndProcessWithoutReports = async function () {
    let returnObj = { results: [], count: null, message: [] };
    try {
      let evaluation = await Evaluations.find({
        where: {
          and: [
            { packagesId: 1 },
            {
              or: [
                {
                  scrapingState: {
                    nin: [2]
                  }
                },
                {
                  automaticEvaluationState: {
                    nin: [2]
                  }
                }
              ]
            },
            {
              scrapingState: {
                nin: [-1]
              }
            },
            {
              automaticEvaluationState: {
                nin: [-1]
              }
            }
          ]
        },
        fields: {
          siteMap: false,
          selectedSiteMap: false
        }
      });
      returnObj.results = evaluation;
      returnObj.count = evaluation.length;
    } catch (error) {
      returnObj.count = -1;
      new CustomErrorLog(
        'Evaluations > getEvaluationsPendingAndProcessWithoutReports',
        error
      ).saveError();
    }

    return await returnObj;
  };

  Evaluations.remoteMethod('getEvaluationsPendingAndProcessWithoutReports', {
    description: 'Return all evaluations with state pending or process.',
    accepts: [],
    http: { path: '/getEvaluationsPendingAndProcessWithoutReports', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   * Get all the evaluations that they only have the report pending.
   */
  Evaluations.getEvaluationsPendingReport = async function () {
    let returnObj = { results: [], count: null, message: [] };
    try {
      let evaluation = await Evaluations.find({
        where: {
          and: [
            { packagesId: 1 },
            {
              or: [
                {
                  technicalReportState: 0
                },
                {
                  managerialReportState: 0
                }
              ]
            },
            {
              scrapingState: {
                nin: [-1]
              }
            },
            {
              automaticEvaluationState: {
                nin: [-1]
              }
            },
            {
              scrapingState: 2
            },
            {
              automaticEvaluationState: 2
            }
          ]
        },
        fields: {
          siteMap: false,
          selectedSiteMap: false
        }
      });
      returnObj.results = evaluation;
      returnObj.count = evaluation.length;
    } catch (error) {
      returnObj.count = -1;
      new CustomErrorLog('Evaluations > getEvaluationsPendingReport', error).saveError();
    }

    return await returnObj;
  };

  Evaluations.remoteMethod('getEvaluationsPendingReport', {
    description: 'Return all evaluations with state report pending.',
    accepts: [],
    http: { path: '/getEvaluationsPendingReport', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  /**
   *
   * @param {number} idEvaluation
   */
  Evaluations.deleteAutomaticEvaluationInProgress = async function (idEvaluation) {
    let _this = this;
    _this.returnObj = { results: {}, count: null, message: [] };
    try {
      let automaticPages = await app.models.AutomaticEvaluatorPages.automaticPagesByEvaluation(
        idEvaluation
      );
      let automaticPageIds = [];
      for (let automaticPage of automaticPages) {
        automaticPageIds.push(automaticPage.id);
      }

      try {
        await app.models.Findings.destroyAll({
          automaticEvaluatorPagesId: { inq: automaticPageIds }
        });
      } catch (error) {
        /* Expected error */
      }
      try {
        await app.models.AutomaticEvaluatorPages.destroyAll({
          id: { inq: automaticPageIds }
        });
      } catch (error) {
        /* Expected error */
      }
      try {
        await app.models.Pages.destroyAll({ evaluationsId: idEvaluation });
      } catch (error) {
        /* Expected error*/
      }

      let newDate = await new Date();
      await app.models.DatesByEvaluations.update(
        { evaluationsId: idEvaluation },
        {
          automaticStartDateAt: newDate,
          automaticFinishedDateAt: null
        }
      );

      await app.models.Evaluations.update(
        { id: idEvaluation },
        {
          automaticEvaluationState: 0,
          pagesChoosed: 0
        }
      );

      _this.returnObj.message.push('deleting progress');
    } catch (error) {
      _this.returnObj.count = -1;
    }

    return await _this.returnObj;
  };
  Evaluations.remoteMethod('deleteAutomaticEvaluationInProgress', {
    description:
      'Delete selected pages, save pages again and reset automatic evaluation to PENDING state.',
    accepts: [{ arg: 'idEvaluation', type: 'number', required: true }],
    http: { path: '/deleteAutomaticEvaluationInProgress', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });

  // ############# CLUSTER END #####################
  // ###############################################

  /**
   * Service to update only manual evaluation state
   * @param {*} idEvaluation
   * @param {*} state
   */
  Evaluations.changeManualEvaluationState = async function (idEvaluation, state) {
    const eAWConstants = new EAWConstants();
    if (state == undefined) {
      state = eAWConstants.EvaluationStates.PROGRESS;
    }
    return Evaluations.update({ id: idEvaluation }, { manualEvaluationState: state });
  };
  Evaluations.remoteMethod('changeManualEvaluationState', {
    description: 'Change manual evaluation state',
    accepts: [
      { arg: 'idEvaluation', type: 'number', required: true },
      { arg: 'state', type: 'number', required: false }
    ],
    http: { path: '/changeManualEvaluationState', verb: 'get' },
    returns: { root: true, type: 'Object' }
  });
};


function flatObject(obj) {
  try {
    let flatten = (children, extractChildren, level, parentid) =>
      Array.prototype.concat.apply(
        children.map(x => ({
          ...x,
          level: level || 1,
          parentid: parentid || null
        })),
        children.map(x =>
          flatten(extractChildren(x) || [], extractChildren, (level || 1) + 1, x.id)
        )
      );
    let extractChildren = x => x.children;
    let flat = flatten(extractChildren(obj), extractChildren).map(x => delete x.children && x);
    return flat;
  } catch (error) {
    return error;
  }
}

function writeFileTree(tree, index, logger, isTopic) {
  const tab = '\t';

  let dataToFile;
  if (isTopic) {
    dataToFile = tree.topic;
  } else {
    dataToFile = tree.Url || tree.topic;
  }
  const line = tab.repeat(index) + dataToFile + '\n';
  logger.write(line);

  if (!tree.children) {
    index = index - 1;
    return;
  }
  if (tree.children.length > 0) {
    index += index + 1;
  }
  for (const child of tree.children) {
    writeFileTree(child, index, logger, isTopic);
  }
}

function writeStatistics(tree, logger) {
  logger.write('\n\nInformación General' + '\n');
  logger.write(`Dominio: ${tree.domain}\n`);
  logger.write(`Páginas encontradas: ${tree.scrapedPagesCounter}\n`);
  logger.write(`Enlaces rotos: ${tree.brokenLinksCounter}\n`);
  logger.write(`Rutas absolutas: ${tree.absoluteLinksCounter}\n`);
  logger.write(`Rutas relativas: ${tree.relativeLinksCounter}\n`);
  logger.write(`Excepciones: ${tree.linkExceptionsCounter}\n`);
  logger.write(`Abandonos: ${tree.desertedLinksCounter}\n`);
  logger.write(`Nivel de profundidad: ${tree.treeDepthCounter}\n`);
}
