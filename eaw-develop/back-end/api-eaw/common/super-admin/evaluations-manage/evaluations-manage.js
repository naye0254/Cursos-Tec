'use strict';

const app = require('../../../server/server');

const _ = require('lodash');
const EAWConstants = require('../../eaw-constants');

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const ReportStatisticsData = require('../../consultant/reports/graphics/report-statistics-data');
const ReportGraphics = require('../../consultant/reports/graphics/report-graphics');
const ConsultantStatistics = require('../../consultant/statistict/consultant-statistics');
const FileSystem = require("fs");

/**
 * Manage evaluations model services logic.
 */
function EvaluationsManager() {
  const eawConstants = new EAWConstants();

  /**
   * Function to get all evaluations by state
   * @param isActive indicate the mode of support tools to get
   */
  this.getAllEvaluations = async function(state, limit = null, skip = 0) {
    const evaluationsModel = app.models.Evaluations;
    let _this = this;
    _this.returnObj = {
      messages: [],
      hasError: false,
      count: 0,
      results: []
    };
    const condition =
      state !== 'null'
        ? {
            or: [
              {manualEvaluationState: state, scrapingState: { neq: -1 }, isDeleted: 0},
              {automaticEvaluationState: state, scrapingState: { neq: -1 }, isDeleted: 0},
            ]
          }
        : {};
    _this.returnObj.count = await evaluationsModel.count(condition);

    const filterEvaluations = {
      where: condition,
      fields: {
        siteMap: false,
        selectedSiteMap: false,
        updatedBy: false,
        domain: false,
        sendedResults: false
      },
      include: [
        {
          relation: 'evaluationsCreatedUser'
        },
        {
          relation: 'evaluationsSpecifications',
          scope: {
            include: [{relation: 'specificationsUsers'}]
          }
        },
        {
          relation: 'evaluationsDates'
        },
        {
          relation: 'evaluationsSegments'
        }
      ],
      order: 'id DESC',
      limit: limit,
      skip: skip
    };
    if (state !== 'null') {
      filterEvaluations.include.push({
        relation: 'evaluationsPackages'
      });
    }

    try {
      const evaluationsData = await evaluationsModel.find(filterEvaluations);
      let evaluationToList = {};
      let evaluatorsChecked = [];
      for (let evaluation of evaluationsData) {
        evaluatorsChecked = [];
        evaluation = evaluation.toJSON();
        evaluationToList = _.omit(evaluation, [
          'evaluationsCreatedUser',
          'evaluationsSpecifications'
        ]);
        evaluationToList.evaluators = '';
        evaluationToList.especificationsQuantity = evaluation.evaluationsSpecifications.length;
        evaluation.evaluationsSpecifications.map(specification => {
          if (
            evaluatorsChecked.find(
              evaluator => evaluator.id == specification.specificationsUsers.id
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
        if (evaluation.evaluationsDates[0]) {
          evaluationToList.remainingDays = getBusinessDatesCount(
            new Date(),
            evaluation.evaluationsDates[0].expirationDate
          );
        }
        evaluationToList.inCharge = {
          id: evaluation.evaluationsCreatedUser.id,
          firstName: evaluation.evaluationsCreatedUser.firstName,
          lastName: evaluation.evaluationsCreatedUser.lastName
        };
        if (state === 2) {
          if (evaluation.packagesId === 4) {
            if (
              evaluation.manualEvaluationState === state &&
              evaluation.automaticEvaluationState === state
            ) {
              _this.returnObj.results.push(evaluationToList);
            }
          } else {
            _this.returnObj.results.push(evaluationToList);
          }
        } else {
          _this.returnObj.results.push(evaluationToList);
        }
      }
    } catch (error) {
      throw handleError(_this.returnObj, error);
    }
    return _this.returnObj;
  };

    /**
     * Get evaluations by evaluator and state
     * @param evaluatorId
     */
    this.getEvaluationsByEvaluatorAndState = async function(evaluatorId, state) {
      const evaluationsModel = app.models.Evaluations;
      let _this = this;
      _this.returnObj = {
        messages: [],
        hasError: false,
        count: 0,
        results: []
      };
      let filterEvaluations = {
        fields: {
          siteMap: false,
          selectedSiteMap: false,
          sendedResults: false
        },
        where: {
          and: [
            {manualEvaluationState: state, isDeleted: 0},
            {scrapingState: eawConstants.ScrapingStates.FINISHED, isDeleted: 0}
          ]
        },
        include: [
          {
            relation: 'evaluationsCreatedUser'
          },
          {
            relation: 'evaluationsSpecifications',
            scope: {
              include: [{relation: 'specificationsUsers'}]
            }
          },
          {
            relation: 'evaluationsDates'
          }
        ]
      };
      try {
        const evaluationsData = await evaluationsModel.find(filterEvaluations);
        let evaluationToList = {};
        const currentDate = new Date();
        let evaluatorsChecked = [];
        for (let evaluation of evaluationsData) {
          evaluatorsChecked = [];
          let mustBeIncluded = false;
          evaluation = evaluation.toJSON();
          evaluationToList = _.omit(evaluation, [
            'evaluationsCreatedUser',
            'evaluationsSpecifications',
            'evaluationsDates'
          ]);
          evaluationToList.evaluators = '';
          evaluationToList.especificationsQuantity = evaluation.evaluationsSpecifications.length;
          evaluation.evaluationsSpecifications.map(specification => {
            if (evaluatorId == specification.specificationsUsers.id) {
              mustBeIncluded = true;
            }
            if (
              evaluatorsChecked.find(
                evaluator => evaluator.id == specification.specificationsUsers.id
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
          evaluationToList.remainingDays = getBusinessDatesCount(
            currentDate,
            new Date(evaluation.evaluationsDates[0].expirationDate)
          );
          evaluationToList.inCharge = {
            id: evaluation.evaluationsCreatedUser.id,
            firstName: evaluation.evaluationsCreatedUser.firstName,
            lastName: evaluation.evaluationsCreatedUser.lastName
          };
          if (mustBeIncluded) {
            _this.returnObj.results.push(evaluationToList);
          }
        }
        _this.returnObj.count = _this.returnObj.results.length;
      } catch (error) {
        throw handleError(_this.returnObj, error);
      }
      return _this.returnObj;
    };

    /**
   * Function to extract all evaluations data needed for statistics graphs in a JSON file.
   * 
  */
  this.getEvaluationsStatistics = async function(){
    const evaluationsModel = app.models.Evaluations;
    const segmentsModel = app.models.Segments;
    const tagsModel = app.models.Tags;
    const guidelinesModel = app.models.Guidelines;
    const reportStatisticsData = new ReportStatisticsData();
    const eAWConstants = new EAWConstants();
    const consultantStatistics = new ConsultantStatistics();
    const returnObj = {
      messages: [],
      hasError: false,
      count: 0,
      results: []
    };
    try {
      const pautas = await guidelinesModel.find();
      /* evaluationsModel.fin({}) permite filtrar o limitar los resultados
        en caso de que se necesite solo ciertas evaluaciones o una cantidad
        fija para el archivo JSON
      */
      const evaluationData = await evaluationsModel.find({limit: 1000 });
      // Por cada evaluacion
      for (let evaluation of evaluationData) {
        // 1. Traducir el año

        const dateObject = new Date(evaluation.createdAt);
        const evaluationYear = dateObject.getFullYear();
        
        // 2. Traducir el segmento
        
        const segmentoData = await segmentsModel.find({ where: { id : evaluation.segmentsId } });
        
        // 3. Traducir la etiqueta
        
        const tagData = await tagsModel.find({ where: { id : evaluation.tagId } });
        
        // 4. Agregar estadisticas
        
        //4.1 Estadisticas de incumplimiento y cumplimiento
        let type = eAWConstants.GeneralGraphicDataTypes.BOTH;
        const statisticsData = await reportStatisticsData.getGeneralAccesibilityGraphicData(evaluation.id, type);
        const incumplimientoStat = statisticsData.results.yVariableList[0].data[0];
        const cumplimientoStat = statisticsData.results.yVariableList[0].data[1];
        
        //4.2 Estadisticas por pautas

        // 4.2.1 Limpiar las cifras anteriores
        for (let i = 0; i < pautas.length; i++) {
          pautas[i].noCumple = 0;
          pautas[i].advertencias = 0;
          pautas[i].hallazgos = 0;
        }
        //4.2.2 Conseguir las estadisticas por pautas
        const objeto = await consultantStatistics.getStatisticsByGuideLineAutomatic(evaluation.id);
        objeto.results.xVariableList.forEach((element, index) => {
          let qNoCumple = objeto.results.yVariableList[0].data[index];
          let qAdvertencias = objeto.results.yVariableList[1].data[index];
          const indexPauta = pautas.findIndex(pauta => pauta.numberGuidelines+' - '+pauta.name === element);
          //4.2.3 Escribir los cifras
          if (indexPauta !== -1){
            pautas[indexPauta].noCumple = qNoCumple;
            pautas[indexPauta].advertencias = qAdvertencias;
            pautas[indexPauta].hallazgos = qNoCumple + qAdvertencias;
          }
        });

        //5. Fijar los datos de la evaluacion
        returnObj.results.push({
          nombre: evaluation.siteName,
          segmento: segmentoData[0].name,
          etiqueta: tagData[0].name,
          url: evaluation.mainUrl,
          year: evaluationYear,
          incumplimiento: incumplimientoStat,
          cumplimiento: cumplimientoStat,
          '1.1 - Alternativas Textuales': pautas[0].hallazgos,
          '1.2 - Multimedia': pautas[1].hallazgos,
          '1.3 - Adaptable': pautas[2].hallazgos,
          '1.4 - Distinguible': pautas[3].hallazgos,
          '2.1 - Teclado accesible': pautas[4].hallazgos,
          '2.2 - Tiempo suficiente': pautas[5].hallazgos,
          '2.3 - Ausencia de efectos dañinos': pautas[6].hallazgos,
          '2.4 - Navegable': pautas[7].hallazgos,
          '3.1 - Legible': pautas[8].hallazgos,
          '3.2 - Predecible': pautas[9].hallazgos,
          '3.3 - Entrada de datos asistida': pautas[10].hallazgos,
          '4.1 - Compatibilidad actual y futura': pautas[11].hallazgos,
          '2.5 - Modalidades de entrada': pautas[12].hallazgos,
        });
      }
      returnObj.count = Object.keys(evaluationData).length;
    } catch (error) {
      throw handleError(returnObj, error);
    }
    // JSON file can be converted to csv using 'json2csv' node library
    FileSystem.writeFile('prueba1000.json', JSON.stringify(returnObj.results), (err) => {
      if (err) throw err;
    });
    //return returnObj.results;
    // This should return the file to be downloaded but for now stick with storing in server
    // until better implementation is achieved. (Matter of urgency)
  };
  /**
 * 
 * @param jsonData 
 * @param fileName 
 */
  function exportToExcel(jsonData, fileName) {
    // Convert JSON data to CSV format
    const csvData = convertJsonToCsv(jsonData);
    
    // Create a Blob object from the CSV data
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    
    // Create a URL object from the Blob object
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element and set its attributes
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    
    // Programmatically click the anchor element to trigger the download
    link.click();
  }


/**
 * 
 * @param jsonData 
 * @returns 
 */
  function convertJsonToCsv(jsonData) {
    // Convert JSON data to CSV format
    const header = Object.keys(jsonData[0]).join(',') + '\n';
    const rows = jsonData.map((data) => Object.values(data).join(',') + '\n');
    return header + rows.join('');
  }


    /**
     * Get all failed evaluations
     */
    this.getAllFailedEvaluations = async function(state, limit = null, skip = 0) {
      const evaluationsModel = app.models.Evaluations;
      let _this = this;
      _this.returnObj = {
        messages: [],
        hasError: false,
        count: 0,
        results: []
      };
      const condition =
        state !== 'null'
          ? {
              or: [
                {manualEvaluationState: eawConstants.EvaluationStates.FAILED, isDeleted: 0},
                {automaticEvaluationState: eawConstants.EvaluationStates.FAILED, isDeleted: 0},
                {scrapingState: eawConstants.ScrapingStates.FAILED, isDeleted: 0}
              ]
            }
          : {};
      _this.returnObj.count = await evaluationsModel.count(condition);
  
      const filterEvaluations = {
        where: condition,
        fields: {
          siteMap: false,
          selectedSiteMap: false,
          updatedBy: false,
          domain: false,
          sendedResults: false
        },
        include: [
          {
            relation: 'evaluationsCreatedUser'
          },
          {
            relation: 'evaluationsSpecifications',
            scope: {
              include: [{relation: 'specificationsUsers'}]
            }
          },
          {
            relation: 'evaluationsDates'
          },
          {
            relation: 'evaluationsSegments'
          }
        ],
        order: 'id DESC',
        limit: limit,
        skip: skip
      };
      if (state !== 'null') {
        filterEvaluations.include.push({
          relation: 'evaluationsPackages'
        });
      }
  
      try {
        const evaluationsData = await evaluationsModel.find(filterEvaluations);
        let evaluationToList = {};
        let evaluatorsChecked = [];
        for (let evaluation of evaluationsData) {
          evaluatorsChecked = [];
          evaluation = evaluation.toJSON();
          evaluationToList = _.omit(evaluation, [
            'evaluationsCreatedUser',
            'evaluationsSpecifications'
          ]);
          evaluationToList.evaluators = '';
          evaluationToList.especificationsQuantity = evaluation.evaluationsSpecifications.length;
          evaluation.evaluationsSpecifications.map(specification => {
            if (
              evaluatorsChecked.find(
                evaluator => evaluator.id == specification.specificationsUsers.id
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
          if (evaluation.evaluationsDates[0]) {
            evaluationToList.remainingDays = getBusinessDatesCount(
              new Date(),
              evaluation.evaluationsDates[0].expirationDate
            );
          }
          evaluationToList.inCharge = {
            id: evaluation.evaluationsCreatedUser.id,
            firstName: evaluation.evaluationsCreatedUser.firstName,
            lastName: evaluation.evaluationsCreatedUser.lastName
          };
          if (state === 2) {
            if (evaluation.packagesId === 4) {
              if (
                evaluation.manualEvaluationState === state &&
                evaluation.automaticEvaluationState === state
              ) {
                _this.returnObj.results.push(evaluationToList);
              }
            } else {
              _this.returnObj.results.push(evaluationToList);
            }
          } else {
            _this.returnObj.results.push(evaluationToList);
          }
        }
      } catch (error) {
        throw handleError(_this.returnObj, error);
      }
      return _this.returnObj;
    };

  /**
   * Functions to get bussiness date of interval of dates
   * @param {*} startDate
   * @param {*} endDate
   */
  function getBusinessDatesCount(startDate, endDate) {
    let count = 0;
    let curDate = startDate;
    while (curDate <= endDate) {
      let dayOfWeek = curDate.getDay();
      if (!(dayOfWeek == 6 || dayOfWeek == 0)) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }

  /**
   * Get diferent states by evaluation
   * @param {*} idEvaluation
   */
  this.statesByEvaluation = async function(idEvaluation) {
    let returnObj = {results: {}, count: null, message: []};

    try {
      let evaluation = await app.models.Evaluations.findOne({
        where: {
          id: idEvaluation
        },
        fields: {
          evaluationCode: true,
          scrapingState: true,
          automaticEvaluationState: true,
          pagesChoosed: true,
          managerialReportState: true,
          technicalReportState: true
        }
      });
      evaluation = await JSON.parse(JSON.stringify(evaluation));

      returnObj.results = evaluation;
    } catch (error) {
      returnObj.count = -1;
      new CustomErrorLog('evaluations-manage/statesByEvaluation', error, idEvaluation).saveError();
    }

    return await returnObj;
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

module.exports = EvaluationsManager;
