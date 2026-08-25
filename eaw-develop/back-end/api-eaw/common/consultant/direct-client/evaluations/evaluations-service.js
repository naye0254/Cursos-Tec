'use strict';

const CustomErrorLog = require('../../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../../eaw-constants');
const _ = require('lodash');

const app = require('../../../../server/server');

/**
 * Contains indirect client evaluations services.
 */
module.exports = class EvaluationsService {
  constructor() {
    this.eawConstants = new EAWConstants();
  }

  /**
   * Get a list of years of the evaluations
   *
   */
  async getYearsOfEvaluations() {
    const evaluationModel = app.models.Evaluations;
    const listEvaluations = [];
    const listYears = [];
    const returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    try {
      const evaluations = await evaluationModel.find();
      for (let evaluation of evaluations) {
        evaluation = evaluation.toJSON();
        const year = new Date(evaluation.createdAt).getFullYear();
        evaluation.year = year;
        listEvaluations.push(evaluation);
      }
      const agroupedEvaluations = _.groupBy(listEvaluations, 'year');
      for (const values of Object.keys(agroupedEvaluations)) {
        const year = {name: values, id: values};
        listYears.push(year);
      }
      returnObj.results = listYears;
    } catch (error) {
      throw this.handleError(error, 'getYearsOfEvaluations');
    }
    return returnObj;
  }

  async getIndirectClientsByClient(clientId, year, segmentId) {
    const evaluationModel = app.models.Evaluations;
    const indirectClients = [];
    const returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    const filter = {
      where: {
        and: [{clientsId: clientId}, {segmentsId: segmentId}],
      },
    };

    try {
      const evaluations = await evaluationModel.find(filter);

      const agroupedEvaluations = _.groupBy(evaluations, 'siteName');
      for (const values of Object.keys(agroupedEvaluations)) {
        const client = {name: values, id: values};
        indirectClients.push(client);
      }
      returnObj.results = indirectClients;
    } catch (error) {
      throw this.handleError(error, 'getYearsOfEvaluations');
    }
    return returnObj;
  }

  async getEvaluationsByIndirectClient(
    clientId,
    year,
    segmentId,
    indirectClient,
  ) {
    const evaluationModel = app.models.Evaluations;
    const returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };

    const filter = {
      where: {
        and: [
          {clientsId: clientId},
          {segmentsId: segmentId},
          {siteName: indirectClient},
          {
            createdAt: new RegExp('^' + year),
          },
        ],
      },
      include: [
        {
          relation: 'evaluationsCreatedUser',
        },
        {
          relation: 'evaluationsSpecifications',
          scope: {
            include: [{relation: 'specificationsUsers'}],
          },
        },
        {
          relation: 'evaluationsDates',
        },
        {
          relation: 'evaluationsSegments',
        },
        {
          relation: 'evaluationsPackages',
        },
      ],
    };

    try {
      const evaluations = await evaluationModel.find(filter);
      let evaluationToList = {};

      let evaluatorsChecked = [];
      for (let evaluation of evaluations) {
        evaluatorsChecked = [];
        evaluation = evaluation.toJSON();
        evaluationToList = _.omit(evaluation, [
          'evaluationsCreatedUser',
          'evaluationsSpecifications',
          'evaluationsDates',
        ]);
        evaluationToList.evaluators = '';
        evaluationToList.especificationsQuantity =
          evaluation.evaluationsSpecifications.length;
        evaluation.evaluationsSpecifications.map(specification => {
          if (
            evaluatorsChecked.find(
              evaluator => evaluator.id == specification.specificationsUsers.id,
            ) === undefined
          ) {
            evaluationToList.evaluators +=
              specification.specificationsUsers.firstName +
              ' ' +
              specification.specificationsUsers.lastName +
              ', ';
            evaluatorsChecked.push(specification.specificationsUsers);
          }
        });
        evaluationToList.inCharge = {
          id: evaluation.evaluationsCreatedUser.id,
          firstName: evaluation.evaluationsCreatedUser.firstName,
          lastName: evaluation.evaluationsCreatedUser.lastName,
        };
        returnObj.results.push(evaluationToList);
      }
    } catch (error) {
      throw this.handleError(error, 'getEvaluationsByIndirectClient');
    }
    return returnObj;
  }

  /**
   * Return an evaluation by id
   *
   */
  async getEvaluationById(evaluationId) {
    const evaluationModel = app.models.Evaluations;
    const returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    try {
      const evaluation = await evaluationModel.findOne({
        where: {
          id: evaluationId,
        },
        fields: {
          siteMap: false,
          selectedSiteMap: false,
        },
        include: [
          {
            relation: 'evaluationsPackages',
          },
        ],
      });
      returnObj.results = evaluation;
    } catch (error) {
      throw this.handleError(error, 'getEvaluationById');
    }
    return returnObj;
  }

  /**
   * Return an evaluation by id
   *
   */
  async getPagesByEvaluation(evaluationId) {
    const pagesModel = app.models.Pages;
    const returnObj = {
      results: [],
      messages: [],
      hasError: false,
    };
    try {
      const evaluation = await pagesModel.find({
        where: {
          evaluationsId: evaluationId,
        },
      });
      returnObj.results = evaluation;
    } catch (error) {
      throw this.handleError(error, 'getPagesByEvaluation');
    }
    return returnObj;
  }

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  handleError(error, functionName = '') {
    new CustomErrorLog(
      'BE > NotificationSharedService > ' + functionName,
      error,
    ).saveError();
    return error;
  }
};
