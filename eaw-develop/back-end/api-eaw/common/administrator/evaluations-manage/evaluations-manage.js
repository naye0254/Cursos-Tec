'use strict';

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');
const AutomaticPagesServices = require('./automatic-pages-services');
const PallyEvaluation = require('../pally-evaluation/pallyEvaluation');
const ManualPagesServices = require('./manual-pages-services');
const https = require('http');

const app = require('../../../server/server');
const md5 = require('md5');
const _ = require('lodash');
/**
 * Manage evaluations model services logic.
 */
function PromoterEvaluationsManager() {
  const eawConstants = new EAWConstants();
  const evaluationsModel = app.models.Evaluations;

  /**
   * This function create a evaluation with specification included
   */
  this.postEvaluation = async function(evaluationData) {
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    try {
      let newEvaluation = {};
      let hasMoreThanTwo = false;
      const evaluationsCreated = [];
      if (evaluationData.sitesToEvaluate.length > 2) {
        hasMoreThanTwo = true;
      }

      for (let siteToCreate of evaluationData.sitesToEvaluate) {
        newEvaluation = await evaluationsModel.create(
          await createEvaluationObj(
            evaluationData.generalInformation,
            siteToCreate,
          ),
        );
        evaluationsCreated.push(newEvaluation);
        if (evaluationData.specifications) {
          for (let specification of evaluationData.specifications) {
            await registerSpecification(newEvaluation.id, specification);
          }
        }
        await app.models.DatesByEvaluations.create({
          evaluationsId: newEvaluation.id,
          expirationDate: evaluationData.generalInformation.expirationDate,
        });

        if (
          !(hasMoreThanTwo && evaluationData.generalInformation.packageId === 1)
        ) {
          /**
           * TODO: Make a better implentation later, 'dontStartScraping' is only
           * use when manual evaluation needs to add selected pages manualy.
           */
          if (
            !(
              evaluationData.generalInformation.packageId === 3 &&
              evaluationData.generalInformation.dontStartScraping === true
            )
          ) {
            await evaluationsModel.triggerScraping(newEvaluation.id);
          }
        }
        _this.returnObj.results.push(newEvaluation);
      }

      if (hasMoreThanTwo && evaluationData.generalInformation.packageId === 1) {
        const activeNodes = await this.getAllActivesNodes();
        if (activeNodes.length === 0) {
          await assignAllToMasterNode(evaluationsCreated);
        } else {
          await splitEvaluations(activeNodes, evaluationsCreated);
          startNodes(activeNodes);
        }
      }
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
  };

  /**
   * Function to build a evaluation for registered it
   * @param {*} generalInformation
   * @param {*} siteToCreateInfo
   */
  async function createEvaluationObj(generalInformation, siteToCreateInfo) {
    const randomSeed = await Math.random().toString(35);
    const clientLanguageId = await app.models.Users.find({
      where: {id: generalInformation.clientId},
      fields: {
        id: true,
        languagesId: true,
      },
    });
    return {
      id: 0,
      clientsId: generalInformation.clientId,
      createdAt: new Date(),
      createdBy: generalInformation.createdBy,
      domain: siteToCreateInfo.link,
      evaluationCode: 'OTAI' + (await md5(randomSeed)),
      languagesId: clientLanguageId[0].languagesId,
      tagId: siteToCreateInfo.tagId,
      mainUrl: siteToCreateInfo.link,
      managerialReportState: eawConstants.EvaluationStates.PENDING,
      manualEvaluationState:
        generalInformation.packageId ===
          eawConstants.packagesTypes.AUTOMATIC_RANDOM ||
        generalInformation.packageId ===
          eawConstants.packagesTypes.AUTOMATIC_SPECIFIC
          ? null
          : eawConstants.EvaluationStates.PENDING,
      automaticEvaluationState:
        generalInformation.packageId ===
          eawConstants.packagesTypes.AUTOMATIC_RANDOM ||
        generalInformation.packageId ===
          eawConstants.packagesTypes.AUTOMATIC_SPECIFIC
          ? eawConstants.EvaluationStates.PENDING
          : null,
      nodeId: null,
      packagesId: generalInformation.packageId,
      pagesChoosed: false,
      scrapingState: 0,
      segmentsId: siteToCreateInfo.segmentId,
      siteMap: null,
      siteName: siteToCreateInfo.name,
      technicalReportState: eawConstants.EvaluationStates.PENDING,
      updatedAt: null,
      updatedBy: generalInformation.createdBy,
    };
  }

  /**
   * Funtion to register a specification of a evaluation
   * @param {*} evaluationsId
   * @param {*} specificationInformation
   */
  async function registerSpecification(
    evaluationsId,
    specificationInformation,
  ) {
    return await app.models.Specifications.create({
      id: 0,
      browsersId: specificationInformation.browsersId,
      devicesId: specificationInformation.devicesId,
      evaluationsId: evaluationsId,
      operativeSystemsId: specificationInformation.operativeSystemsId,
      supportToolsId: specificationInformation.supportToolsId,
      disabilitiesId: specificationInformation.disabilitiesId,
      usersId: specificationInformation.usersId,
      state: eawConstants.EvaluationStates.PENDING,
    });
  }

  /**
   * Function to get all users by disability .
   */
  this.getAllEvaluatorByDisability = async function(disabilityId) {
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    let filterEvaluators = {
      where: {
        disabilitiesId: disabilityId,
      },
      include: [
        {
          relation: 'disabilitiesByUsersUsers',
        },
      ],
    };
    try {
      const listEvaluator = await app.models.DisabilitiesByUsers.find(
        filterEvaluators,
      );
      listEvaluator.map(evaluator => {
        _this.returnObj.results.push(
          evaluator.toJSON().disabilitiesByUsersUsers,
        );
      });
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to get all segments by clients .
   */
  this.getAllSegmentsByClients = async function(clientId) {
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    let filterSegments = {
      where: {
        clientsId: clientId,
      },
      include: [
        {
          relation: 'clientsBySegmentsSegments',
        },
      ],
    };
    try {
      const listSegments = await app.models.ClientsBySegments.find(
        filterSegments,
      );
      listSegments.map(evaluator => {
        _this.returnObj.results.push(
          evaluator.toJSON().clientsBySegmentsSegments,
        );
      });
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to get all states from an evaluation
   * @param {number} idEvaluation
   */
  this.getStatesByEvaluation = async function(idEvaluation, cb) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      let evaluation = await evaluationsModel.findOne({
        where: {
          id: idEvaluation,
        },
        fields: {
          evaluationCode: true,
          scrapingState: true,
          automaticEvaluationState: true,
          pagesChoosed: true,
          managerialReportState: true,
          technicalReportState: true,
        },
      });
      evaluation = await JSON.parse(JSON.stringify(evaluation));
      returnObj.results = evaluation;
    } catch (error) {
      returnObj.count = -1;
      throw handleError(returnObj, error);
    }

    return await returnObj;
  };

  /**
   * Function to convert miliseconds (datetime) in a
   * understandable format with hours, minutes and seconds.
   * @param {number} milliseconds
   */
  async function parseMillisecondsIntoReadableTime(milliseconds) {
    const hours = milliseconds / (1000 * 60 * 60);
    const absoluteHours = Math.floor(hours);
    const h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

    const minutes = (hours - absoluteHours) * 60;
    const absoluteMinutes = Math.floor(minutes);
    const m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

    const seconds = (minutes - absoluteMinutes) * 60;
    const absoluteSeconds = Math.floor(seconds);
    const s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

    const timeObj = {
      hours: h,
      minutes: m,
      seconds: s,
    };

    return timeObj;
  }

  /**
   * Obtain the las checkpoint and duration of the scraping
   * by evaluation.
   */
  this.getLastedCheckpoint = async function(idEvaluation, cb) {
    const returnObj = {results: {}, count: null, message: []};

    try {
      const evaluation = await evaluationsModel.findOne({
        where: {
          id: idEvaluation,
        },
      });
      const siteMap = await JSON.parse(evaluation.siteMap);
      const actualDate = await new Date();
      let checkpointDate = actualDate;
      let checkpointPage = 0;
      if (siteMap != null && siteMap.actualCheckpointDate != undefined) {
        checkpointDate = await new Date(siteMap.actualCheckpointDate);
        checkpointPage = siteMap.actualCheckpoint;
      }
      const elapsed = actualDate.getTime() - checkpointDate.getTime();
      const elapsedFormat = await parseMillisecondsIntoReadableTime(elapsed);

      returnObj.results = {
        checkpointDate: checkpointDate,
        actualDate: actualDate,
        checkpoint: checkpointPage,
        elapsedTime: elapsedFormat,
      };
    } catch (error) {
      throw handleError(returnObj, error);
    }

    return await returnObj;
  };

  /**
   * Function to start evaluation
   */
  this.startEvaluation = async function(idEvaluation, idPackage) {
    const returnObj = {results: {}, count: null, message: []};
    const automaticPagesServices = new AutomaticPagesServices();
    const manualPagesServices = new ManualPagesServices();
    try {
      const rulesName = await obtainRulesByPackage(idPackage);
      let evaluationUpdateData = {};
      if (eawConstants.RulesConstants.RULE_MANUAL_EVAL in rulesName[0]) {
        await manualPagesServices.assignManualPages(idEvaluation);
        evaluationUpdateData['manualEvaluationState'] =
          eawConstants.EvaluationStates.PROGRESS;
        await setManualEvaluationStartDate(idEvaluation);
      }
      if (eawConstants.RulesConstants.RULE_AUTMATIC_EVAL in rulesName[0]) {
        await automaticPagesServices.assignAutomaticPages(idEvaluation);
        evaluationUpdateData['automaticEvaluationState'] =
          eawConstants.EvaluationStates.PROGRESS;
        await triggerPallyEvaluator(idEvaluation);
      }
      evaluationsModel.update({id: idEvaluation}, evaluationUpdateData);
      return (returnObj.message = ['Evaluation in progress']);
    } catch (error) {
      new CustomErrorLog(
        'evaluations-manage > startEvaluation > idPackage: ' + idPackage,
        error,
        idEvaluation,
      ).saveError();
      return error;
    }
  };

  /**
   * Warning: To start an evaluation completly and only manual with the pages
   * assined manually. To avoid duplicity in normal start evaluation flow.
   * @param {*} idEvaluation
   */
  this.startDevelopManualEvaluation = async function(idEvaluation) {
    try {
      await setManualEvaluationStartDate(idEvaluation);
      evaluationsModel.update(
        {id: idEvaluation},
        {manualEvaluationState: eawConstants.EvaluationStates.PROGRESS}
      );
      return "Starting manual evaluation";
    } catch (error) {
      new CustomErrorLog(
        'evaluations-manage > startDevelopManualEvaluation',
        error,
        idEvaluation,
      ).saveError();
      return error;
    }
  }

  /**
   * Function to trigger pally automatic evaluator
   * @param {*} idEvaluation
   */
  async function triggerPallyEvaluator(idEvaluation) {
    try {
      const automaticDescriptionModel = app.models.AutomaticDescriptions;
      const mapCodeXIdAutomaticDescriptions = await automaticDescriptionModel.generateMapCodeXId();
      const pallyEvaluation = new PallyEvaluation(
        mapCodeXIdAutomaticDescriptions,
      );
      pallyEvaluation.excecAutomaticAnalyse(idEvaluation);
    } catch (error) {
      new CustomErrorLog(
        'evaluations-manage > triggerAutomaticEvaluator',
        error,
        idEvaluation,
      ).saveError();
    }
  }

  /**
   * Function to obtain an array with
   * package name and rules of that package.
   * @param {number} idPackage
   */
  async function obtainRulesByPackage(idPackage) {
    const rulesByPackage = await app.models.RulesPackages.find({
      where: {packagesId: idPackage},
      include: [
        {
          relation: 'rulesPackagesRules',
          scope: {
            fields: {
              ruleName: true,
            },
          },
        },
        {relation: 'rulesPackagesPackages'},
      ],
    });
    const newObjectRules = JSON.parse(JSON.stringify(rulesByPackage));
    const result = [];
    const rulesName = {};
    let packageName = '';
    newObjectRules.forEach(element => {
      const rName = element.rulesPackagesRules.ruleName;
      packageName = element.rulesPackagesPackages.name;
      rulesName[rName] = rName;
    });
    result.push(rulesName);
    result.push(packageName);

    return await result;
  }

  /**
   * Function to save the start date of a manual
   * evaluation.
   * @param {number} idEvaluation
   */
  async function setManualEvaluationStartDate(idEvaluation) {
    try {
      const startDate = await new Date();
      await app.models.DatesByEvaluations.update(
        {evaluationsId: idEvaluation},
        {manualStartDateAt: startDate},
      );
      return startDate;
    } catch (error) {
      new CustomErrorLog(
        'evaluations-manage > setManualEvaluationStartDate',
        error,
        idEvaluation,
      ).saveError();
    }
  }

  /**
   * Return all evaluation created by a promoter with the state
   * @param {number} promoterId
   */
  this.getEvaluationsQuantityByPromoter = async function(promoterId) {
    let _this = this;
    _this.returnObj = {
      results: {
        pending: 0,
        progress: 0,
        finished: 0,
      },
      messages: [],
      hasError: false,
    };
    const filterEvaluators = {
      where: {
        createdBy: promoterId,
      },
      fields: {
        manualEvaluationState: true,
        automaticEvaluationState: true,
        id: true,
      },
    };
    try {
      const listEvaluations = await app.models.Evaluations.find(
        filterEvaluators,
      );
      listEvaluations.map(evaluation => {
        if (
          evaluation.manualEvaluationState ==
            eawConstants.ScrapingStates.FINISHED ||
          evaluation.automaticEvaluationState ==
            eawConstants.ScrapingStates.FINISHED
        ) {
          _this.returnObj.results.finished++;
        } else if (
          evaluation.manualEvaluationState ==
            eawConstants.ScrapingStates.PENDING ||
          evaluation.automaticEvaluationState ==
            eawConstants.ScrapingStates.PENDING
        ) {
          _this.returnObj.results.pending++;
        } else if (
          evaluation.manualEvaluationState ==
            eawConstants.ScrapingStates.PROGRESS ||
          evaluation.automaticEvaluationState ==
            eawConstants.ScrapingStates.PROGRESS
        ) {
          _this.returnObj.results.progress++;
        }
      });
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Return all evaluation created by a promoter and assign a evaluator
   * @param {number} promoterId
   */
  this.getEvaluationsQuantityByPromoterAndEvaluator = async function(
    promoterId,
    evaluatorId,
  ) {
    let _this = this;
    _this.returnObj = {
      results: {
        pending: 0,
        progress: 0,
        finished: 0,
      },
      messages: [],
      hasError: false,
    };
    const filterEvaluators = {
      where: {
        createdBy: promoterId,
      },
      fields: {
        manualEvaluationState: true,
        automaticEvaluationState: true,
        id: true,
      },
      include: [
        {
          relation: 'evaluationsSpecifications',
          scope: [
            {
              relation: 'specificationsUsers',
            },
          ],
        },
      ],
    };
    try {
      const listEvaluations = await app.models.Evaluations.find(
        filterEvaluators,
      );
      let evaluationMap = null;
      listEvaluations.map(evaluation => {
        evaluationMap = evaluation.toJSON();
        if (evaluationMap.evaluationsSpecifications) {
          if (
            checkIfIsEvaluatorAssignToEvaluation(
              evaluationMap.evaluationsSpecifications,
              evaluatorId,
            )
          ) {
            if (
              evaluationMap.manualEvaluationState ==
              eawConstants.ScrapingStates.FINISHED
            ) {
              _this.returnObj.results.finished++;
            } else if (
              evaluationMap.manualEvaluationState ==
              eawConstants.ScrapingStates.PENDING
            ) {
              _this.returnObj.results.pending++;
            } else if (
              evaluationMap.manualEvaluationState ==
              eawConstants.ScrapingStates.PROGRESS
            ) {
              _this.returnObj.results.progress++;
            }
          }
        }
      });
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to get all evaluation by evaluator and state
   */
  this.getEvaluationsByEvaluator = async function(
    manualEvaluationState,
    automaticEvaluationState,
    evaluatorId,
  ) {
    let _this = this;
    _this.returnObj = {
      results: {
        listEvaluations: [],
        evaluatorInfo: {},
      },
      messages: [],
      hasError: false,
    };
    const filterEvaluations = {
      where: {
        manualEvaluationState: manualEvaluationState,
      },
      include: [
        {
          relation: 'evaluationsDates',
        },
        {
          relation: 'evaluationsSegments',
        },
        {
          relation: 'evaluationsSpecifications',
          scope: [
            {
              relation: 'specificationsUsers',
            },
          ],
        },
        {
          relation: 'evaluationsDates',
        },
      ],
    };
    try {
      const listEvaluations = await evaluationsModel.find(filterEvaluations);
      let evaluationData = {};
      let evaluationMap = {};
      _this.returnObj.results.evaluatorInfo = await app.models.Users.find({
        where: {
          id: evaluatorId,
        },
        fields: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });
      listEvaluations.map(evaluation => {
        evaluationMap = evaluation.toJSON();
        if (
          evaluationMap.packagesId ===
            eawConstants.packagesTypes.MANUAL_SPECIFIC ||
          evaluationMap.packagesId ===
            eawConstants.packagesTypes.COMPLETE_RANDOM
        ) {
          if (
            checkIfIsEvaluatorAssignToEvaluation(
              evaluationMap.evaluationsSpecifications,
              evaluatorId,
            )
          ) {
            evaluationData = _.omit(evaluationMap, [
              'evaluationsDates',
              'evaluationsSegments',
              'evaluationsSpecifications',
            ]);
            evaluationData.manualStartDate =
              evaluationMap.evaluationsDates[0].manualStartDateAt;
            evaluationData.manualFinishDate =
              evaluationMap.evaluationsDates[0].manualFinishedDateAt;
            evaluationData.segmentData = {
              id: evaluationMap.evaluationsSegments.id,
              name: evaluationMap.evaluationsSegments.name,
            };
            evaluationData.specificationsQuantity =
              evaluationMap.evaluationsSpecifications.length;
            _this.returnObj.results.listEvaluations.push(evaluationData);
          }
        }
      });
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return await _this.returnObj;
  };

  /**
   * Return array with all sites name without duplicate
   */
  this.getAllSitesNames = async function() {
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    const filterOptions = {
      fields: {siteName: true},
    };
    try {
      const sitesNamesList = await evaluationsModel.find(filterOptions);
      sitesNamesList.map(site => {
        if (_this.returnObj.results.indexOf(site.siteName) === -1) {
          _this.returnObj.results.push(site.siteName);
        }
      });
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return await _this.returnObj;
  };

  this.getAllSitesStateByEvaluationsAndEvaluator = async function(
    evaluationId,
    evaluatorId,
  ) {
    let _this = this;
    const specificationModel = app.models.Specifications;
    const usersModel = app.models.Users;
    const evaluationModel = app.models.Evaluations;
    _this.returnObj = {
      results: {
        evaluationInfo: {},
        pagesEvaluated: [],
      },
      messages: [],
      hasError: false,
    };
    const filterOptions = {
      where: {and: [{evaluationsId: evaluationId}, {usersId: evaluatorId}]},
      include: [
        {
          relation: 'specificationsByManualPages',
        },
      ],
    };
    const evaluatorFilterOption = {
      where: {id: evaluatorId},
      fields: {
        id: true,
        firstName: true,
        lastName: true,
      },
    };
    const evaluationFilterOption = {
      where: {id: evaluationId},
      fields: {
        id: true,
        siteName: true,
      },
    };
    try {
      const listSpecification = await specificationModel.find(filterOptions);
      const evaluatorInfo = await usersModel.find(evaluatorFilterOption);
      const evaluationInfo = await evaluationModel.find(evaluationFilterOption);
      _this.returnObj.results.evaluationInfo = {
        evaluatorInfo: evaluatorInfo[0],
        evaluationInfo: evaluationInfo[0],
      };
      let specificationModelTag;
      let infoManualPage;
      for (let specification of listSpecification) {
        specificationModelTag = await buildSpecificationObjectTag(
          specification,
        );
        for (let manualPageSpec of specification.toJSON()
          .specificationsByManualPages) {
          infoManualPage = await buildManualPage(manualPageSpec.manualPagesId);
          if (
            infoManualPage.evaluationPageState ===
            eawConstants.EvaluationGeneralStates.FINISHED
          ) {
            _this.returnObj.results.pagesEvaluated.push({
              url: infoManualPage.url,
              browser: specificationModelTag.browser[0].name,
              device: specificationModelTag.device[0].name,
              operativeSystem: specificationModelTag.operativeSystem[0].name,
              supportTool: specificationModelTag.supportTool[0].name,
              disability: specificationModelTag.disability[0].name,
              finishedAt: infoManualPage.finishedAt,
            });
          }
        }
      }
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return await _this.returnObj;
  };

  /**
   * Return a object with the tags of a specification
   * @param {*} specification
   */
  async function buildSpecificationObjectTag(specification) {
    return {
      browser: await app.models.Browsers.find({
        where: {id: specification.browsersId},
      }),
      device: await app.models.Devices.find({
        where: {id: specification.devicesId},
      }),
      operativeSystem: await app.models.OperativeSystems.find({
        where: {id: specification.operativeSystemsId},
      }),
      supportTool: await app.models.SupportTools.find({
        where: {id: specification.supportToolsId},
      }),
      disability: await app.models.Disabilities.find({
        where: {id: specification.disabilitiesId},
      }),
    };
  }

  /**
   * Check the status and of evaluation of a manualPage
   * @param {*} manualPagesId
   */
  async function buildManualPage(manualPagesId) {
    const manualPageInfo = await app.models.ManualPages.find({
      where: {
        id: manualPagesId,
      },
      fields: {
        finishedAt: true,
        pagesId: true,
        evaluationPageState: true,
      },
    });
    const pageInfo = await app.models.Pages.find({
      where: {
        id: manualPageInfo[0].pagesId,
      },
      fields: {
        url: true,
      },
    });
    return {
      finishedAt: manualPageInfo[0].finishedAt,
      evaluationPageState: manualPageInfo[0].evaluationPageState,
      url: pageInfo[0].url,
    };
  }

  /**
   * Check if a evaluator have assign a evaluation since specification list
   * @param {*} specification
   * @param {*} evaluatorId
   */
  function checkIfIsEvaluatorAssignToEvaluation(specification, evaluatorId) {
    return specification.find(
      evaluation => evaluation.usersId == evaluatorId,
    ) == undefined
      ? false
      : true;
  }

  /**
   * Return all active nodes
   */
  this.getAllActivesNodes = async function() {
    return app.models.NodesServes.find({
      where: {
        and: [{state: true}, {isMasterNode: false}],
      },
    });
  };

  /**
   * Set a node to update a queue.
   * 1 if is running
   * 0 is don't running
   * @param {number} nodeId
   * @param {number} isRunning
   */
  this.updateQueueRunningState = async function (nodeId, isRunning = 0) {
    return app.models.NodesServes.update(
      {id: nodeId},
      {queueIsRunning: isRunning}
    );
  };

  /**
   * Check if one serve node is running a queue
   * @param {number} nodeId
   */
  this.getQueueRunningState = async function (nodeId) {
    return app.models.NodesServes.findOne({
      where: {
        id: nodeId
      }}
    ).then(serverNode => {
      if(serverNode) {
        return serverNode.queueIsRunning
      } else {
        new CustomErrorLog(
          'evaluations-manage > getQueueRunningState',
          'queueIsRunning is null, No NodesServe found.',
          null
        ).saveError();
        return true; // Finished the queue proccess
      }
    }).catch(error => {
      new CustomErrorLog('evaluations-manage > getQueueRunningState', error, null).saveError();
      return true;
    });
  };


  /**
   * Split all evaluation between the nodes
   */
  async function splitEvaluations(activesNodes, evaluationsToSplit) {
    let counterActiveNode = 0;
    for (const evaluation of evaluationsToSplit) {
      counterActiveNode++;
      await evaluationsModel.update(
        {id: evaluation.id},
        {nodeId: activesNodes[counterActiveNode].id},
      );
      if (counterActiveNode == activesNodes.length - 1) {
        counterActiveNode = 0;
      }
    }
  }

  /**
   * This function start the evaluation in the loopback queue manager
   * @param {*} ipToRequest
   */
  function requesAPI(ipToRequest) {
    const addressToRequest = 'http://' + ipToRequest + '/';
    https
      .get(addressToRequest + 'eaw-api-queue/QueueServices/startQueue', resp => {
        let data = '';
        resp.on('data', chunk => {
          data += chunk;
        });
        resp.on('end', () => {
          console.log(JSON.parse(data));
        });
      })
      .on('error', err => {
        console.log('Error: ' + err.message);
      });
  }

  /**
   * Assign all new evaluation to master node
   * @param {*} newEvaluations
   */
  async function assignAllToMasterNode(newEvaluations) {
    const masterNode = await app.models.NodesServes.findOne({
      where: {
        isMasterNode: true,
      },
    });
    for (const evaluation of newEvaluations) {
      await evaluationsModel.update(
        {id: evaluation.id},
        {nodeId: masterNode.id},
      );
    }
    requesAPI(masterNode.ip);
  }

  /**
   * Function to start the nodes to evaluate
   * @param {*} activesNodes
   */
  function startNodes(activesNodes) {
    for (const node of activesNodes) {
      requesAPI(node.ip);
    }
  }

  /**
   * Function to handle errors .
   */
  function handleError(reportErrorObj, error) {
    reportErrorObj.hasError = true;
    reportErrorObj.messages.push(error.toString());
    return error.toString();
  }
}

module.exports = PromoterEvaluationsManager;
