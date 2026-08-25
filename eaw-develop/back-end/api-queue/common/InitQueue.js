'use strict';

const axios = require('axios');
var fs = require('fs');

let API_IP = 'http://192.1.2.6:4000/eaw-api/';

module.exports = function InitQueue() {
  /**
   * Start evaluation process
   */
  this.startQueue = function () {
    getAllEvaluationsPendingAndProcess().then(async (evaluations) => {
      startEvaluationAsync(evaluations);
    });
    return true;
  };

  this.startQueuePendingReports = function () {
    getEvaluationsPendingReport().then((evaluations) => {
      startJasperReportAsync(evaluations);
    });
    return true;
  };

  this.updateQueueRunningStateFromNode = async function (nodeId, state) {
    return await updateQueueRunningState(nodeId, state);
  };
};

/**
 * Start the evaluation queue
 * @param {Array<object>} evaluations
 */
function startEvaluationAsync(evaluations) {
  (async () => {
    const logStream = await openLogFile();
    console.log('startEvaluationsAsync...');
    writeIntoLogFile(logStream, '---------------------------------');
    writeIntoLogFile(logStream, '----- StartEvaluationsAsync -----');
    writeIntoLogFile(logStream, new Date().toISOString());

    const nodeId = process.env.NODE_ID || 1;
    let queueIsRuning = (await getIfQueueIsRunning(nodeId)).data;

    if (evaluations.length > 0 && queueIsRuning === 0) {
      queueIsRuning = 1;
      await updateQueueRunningState(nodeId, 1);

      for (let evaluation of evaluations) {
        await waitForInternet();
        if (evaluation.scrapingState === 1 || evaluation.scrapingState === -2) {
          writeIntoLogFile(
            logStream,
            `Restart scraping(${evaluation.scrapingState})-autoEvaluation(${
              evaluation.automaticEvaluationState
            }) for eval: ${evaluation.id} - ${new Date().toISOString()}`
          );
          try {
            await awaitRestarScraping(evaluation.id);
            if (evaluation.automaticEvaluationState === 0) {
              await awaitEvaluation(evaluation.id);
              await awaitReports(evaluation.id);
            } else {
              await awaitDeleteEvaluation(evaluation.id);
              await awaitEvaluation(evaluation.id);
              await awaitReports(evaluation.id);
            }
          } catch (error) {
            writeIntoLogFile(
              logStream,
              `Error restarting scraping(1). Eval: ${evaluation.id} - ${new Date().toISOString()}`
            );
            await storeError(
              'initCluster.js > startEvaluationAsync > case 1',
              error,
              evaluation.id
            );
            evaluations = null;
          }
        } else if (evaluation.scrapingState === 0) {
          writeIntoLogFile(
            logStream,
            `Begin scraping(0) for eval: ${evaluation.id} - ${new Date().toISOString()}`
          );
          try {
            await awaitBeginScraping(evaluation.id);
            await awaitEvaluation(evaluation.id);
            await awaitReports(evaluation.id);
          } catch (error) {
            writeIntoLogFile(
              logStream,
              `Error in starting(0) scraping. Eval: ${evaluation.id} - ${new Date().toISOString()}`
            );
            await storeError(
              'initCluster.js > startEvaluationAsync > case 0',
              error,
              evaluation.id
            );
            evaluations = null;
          }
        } else if (evaluation.scrapingState === 2) {
          writeIntoLogFile(
            logStream,
            `Begin from finished scraping(2)-autoEvaluation(${
              evaluation.automaticEvaluationState
            }) for eval: ${evaluation.id} - ${new Date().toISOString()}`
          );
          try {
            if (
              evaluation.automaticEvaluationState === 1 ||
              evaluation.automaticEvaluationState === 2 ||
              evaluation.automaticEvaluationState === -2
            ) {
              await awaitDeleteEvaluation(evaluation.id);
              await awaitEvaluation(evaluation.id, evaluation.pagesChoosed === 0);
              await awaitReports(evaluation.id);
            } else if (evaluation.automaticEvaluationState === 0) {
              await awaitEvaluation(evaluation.id, evaluation.pagesChoosed === 0);
              await awaitReports(evaluation.id);
            }
          } catch (error) {
            writeIntoLogFile(
              logStream,
              `Error in scrap(2)-Restarting or starting evaluation. Eval: ${
                evaluation.id
              } - ${new Date().toISOString()}`
            );
            await storeError(
              'initCluster.js > startEvaluationAsync > case 2',
              error,
              evaluation.id
            );
            evaluations = null;
          }
        } else {
          await storeError(
            'initCluster.js > startEvaluationAsync: ' + evaluation.scrapingState,
            'Unknown scraping state',
            evaluation.id
          );
        }
        sleepFor(5000);
      }
      queueIsRuning = 0;
      await updateQueueRunningState(nodeId, 0);
      writeIntoLogFile(logStream, `... End current Q ... - ${new Date().toISOString()}`);
      console.log('... End Q');
      callNextQueue(logStream);
    } else {
      if (queueIsRuning === 1) {
        console.log('queueIsRuning already');
        writeIntoLogFile(logStream, `queueIsRuning already - ${new Date().toISOString()} \n`);
      } else {
        closeLogFile(logStream);
        console.log('Evaluations finished, no evaluations pending in this node.');
        writeIntoLogFile(
          logStream,
          `Evaluations finished, no evaluations pending in this node. - ${new Date().toISOString()}`
        );
      }
    }
  })();
}

