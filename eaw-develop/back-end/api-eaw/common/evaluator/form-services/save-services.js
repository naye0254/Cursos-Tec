'use strict';

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');

const app = require('../../../server/server');

/**
 * Manage specifications model services logic.
 */
module.exports = function EvaluatorFormSaveServices() {
  const eawConstants = new EAWConstants();
  const evaluationModel = app.models.Evaluations;
  const manualAnswersModel = app.models.ManualAnswers;
  const manualPagesModel = app.models.ManualPages;
  const specificationsModel = app.models.Specifications;
  const specificationsByManualPagesModel =
    app.models.SpecificationsByManualPages;

  /**
   * Function to save an specific observation in manual page model.
   * @param {number} principleId
   * @param {number} idManualPage
   * @param {string} observation
   */
  this.saveObservationField = async function(
    principleId,
    idManualPage,
    observation,
  ) {
    const returnObj = {results: {}, count: null, message: []};
    try {
      const observationField =
        eawConstants.EvaluatorFormConstants.OBSERVATION_FIELDS[principleId - 1];
      returnObj.results = await manualPagesModel.update(
        {id: idManualPage},
        {[observationField]: observation},
      );
    } catch (error) {
      throw handleError(error, 'saveObservationField');
    }
    return returnObj;
  };

  /**
   * Service to save manual answers by an specific format from an evaluator manual form.
   * It search the corresponding page and match the id with all the manual pages
   * mixed in the formObject of a single user.
   * @param {number} idManualPage
   * @param {object} formObject
   */
  this.saveManualAnswers = async function(
    idManualPage,
    isFinished,
    formObject,
  ) {
    let specificationsIdsList = [];
    let correspondingPage = {};
    let evaluationId = null;
    let manualPagesIds = [idManualPage];
    const returnObj = {results: {}, count: null, message: []};
    try {
      let savedmanualPage = await getManualPage(idManualPage);
      if (!(isFinished == false && savedmanualPage.evaluationPageState == 2)) {
        specificationsIdsList = await getSpecificationsIds(formObject);
        correspondingPage = await getPageFromManualPage(idManualPage);
        evaluationId = correspondingPage.evaluationsId;
        await updateEvaluationState(
          evaluationId,
          eawConstants.EvaluationStates.PROGRESS,
        );
        await updateSpecificationsState(
          specificationsIdsList,
          eawConstants.EvaluationStates.PROGRESS,
        );
        const specificationsByManualPages = await getManualPagesBySpecifications(
          specificationsIdsList,
          correspondingPage.id,
        );
        manualPagesIds = await getManualPagesIds(specificationsByManualPages);
        await updateManualPages(
          manualPagesIds,
          eawConstants.EvaluationStates.PROGRESS,
          formObject,
        );
        const hashSpecificationIdsXSpecsByManualPagesIds = await generateHashSpecificationIdsXSpecsByManualPagesIds(
          specificationsByManualPages,
        );
        const specificationsByManualPagesIdsList = await getSpecificationsByManualPagesIds(
          specificationsByManualPages,
        );
        const existentAnswersIds = await searchManualAnswersIds(
          specificationsByManualPagesIdsList,
        );
        const answerIdsQuantity = existentAnswersIds.length;

        if (answerIdsQuantity === 0) {
          await createManualAnswers(
            hashSpecificationIdsXSpecsByManualPagesIds,
            formObject,
          );
        } else {
          try {
            const deletedAnswersCounter = await manualAnswersModel.destroyAll({
              specificationsByManualPagesId: {
                inq: specificationsByManualPagesIdsList,
              },
            });
          } catch (error) {}
          await updateManualAnswers(
            hashSpecificationIdsXSpecsByManualPagesIds,
            formObject,
            existentAnswersIds,
          );

          if (isFinished === true) {
            await updateManualPages(
              manualPagesIds,
              eawConstants.EvaluationStates.FINISHED,
            );
            const allManualPagesFinished = await verifyAllManualPagesByEvaluation(
              evaluationId,
              specificationsIdsList,
            );
            if (allManualPagesFinished === true) {
              await updateSpecificationsState(
                specificationsIdsList,
                eawConstants.EvaluationStates.FINISHED,
              );
              const allSpecsFinished = await verifyAllSpecificationsByEvaluation(
                evaluationId,
              );
              if (allSpecsFinished === true) {
                await updateEvaluationState(
                  evaluationId,
                  eawConstants.EvaluationStates.FINISHED,
                );
              } else {
                await updateEvaluationState(
                  evaluationId,
                  eawConstants.EvaluationStates.PROGRESS,
                );
              }
            }
          }
        }
        returnObj.count = answerIdsQuantity;
      }
      return returnObj;
    } catch (error) {
      if (error.errno !== eawConstants.MySQL_ER_DUP_ENTRY_ERRNO) {
        await updateManualPages(
          manualPagesIds,
          eawConstants.EvaluationStates.FAILED,
        );
      }
      throw handleError(error, 'saveManualAnswers', evaluationId);
    }
  };

  /**
   * Update fields for manual answers if the field exist,
   * in other case, it create the answer.
   * @param {*} hashSpecificationIdsXSpecsByManualPagesIds
   * @param {*} formObject
   * @param {*} manualAnswersIdList
   */
  async function updateManualAnswers(
    hashSpecificationIdsXSpecsByManualPagesIds,
    formObject,
    manualAnswersIdList,
  ) {
    try {
      let index = 0;
      const EMPTY_ANSWERS = '';
      for (const answerPrinciple in formObject) {
        for (const criteria of formObject[answerPrinciple]) {
          for (const answer of criteria.roles) {
            const specByManualPageId =
              hashSpecificationIdsXSpecsByManualPagesIds[answer.specification];
            if (
              answer.cumply != eawConstants.ComplyState.NO_COMPLY &&
              answer.cumply !== EMPTY_ANSWERS
            ) {
              let answerData = {
                criterionsId: criteria.criterion,
                recommendationsId: 1,
                complyState: answer.cumply,
                specificationsByManualPagesId: specByManualPageId,
              };
              const answerId = manualAnswersIdList[index];
              if (answerId == undefined) {
                await manualAnswersModel.create(answerData);
              } else {
                answerData.id = answerId;
                await manualAnswersModel.create(answerData);
              }
              index = index + 1;
            } else if (
              answer.cumply == eawConstants.ComplyState.NO_COMPLY &&
              answer.cumply !== EMPTY_ANSWERS
            ) {
              for (const recommendationId of answer.recommendations) {
                let answerData = {
                  criterionsId: criteria.criterion,
                  recommendationsId: recommendationId.id,
                  complyState: answer.cumply,
                  specificationsByManualPagesId: specByManualPageId,
                };
                const answerId = manualAnswersIdList[index];
                if (answerId == undefined) {
                  await manualAnswersModel.create(answerData);
                } else {
                  answerData.id = answerId;
                  await manualAnswersModel.create(answerData);
                }
                index = index + 1;
              }
            }
          }
        }
      }
    } catch (error) {
      handleError(error, 'updateManualAnswers');
    }
  }

  /**
   * Store fields form manual answers
   * @param {*} hashSpecificationIdsXSpecsByManualPagesIds
   * @param {*} formObject
   */
  async function createManualAnswers(
    hashSpecificationIdsXSpecsByManualPagesIds,
    formObject,
  ) {
    try {
      const EMPTY_ANSWERS = '';
      for (const answerPrinciple in formObject) {
        for (const criteria of formObject[answerPrinciple]) {
          for (const answer of criteria.roles) {
            const specByManualPageId =
              hashSpecificationIdsXSpecsByManualPagesIds[answer.specification];
            if (
              answer.cumply != eawConstants.ComplyState.NO_COMPLY &&
              answer.cumply !== EMPTY_ANSWERS
            ) {
              const answerData = {
                criterionsId: criteria.criterion,
                recommendationsId: 1,
                complyState: answer.cumply,
                specificationsByManualPagesId: specByManualPageId,
              };
              await manualAnswersModel.create(answerData);
            } else if (
              answer.cumply == eawConstants.ComplyState.NO_COMPLY &&
              answer.cumply !== EMPTY_ANSWERS
            ) {
              for (const recommendationId of answer.recommendations) {
                const answerData = {
                  criterionsId: criteria.criterion,
                  recommendationsId: recommendationId.id,
                  complyState: answer.cumply,
                  specificationsByManualPagesId: specByManualPageId,
                };
                await manualAnswersModel.create(answerData);
              }
            }
          }
        }
      }
    } catch (error) {
      handleError(error, 'createManualAnswers');
    }
  }

  /**
   * Search manual answers existen ids for the current evaluation
   * @param {number} specificationsByManualPagesIdsList
   */
  async function searchManualAnswersIds(specificationsByManualPagesIdsList) {
    let manualAnswers = [];
    try {
      manualAnswers = await manualAnswersModel
        .find({
          where: {
            specificationsByManualPagesId: {
              inq: specificationsByManualPagesIdsList,
            },
          },
        })
        .map(answers => answers.id);
    } catch (error) {
      throw handleError(error, 'searchAnswersIds');
    }
    return manualAnswers;
  }

  /**
   * Return true if all manual pages of an evaluation are finished,
   * false in other case. It will filter specification id too.
   * @param {*} evaluationId
   */
  async function verifyAllManualPagesByEvaluation(
    evaluationId,
    specificationsIdsList,
  ) {
    try {
      const specifications = await specificationsModel.find({
        where: {
          id: {
            inq: specificationsIdsList,
          },
        },
      });
      let manualPagesIdsList = [];
      for (const specification of specifications) {
        await specificationsByManualPagesModel
          .find({
            where: {
              specificationsId: specification.id,
            },
          })
          .then(specificationsByManualPages => {
            return specificationsByManualPages.forEach(
              specificationsByManualPage => {
                manualPagesIdsList.push(
                  specificationsByManualPage.manualPagesId,
                );
              },
            );
          });
      }
      const manualPages = await manualPagesModel.find({
        where: {
          and: [
            {id: {inq: manualPagesIdsList}},
            {
              evaluationPageState: {
                neq: eawConstants.EvaluationStates.FINISHED,
              },
            },
          ],
        },
      });
      return manualPages.length === 0;
    } catch (error) {
      throw handleError(
        error,
        'verifyAllManualPagesByEvaluation',
        evaluationId,
      );
    }
  }

  /**
   * Return true if all secifications of an evaluation are finished,
   * false in other case.
   * @param {*} evaluationId
   */
  async function verifyAllSpecificationsByEvaluation(evaluationId) {
    try {
      const unFinishedSpecifications = await specificationsModel.find({
        where: {
          and: [
            {evaluationsId: evaluationId},
            {
              state: {
                neq: eawConstants.EvaluationStates.FINISHED,
              },
            },
          ],
        },
      });
      return unFinishedSpecifications.length === 0;
    } catch (error) {
      throw handleError(
        error,
        'verifyAllSpecificationsByEvaluation',
        evaluationId,
      );
    }
  }

  /**
   * Get ManualPages by Specifications filtered by specification and
   * page id.
   * @param {Array<number>} specificationsIdsList
   * @param {number} correspondingPageId
   */
  async function getManualPagesBySpecifications(
    specificationsIdsList,
    correspondingPageId,
  ) {
    try {
      return await specificationsByManualPagesModel
        .find({
          where: {
            specificationsId: {inq: specificationsIdsList},
          },
          include: [
            {
              relation: 'SpecificationsByManualPagesManualPages',
              scope: {
                fields: ['id', 'pagesId'],
                include: [
                  {
                    relation: 'manualPagesPages',
                    scope: {
                      fields: ['id', 'evaluationsId'],
                    },
                  },
                ],
              },
            },
          ],
        })
        .then(specificationsByManualPages => {
          specificationsByManualPages = JSON.parse(
            JSON.stringify(specificationsByManualPages),
          );
          return specificationsByManualPages.filter(
            data =>
              data.SpecificationsByManualPagesManualPages.pagesId ===
              correspondingPageId,
          );
        });
    } catch (error) {
      throw handleError(error, 'getManualPagesBySpecifications');
    }
  }

  // async allManualPagesFinished()

  /**
   * Get a page from a manual page.
   * @param {number} idManualPage
   */
  async function getPageFromManualPage(idManualPage) {
    return manualPagesModel
      .findOne({
        where: {
          id: idManualPage,
        },
        include: [
          {
            relation: 'manualPagesPages',
          },
        ],
      })
      .then(manualPagePage => {
        manualPagePage = JSON.parse(JSON.stringify(manualPagePage));
        return manualPagePage.manualPagesPages;
      });
  }

  /**
   * Get a page from a manual page.
   * @param {number} idManualPage
   */
  async function getManualPage(idManualPage) {
    return manualPagesModel
      .findOne({
        where: {
          id: idManualPage,
        },
        include: [
          {
            relation: 'manualPagesPages',
          },
        ],
      })
      .then(manualPagePage => {
        return (manualPagePage = JSON.parse(JSON.stringify(manualPagePage)));
      });
  }

  /**
   * Get specifications ids from a formObject
   * @param {object} formObject
   */
  async function getSpecificationsIds(formObject) {
    try {
      const specificationsIdsList = [];
      for (const principleIndex in formObject) {
        if (principleIndex.length > 0) {
          for (const role of formObject[principleIndex][0].roles) {
            specificationsIdsList.push(role.specification);
          }
          break;
        }
      }
      return await specificationsIdsList;
    } catch (error) {
      throw handleError(error, 'getSpecificationsIds');
    }
  }

  /**
   * Get specifications ids from a formObject
   * @param {array<object>} specificationsByManualPages
   */
  async function getManualPagesIds(specificationsByManualPages) {
    try {
      let manualPagesIdsList = [];
      for (const specificationsByManualPage of specificationsByManualPages) {
        manualPagesIdsList.push(specificationsByManualPage.manualPagesId);
      }
      return manualPagesIdsList;
    } catch (error) {
      throw handleError(error, 'getManualPagesIds');
    }
  }

  /**
   * Get specificationsByManualPages ids from a formObject
   * @param {array<object>} specificationsByManualPages
   */
  async function getSpecificationsByManualPagesIds(
    specificationsByManualPages,
  ) {
    try {
      let specificationsByManualPagesIds = [];
      for (const specificationsByManualPage of specificationsByManualPages) {
        specificationsByManualPagesIds.push(specificationsByManualPage.id);
      }
      return specificationsByManualPagesIds;
    } catch (error) {
      throw handleError(error, 'getSpecificationsByManualPagesIds');
    }
  }

  /**
   * Generate a hash with specifications ids as the keys
   * and specByManualPagesIds as the values.
   * @param {array<object>} specificationsByManualPages
   */
  async function generateHashSpecificationIdsXSpecsByManualPagesIds(
    specificationsByManualPages,
  ) {
    try {
      let hashSpecificationIdsXSpecsByManualPagesIds = {};
      for (const specificationsByManualPage of specificationsByManualPages) {
        hashSpecificationIdsXSpecsByManualPagesIds[
          specificationsByManualPage.specificationsId
        ] = specificationsByManualPage.id;
      }
      return hashSpecificationIdsXSpecsByManualPagesIds;
    } catch (error) {
      throw handleError(
        error,
        'generateHashSpecificationIdsXSpecsByManualPagesIds',
      );
    }
  }

  /**
   * Update evaluation state
   * @param {number} id
   * @param {string} state
   */
  async function updateEvaluationState(id, state) {
    try {
      return await evaluationModel.update(
        {id: id},
        {manualEvaluationState: state},
      );
    } catch (error) {
      throw handleError(error, 'updateEvaluationState', id);
    }
  }

  /**
   * Update evaluation state
   * @param {array<number>} specificationIdsList
   * @param {string} state
   */
  async function updateSpecificationsState(specificationIdsList, state) {
    try {
      for (const id of specificationIdsList) {
        await specificationsModel.update({id: id}, {state: state});
      }
    } catch (error) {
      throw handleError(error, 'updateSpecificationsState');
    }
  }

  /**
   * Update manual page states
   * @param {array<number>} manualPagesIdsList
   * @param {string} state
   * @param {Object} formObject
   */
  async function updateManualPages(manualPagesIdsList, state, formObject) {
    try {
      for (const id of manualPagesIdsList) {
        await manualPagesModel.update(
          {id: id},
          {
            evaluationPageState: state,
            formPage: JSON.stringify(formObject),
          },
        );
      }
    } catch (error) {
      throw handleError(error, 'updateManualPages');
    }
  }

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId = null) {
    new CustomErrorLog(
      'BE > EvaluatorFormLoadServices > ' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
