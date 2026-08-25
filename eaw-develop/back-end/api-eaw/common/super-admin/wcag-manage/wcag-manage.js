'use strict';

const app = require('../../../server/server');
const EAWConstants = require('../../eaw-constants');
const _ = require('lodash');

/**
 * Manage criterions model services logic.
 */
function WcagManager() {
  const eawConstants = new EAWConstants();

  /**
   * Function to get all criterions by state
   * @param isActive indicate the mode of support tools to get
   */
  this.getAllCriterionsByState = async function(isActive) {
    const criterionsModel = app.models.Criterions;
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    let filterCriterions = {};
    if (isActive === `'null'`) {
      filterCriterions = {
        include: [
          {
            relation: 'criterionsGuidelines',
            scope: {
              include: [{relation: 'guidelinesPrinciples'}],
            },
          },
          {
            relation: 'disabilities',
            scope: {
              include: [
                {relation: 'criterionsByDisabilityRolesDisabilityRoles'},
              ],
            },
          },
        ],
      };
    } else {
      filterCriterions = {
        where: {
          isActive: isActive,
        },
        include: [
          {
            relation: 'criterionsGuidelines',
            scope: {
              include: [{relation: 'guidelinesPrinciples'}],
            },
          },
          {
            relation: 'disabilities',
            scope: {
              include: [
                {relation: 'criterionsByDisabilityRolesDisabilityRoles'},
              ],
            },
          },
        ],
      };
    }
    try {
      const criterionsData = await criterionsModel.find(filterCriterions);
      let criterionToList = {};
      for (let criterion of criterionsData) {
        criterion = criterion.toJSON();
        criterionToList = _.omit(criterion, 'criterionsGuidelines');
        criterionToList.guideLine = {
          name:
            criterion.criterionsGuidelines.numberGuidelines +
            ' ' +
            criterion.criterionsGuidelines.name,
          id: criterion.criterionsGuidelines.id,
        };
        criterionToList.principle = {
          name: criterion.criterionsGuidelines.guidelinesPrinciples.name,
          id: criterion.criterionsGuidelines.guidelinesPrinciples.id,
        };
        criterionToList.disabilities = [];
        criterion.disabilities.map(disability => {
          criterionToList.disabilities.push({
            id: disability.criterionsByDisabilityRolesDisabilityRoles.id,
            name: disability.criterionsByDisabilityRolesDisabilityRoles.name,
          });
        });
        _this.returnObj.results.push(criterionToList);
      }
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to get all guideline by principle
   * @param principleId indicate the principle of the guide lines to get
   */
  this.getGuidesByPrinciple = async function(principleId) {
    const guideLinesModel = app.models.Guidelines;
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    let filterGuideLine = {
      where: {principlesId: principleId},
    };
    try {
      _this.returnObj.results = await guideLinesModel.find(filterGuideLine);
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to register new criterion
   * @param newCriterion JSON to create criterion with al dependecies
   */
  this.postNewCriterion = async function(newCriterion) {
    const criterionsModel = app.models.Criterions;
    const criterionsByDisabilityRoles = app.models.CriterionsByDisabilityRoles;
    let _this = this;
    _this.returnObj = {
      results: {},
      messages: [],
      hasError: false,
    };
    try {
      const criterionCreated = await criterionsModel.create(newCriterion);
      for (let disabilityId of newCriterion.disabilities) {
        criterionsByDisabilityRoles.create({
          criterionsId: criterionCreated.id,
          disabilitiesId: disabilityId,
        });
      }
      _this.returnObj.results = criterionCreated;
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Function to update criterion
   * @param criterionToUpdate JSON criterion ti update
   */
  this.updateCriterion = async function(criterionToUpdate) {
    const criterionsModel = app.models.Criterions;
    const criterionsByDisabilityRolesModel =
      app.models.CriterionsByDisabilityRoles;
    let _this = this;
    _this.returnObj = {
      results: {},
      messages: [],
      hasError: false,
    };
    try {
      const criterionUpdated = await criterionsModel.update(
        {
          id: criterionToUpdate.id,
        },
        criterionToUpdate,
      );
      await criterionsByDisabilityRolesModel.destroyAll({
        criterionsId: criterionToUpdate.id,
      });
      for (let disabilityId of criterionToUpdate.disabilities) {
        criterionsByDisabilityRolesModel.create({
          criterionsId: criterionToUpdate.id,
          disabilitiesId: disabilityId,
        });
      }
      _this.returnObj.results = criterionUpdated;
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Manage the exeption
   * @param {*} reportErrorObj object to report the error
   * @param {*} error error
   */
  function handleError(reportErrorObj, error) {
    reportErrorObj.hasError = true;
    reportErrorObj.messages.push(error.toString());
    return error.toString();
  }
}

module.exports = WcagManager;
