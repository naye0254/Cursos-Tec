'use strict';

const EAWConstants = require('../../eaw-constants');
const UsersSharedService = require('../../shared/shared-services/users-shared-services');

const app = require('../../../server/server');
const _ = require('lodash');

/**
 * Manage evaluators model services logic.
 */
function EvaluatorManager() {
  const eawConstants = new EAWConstants();

  /**
   * Function to get all users Evaluators .
   */
  this.getAllEvaluators = async function(isActive) {
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    let filterEvaluators = {};
    if (isActive === `'null'`) {
      filterEvaluators = {
        where: {
          roleTypesId: eawConstants.EVALUATOR_ROLE_ID,
        },
        include: [
          {
            relation: 'usersDisabilitiesByUsers',
            scope: {
              include: [{relation: 'disabilitiesByUsersDisabilities'}],
            },
          },
          {
            relation: 'usersSpecifications',
          },
        ],
      };
    } else {
      filterEvaluators = {
        where: {
          and: [
            {
              roleTypesId: eawConstants.EVALUATOR_ROLE_ID,
            },
            {
              isActive: isActive,
            },
          ],
        },
        include: [
          {
            relation: 'usersDisabilitiesByUsers',
            scope: {
              include: [{relation: 'disabilitiesByUsersDisabilities'}],
            },
          },
          {
            relation: 'usersSpecifications',
          },
        ],
      };
    }
    try {
      const evaluatorsList = await app.models.Users.find(filterEvaluators);
      _this.returnObj.results = await cleanEvaluators(evaluatorsList);
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to handle errors .
   */
  function handleError(reportErrorObj, error) {
    reportErrorObj.hasError = true;
    reportErrorObj.messages.push(error.toString());
    return error.toString();
  }

  /**
   * Delete unnecessary fields on evaluator object.
   * @param {*} evaluatorsList
   */
  function cleanEvaluators(evaluatorsList) {
    let results = [];
    let cleanedEvaluator = {};
    for (let evaluator of evaluatorsList) {
      cleanedEvaluator = evaluator;
      cleanedEvaluator.disabilities = cleanDisabilities(
        evaluator.toJSON().usersDisabilitiesByUsers,
      );
      cleanedEvaluator.evaluationsCompleted = countEvaluationsCompleted(
        evaluator.toJSON().usersSpecifications,
      );

      results.push(cleanedEvaluator);
    }
    return results;
  }

  /**
   * Function to clean disability arrays of an evaluator.
   * Delete unnecesary fields of disability objects
   * @param {*} disabilitiesArray
   */
  function cleanDisabilities(disabilitiesArray) {
    let cleanedDisabilities = [];
    disabilitiesArray.map(disability => {
      cleanedDisabilities.push({
        id: disability.disabilitiesByUsersDisabilities.id,
        name: disability.disabilitiesByUsersDisabilities.name,
      });
    });
    return cleanedDisabilities;
  }

  /**
   * Count total evaluations completed by an evaluator .
   * @param {*} specificationsArray
   */
  function countEvaluationsCompleted(specificationsArray) {
    const agroupedSpecifications = _.groupBy(
      specificationsArray,
      'evaluationsId',
    );
    let finishCounter = 0;
    for (const values of Object.values(agroupedSpecifications)) {
      if (areAllFinish(values)) {
        finishCounter++;
      }
    }
    return finishCounter;
  }

  /**
   * Verify if all especifications are completed => state = 2
   * @param {*} specifications
   */
  function areAllFinish(specifications) {
    for (const specification of specifications) {
      if (specification.state !== eawConstants.EvaluationStates.FINISHED) {
        return false;
      }
    }
    return true;
  }

  /**
   * Function to post an Evaluator
   * @param newEvaluator to post in the db
   */
  this.postNewEvaluator = async function(newEvaluator) {
    const userModel = app.models.Users;
    const disabilitiesByUserModel = app.models.DisabilitiesByUsers;

    let _this = this;
    _this.returnObj = {
      results: {},
      messages: [],
      hasError: false,
    };

    try {
      const userCreated = await userModel.create(newEvaluator).then(newUser => {
        const usersSharedService = new UsersSharedService();
        usersSharedService.notifyUserCreated(newUser);
        return newUser;
      });
      for (let disabilityId of newEvaluator.disabilities) {
        disabilitiesByUserModel.create({
          usersId: userCreated.id,
          disabilitiesId: disabilityId,
        });
      }
      _this.returnObj.results = userCreated;
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to update an evaluator
   * @param evaluatorToUpdate JSON support tool ti update
   */
  this.updateEvaluator = async function(evaluatorToUpdate) {
    const userModel = app.models.Users;
    const disabilitiesByUserModel = app.models.DisabilitiesByUsers;
    let _this = this;
    _this.returnObj = {
      results: {},
      messages: [],
      hasError: false,
    };
    try {
      const evaluatorUpdated = await userModel.update(
        {
          id: evaluatorToUpdate.id,
        },
        _.omit(evaluatorToUpdate, 'password'),
      );
      await disabilitiesByUserModel.destroyAll({
        usersId: evaluatorToUpdate.id,
      });
      for (let disabilityId of evaluatorToUpdate.disabilities) {
        disabilitiesByUserModel.create({
          usersId: evaluatorToUpdate.id,
          disabilitiesId: disabilityId,
        });
      }
      _this.returnObj.results = evaluatorUpdated;
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };
}

module.exports = EvaluatorManager;