/**
 * Function to call the next pending evaluations
 * that doesn't being excecuted in the last queue.
 */
function callNextQueue(logStream) {
  getAllEvaluationsPendingAndProcess().then((evaluations) => {
    if (evaluations && evaluations.length > 0) {
      writeIntoLogFile(logStream, `Calling next queue`);
      startEvaluationAsync(evaluations);
    } else {
      console.log('No evaluations queue pending.');
      writeIntoLogFile(logStream, `-- No evaluations queue pending --`);
    }
  });
}

/**
 * Start the generation of reports in jasper.
 * @param {Array<object>} evaluations
 */
function startJasperReportAsync(evaluations) {
  (async () => {
    console.log('startJasperReportAsync...');
    if (evaluations.length > 0) {
      for (let evaluation of evaluations) {
        await waitForInternet();
        if (evaluation.scrapingState === 2) {
          try {
            if (evaluation.automaticEvaluationState === 2) {
              await awaitReports(evaluation.id);
            }
          } catch (error) {
            await storeError(
              'initCluster.js > startJasperReportAsync > case 2',
              error,
              evaluation.id
            );
            evaluations = null;
          }
        } else {
          await storeError(
            'initCluster.js > startEvaluationAsync: ' + evaluation.scrapingState,
            'Unknown scraping state',
            evaluation.id
          );
        }
        sleepFor(5000);
      }
      console.log('... End Q Reports');
    }
  })();
}

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

async function checkInternetConnection() {
  let response = {};
  const urls = ['http://192.1.2.6/', 'https://www.google.com/'];
  for (let index = 0; index < urls.length; index++) {
    const URL = urls[index];
    response = await axios({
      url: URL,
      method: 'head'
    })
      .then((response) => true)
      .catch((error) => false);
    if (response) {
      return true;
    }
  }

  return false;
}

async function awaitBeginScraping(id) {
  await getTriggerScrapping(id);
  let checkerContinue = true;
  while (checkerContinue) {
    checkerContinue = await checkContinueScrapping(id);
    if (!checkerContinue) {
      return await checkerContinue;
    } else {
      sleepFor(5000);
    }
  }
}

async function awaitRestarScraping(id) {
  await resetScrappingEvaluation(id);
  let checkerContinue = true;
  while (checkerContinue) {
    checkerContinue = await checkContinueScrapping(id);
    if (!checkerContinue) {
      return await checkerContinue;
    } else {
      sleepFor(5000);
    }
  }
}

async function awaitEvaluation(id, asignPages = true) {
  const states = await getStatesByEvaluation(id);
  const scrapingState = states.data.results.scrapingState;

  if (scrapingState === 2) {
    await excecuteEvaluation(id, asignPages);
    let checkerContinue = true;
    while (checkerContinue) {
      checkerContinue = await checkContinueEvaluation(id);
      if (!checkerContinue) {
        return await checkerContinue;
      } else {
        sleepFor(5000);
      }
    }
  }
}

async function awaitDeleteEvaluation(id) {
  await deleteAutomaticEvaluationInProgress(id);
  let checkerContinue = true;
  while (checkerContinue) {
    checkerContinue = await checkEvaluationErrased(id);
    if (!checkerContinue) {
      return await checkerContinue;
    } else {
      sleepFor(5000);
    }
  }
}

async function awaitReports(id) {
  const states = await getStatesByEvaluation(id);
  const automaticEvaluationState = states.data.results.automaticEvaluationState;
  if (automaticEvaluationState === 2) {
    await generateReports(id, states.data.results.evaluationCode);
    let checkerContinue = true;
    while (checkerContinue) {
      checkerContinue = await checkContinueReport(id);
      if (!checkerContinue) {
        return await checkerContinue;
      } else {
        sleepFor(5000);
      }
    }
  }
}

// Function call report generation using LaTex
async function awaitReportsLatex(id) {
  const states = await getStatesByEvaluation(id);
  const automaticEvaluationState = states.data.results.automaticEvaluationState;
  if (automaticEvaluationState === 2) {
    await generateReportsWithLatex(id, states.data.results.evaluationCode);
    let checkerContinue = true;
    while (checkerContinue) {
      checkerContinue = await checkContinueReport(id);
      if (!checkerContinue) {
        return await checkerContinue;
      } else {
        sleepFor(5000);
      }
    }
  }
}

