'use strict';

const app = require('../../../server/server');
const EAWConstants = require('../../eaw-constants');

/**
 * Manage specifications model services logic.
 */
function SpecificationsManager() {
  /**
   * Function list specifications by evaluator and evaluators
   * Calculates the total pages complete and te percentage completed
   */
  this.getSpecificationsByEvaluationAndEvaluator = async function(
    evaluationsId,
    evaluatorsId,
  ) {
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };

    let whereClause = {};
    if (evaluatorsId) {
      whereClause = {
        evaluationsId: evaluationsId,
        usersId: evaluatorsId,
      };
    } else {
      whereClause = {
        evaluationsId: evaluationsId,
      };
    }

    let filterEvaluators = {
      where: whereClause,
      include: [
        {
          relation: 'specificationsBrowsers',
        },
        {
          relation: 'specificationsDevices',
        },
        {
          relation: 'specificationsOperativeSystems',
        },
        {
          relation: 'specificationsSupportTools',
        },
      ],
    };
    try {
      const specifications = await app.models.Specifications.find(
        filterEvaluators,
      );
      if (evaluatorsId) {
        let specificationsToReturn = [];
        for (let specification of specifications) {
          specification = specification.toJSON();
          specification.finishedPages = await countFinishedPagesBySpecification(
            specification.id,
          );
          const pagesList = await app.models.SpecificationsByManualPages.find({
            where: {
              specificationsId: specification.id,
            },
          });
          specification.totalPages = pagesList.length;
          specification.isSelected = false;
          if (!checkEqualSpect(specification, specificationsToReturn)) {
            specificationsToReturn.push(specification);
          }
          if (specification.totalPages > 0) {
            specification.percentageComplete =
              (specification.finishedPages / specification.totalPages) * 100;
          }
        }
        _this.returnObj.results = specificationsToReturn;
      } else {
        _this.returnObj.results = specifications;
      }
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  function checkEqualSpect(spect, array) {
    let match = false;
    array.forEach(spectInArray => {
      let equalCount = 0;
      if (spect.browsersId === spectInArray.browsersId) {
        equalCount++;
      }
      if (spect.devicesId === spectInArray.devicesId) {
        equalCount++;
      }
      if (spect.operativeSystemsId === spectInArray.operativeSystemsId) {
        equalCount++;
      }
      if (spect.supportToolsId === spectInArray.supportToolsId) {
        equalCount++;
      }

      if (equalCount === 4) {
        match = true;
      }
    });
    if (match) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Count the evaluations finished
   * @param {*} specificationId
   */
  async function countFinishedPagesBySpecification(specificationId) {
    const eawConstants = new EAWConstants();
    let filterEvaluators = {
      where: {
        specificationsId: specificationId,
      },
      include: [
        {
          relation: 'SpecificationsByManualPagesManualPages',
        },
      ],
    };
    const specifications = await app.models.SpecificationsByManualPages.find(
      filterEvaluators,
    );
    let finishedPages = 0;
    for (let specification of specifications) {
      specification = specification.toJSON();
      if (
        specification.SpecificationsByManualPagesManualPages
          .evaluationPageState == eawConstants.EvaluationGeneralStates.FINISHED
      ) {
        finishedPages++;
      }
    }
    return finishedPages;
  }

  /**
   * Get pages list by specification
   * @param specificationId
   */
  this.getPagesBySpecificationId = async function(specificationId) {
    let _this = this;
    _this.returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    let filter = {
      where: {
        specificationsId: specificationId,
      },
      include: [
        {
          relation: 'SpecificationsByManualPagesManualPages',
          scope: {
            include: [
              {
                relation: 'manualPagesPages',
              },
            ],
          },
        },
      ],
    };
    try {
      const specifications = await app.models.SpecificationsByManualPages.find(
        filter,
      );
      const pages = [];
      for (let specification of specifications) {
        specification = specification.toJSON();

        const page = Object.assign(
          {},
          specification.SpecificationsByManualPagesManualPages.manualPagesPages,
        );
        page.evaluationPageState =
          specification.SpecificationsByManualPagesManualPages.evaluationPageState;
        page.manualPageId = specification.manualPagesId;
        pages.push(page);
      }
      _this.returnObj.results = pages;
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

  /**
   * Return the disabilities assigned to an evaluation
   *
   */
  this.getDisabilitiesByEvaluation = async function(evaluationId) {
    const specificationsModel = app.models.Specifications;
    const returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    try {
      const specifications = await specificationsModel.find({
        where: {
          evaluationsId: evaluationId,
        },
        include: [
          {
            relation: 'specificationsDisabilities',
          },
        ],
      });
      const disabilities = [];
      for (let specification of specifications) {
        specification = specification.toJSON();
        disabilities.push(specification.specificationsDisabilities);
      }
      returnObj.results = disabilities;
    } catch (error) {
      throw this.handleError(error, 'getDisabilitiesByEvaluation');
    }
    return returnObj;
  };

  /**
   * Function to handle errors .
   */
  function handleError(reportErrorObj, error) {
    reportErrorObj.hasError = true;
    reportErrorObj.messages.push(error.toString());
    return error.toString();
  }
}

module.exports = SpecificationsManager;