async function checkContinueScrapping(idEvaluation) {
  const lastCheckPoint = await getLastedCheckpoint(idEvaluation);
  const stateByEvaluation = await getStatesByEvaluation(idEvaluation);
  const elapsedTime = lastCheckPoint.data.results.elapsedTime;
  let hours = 0;
  if (elapsedTime != undefined) {
    hours = await parseInt(elapsedTime.hours);
  }
  if (hours >= 2) {
    await finishScrapingInCheckpoint();
  }
  return stateByEvaluation.data.results.scrapingState === 1 && hours < 2;
}

/*
  Return true if the evaluation is running.*/
async function checkContinueEvaluation(idEvaluation) {
  const states = await getStatesByEvaluation(idEvaluation);
  const evaluationState = states.data.results.automaticEvaluationState;
  const scrapingState = states.data.results.scrapingState;
  let keepWaiting = evaluationState !== 2 && scrapingState !== -1 && scrapingState !== -2;
  return keepWaiting;
}

/*
  Return true if the evaluation is already deleted.*/
async function checkEvaluationErrased(idEvaluation) {
  const states = await getStatesByEvaluation(idEvaluation);
  const evaluationState = states.data.results.automaticEvaluationState;
  const scrapingState = states.data.results.scrapingState;
  let finish = evaluationState !== 0 && scrapingState !== -1 && scrapingState !== -2;
  return finish;
}

/*
Return true if the report is generating.*/
async function checkContinueReport(idEvaluation) {
  const states = await getStatesByEvaluation(idEvaluation);
  const evaluationState = states.data.results.automaticEvaluationState;
  const managerialReportState = states.data.results.managerialReportState;
  const technicalReportState = states.data.results.technicalReportState;
  let keepWaiting =
    (managerialReportState !== 2 || technicalReportState !== 2) &&
    managerialReportState !== -1 &&
    technicalReportState !== -1 &&
    evaluationState !== -1 &&
    evaluationState !== -2;
  return keepWaiting;
}

/**
 * Finish scraping process
 * @param {Number} idEvaluation
 */
async function finishScrapingInCheckpoint(idEvaluation) {
  return await axios.get(
    `${API_IP}Evaluations/finishScrapingInCheckpoint?idEvaluation=${idEvaluation}`
  );
}

/**
 * Get checkpont from an evaluation, for a scraping in progress.
 * @param {Number} idEvaluation
 */
async function getLastedCheckpoint(idEvaluation) {
  return await axios.get(`${API_IP}Evaluations/lastestCheckpoint?idEvaluation=${idEvaluation}`);
}

/**
 * Get states of an evaluation by id
 * @param {Number} idEvaluation
 */
async function getStatesByEvaluation(idEvaluation) {
  return await axios.get(`${API_IP}Evaluations/statesByEvaluation?idEvaluation=${idEvaluation}`);
}

/**
 * Do nothing for a number of miliseconds
 * @param {Number} sleepDuration
 */
function sleepFor(sleepDuration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + sleepDuration) {
    /* do nothing */
  }
}

/**
 * Get all evaluations pending and in progress states.
 */
async function getAllEvaluationsPendingAndProcess() {
  return await axios
    .get(`${API_IP}Evaluations/getEvaluationsPendingAndProcess`)
    .then(async (evaluations) => {
      return await filterEvaluationsByNode(evaluations.data.results);
    });
}

/**
 * Get all evaluations with pending report.
 */
async function getEvaluationsPendingReport() {
  return await axios
    .get(`${API_IP}Evaluations/getEvaluationsPendingReport`)
    .then(async (evaluations) => {
      return await filterEvaluationsByNode(evaluations.data.results);
    });
}

/**
 * Filter the list of evaluations by node id got of environment variables
 * @param {*} listEvaluations
 */
async function filterEvaluationsByNode(listEvaluations) {
  const nodeId = process.env.NODE_ID || 1; // 1 if there is no CI
  // Remember to add a master or check the table NodesServes
  return listEvaluations.filter((x) => x.nodeId == nodeId);
}

/**
 * Evaluation a node to check if a queue is running
 * @param {number} nodeId
 * @param {number} isRunning
 */
async function updateQueueRunningState(nodeId, isRunning) {
  return await axios.get(
    `${API_IP}NodesServes/updateQueueRunningState?nodeId=${nodeId}&isRunning=${isRunning}`
  );
}

/**
 * Check if one serve node is running a queue
 * @param {number} nodeId
 */
async function getIfQueueIsRunning(nodeId) {
  return await axios.get(`${API_IP}NodesServes/getQueueRunningState?nodesServeId=${nodeId}`);
}

/**
 * Begin scraping process
 * @param {Number} id
 */
async function getTriggerScrapping(idEvaluation) {
  return await axios.get(`${API_IP}Evaluations/get-triggerScraping?idEvaluation=${idEvaluation}`);
}

/**
 * Save random pages in Pages model and start evaluation process
 * that assign other type of pages and start the evaluation.
 * @param {Number} id
 */
async function excecuteEvaluation(id, asignPages) {
  if (asignPages) {
    let done = await saveRandomSelectedPages(id);
  }
  const AUTO_RANDOM_PACKAGE = 1;
  await startEvaluation(id, AUTO_RANDOM_PACKAGE);
}

/**
 * Save pages with a random selection.
 * @param {Number} idEvaluation
 */
async function saveRandomSelectedPages(idEvaluation) {
  return await axios.get(`${API_IP}Pages/saveRandomSelectedPages?idEvaluation=${idEvaluation}`);
}

/**
 * Start evaluation process
 * @param {Number} idEvaluation
 * @param {Number} idPackage
 */
async function startEvaluation(idEvaluation, idPackage) {
  const httpData = {
    idEvaluation: idEvaluation,
    idPackage: idPackage
  };
  return await axios.post(`${API_IP}Evaluations/startEvaluation`, httpData);
}

/**
 * Generate tecnical and managerial reports with Jasper.
 * @param {Number} evaluationId
 * @param {string} evaluationCode
 */
async function generateReports(idEvaluation, evaluationCode) {
  return await axios.get(
    `${API_IP}Evaluations/generateReport?idEvaluation=${idEvaluation}&evaluationCode=${evaluationCode}`
  );
}

/**
 * Generate tecnical and managerial reports with Latex.
 * @param {Number} evaluationId
 * @param {string} evaluationCode
 */
async function generateReportsWithLatex(idEvaluation, evaluationCode) {
  return await axios.get(
    `${API_IP}Evaluations/generateReportLatex?idEvaluation=${idEvaluation}&evaluationCode=${evaluationCode}`
  );
}

/**
 * Delete scraping in progress and start the process again
 * @param {Number} idEvaluation
 */
async function resetScrappingEvaluation(idEvaluation) {
  return await axios.get(
    `${API_IP}Evaluations/resetScrapingInProgress?idEvaluation=${idEvaluation}`
  );
}

/**
 * Delete selected pages, save pages again and reset
 * automatic evaluation to PENDING state.
 * @param {Number} idEvaluation
 */
async function deleteAutomaticEvaluationInProgress(idEvaluation) {
  return await axios.get(
    `${API_IP}Evaluations/deleteAutomaticEvaluationInProgress?idEvaluation=${idEvaluation}`
  );
}

async function deleteAutomaticEvaluationInProgress(idEvaluation) {
  return await axios.get(
    `${API_IP}Evaluations/deleteAutomaticEvaluationInProgress?idEvaluation=${idEvaluation}`
  );
}

/**
 * Store unexpected errors.
 * @param {string} location
 * @param {string} errorMessage
 */
async function storeError(
  location = 'initCluster',
  errorMessage = 'Null error message',
  evaluationsId
) {
  const httpData = {
    id: 0,
    fixed: 0,
    locationName: location,
    errorDescription: JSON.stringify(errorMessage),
    evaluationsId: evaluationsId
  };

  return await axios.post(`${API_IP}ErrorDebugs/`, httpData).catch((e) => {
    return e;
  });
}

/*############### Debug Functions ## begin ####################
--------------------------------------------------------------*/

/**
 * Funcion to openLogFile
 * @param {string} DIR_PATH
 */
async function openLogFile(DIR_PATH = './server/local-storage/logs/log.txt') {
  let logStream = null;
  try {
    logStream = await fs.createWriteStream(DIR_PATH, {flags: 'a'});
  } catch (error) {
    console.log('Error open logStream');
    logStream = null;
  }

  return logStream;
}

/**
 * Function to write in log debug file.
 * @param {fs.WriteStream} streamVariable
 * @param {String} strMessage
 */
function writeIntoLogFile(streamVariable, strMessage = ' ') {
  try {
    if (streamVariable) {
      streamVariable.write(strMessage + '\n');
    } else {
      console.log('null streamVariable w');
    }
  } catch (error) {
    console.log('Error writing in debug file');
    console.log(error);
  }
}

/**
 * Function to close log debug file.
 * @param {fs.WriteStream} streamVariable
 */
function closeLogFile(streamVariable) {
  try {
    if (streamVariable) {
      streamVariable.end();
    } else {
      console.log('null streamVariable c');
    }
  } catch (error) {
    console.log('Error ending debug file');
    console.log(error);
  }
}

/*############### Debug Functions ## end ####################
-----------------------------------------------------------*/
