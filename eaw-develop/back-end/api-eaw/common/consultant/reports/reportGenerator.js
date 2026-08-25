'use strict';

const app = require('../../../server/server');
const CustomTex = require('./customLaTex');
const fs = require('fs');
const {join} = require('path');
const latex = require('node-latex');
const request = require('request');
const http = require('http');

const CustomErrorLog = require('../../shared/shared-services/errorLog-shared-services');
const EAWConstants = require('../../eaw-constants');
const ReportNotificationsServices = require('../../administrator/report-notifications/report-notifications');
const PromoterEvaluationsManager = require('../../administrator/evaluations-manage/evaluations-manage');

function ReportGenerator() {
  const eAWConstants = new EAWConstants();
  const reportNotificationsServices = new ReportNotificationsServices();

  const automaticDescriptionsModel = app.models.AutomaticDescriptions;
  const criterionsModel = app.models.Criterions;
  const datesByEvaluationsModel = app.models.DatesByEvaluations;
  const evaluationModel = app.models.Evaluations;
  const findingsModel = app.models.Findings;
  const manualAnswersModel = app.models.ManualAnswers;
  const manualPagesModel = app.models.ManualPages;
  const noticesModel = app.models.Notices;
  const pagesModel = app.models.Pages;
  const principlesModel = app.models.Principles;
  const recommendationsModel = app.models.Recommendations;
  const reportsModel = app.models.Reports;
  const specificationsModel = app.models.Specifications;
  const IP_MASTER_NODE = process.env.ERP_DB_HOST_MYSQL_MASTER_NODE;

  /**
   * Function to verify if the evaluation and the code corresponse with Jasper.
   */
  this.generateReportSecurityFilter = async (idEvaluation, code) => {
    const returnObj = {
      results: {},
      count: null,
      message: ['Generating reports...'],
    };
    const evaluation = await evaluationModel.findOne({
      where: {
        and: [{id: idEvaluation}, {evaluationCode: code}],
      },
    });
    if (evaluation == null) {
      throw handleError(
        await new Error(
          'Invalid id or evaluation code for statistics. (Jasper)',
        ),
        'generateReportSecurityFilter',
        idEvaluation,
      );
    } else {
      this.generateReportJasper(idEvaluation);
      return returnObj;
    }
  };

   /**
   * Function to get list of evaluations in range and generate the reports.
   * @param minIdEvaluation this parameter is used to store the id at the 
   * start of the range of evaluations to generate reports.
   * @param maxIdEvaluation this parameter is used to store the id at the end
   * of the range of evalations to generate reports.
   */  
    this.generateReportEvaluationInIdRange = async (min, max) => {
      const returnObj = {
        results: {},
        count: null,
        message: ['Generating reports in range...'],
      };
      const evaluationList = await evaluationModel.find({ 
        where: { 
          id: { between: [min, max] } 
        } 
      });
      if(evaluationList != null){
        for(const evaluation of evaluationList){
          if (evaluation == null) {
            throw handleError(
              await new Error(
                'Invalid id or evaluation code for statistics. (Latex)',
              ),
              'generateReportEvaluationInIdRange',
              evaluation.id,
            );
          } else {
            try {
              await this.generateReportSecurityFilter(evaluation.id,evaluation.evaluationCode);
            } catch (error) {
              return false;
            }
          }
        }    
      }
      return returnObj;
    };


  /**
   * Function to verify if the evaluation and the code corresponse with Latex.
   */
  this.generateReportSecurityFilterWithLatex = async (idEvaluation, code) => {
    const returnObj = {
      results: {},
      count: null,
      message: ['Generating reports...'],
    };
    const evaluation = await evaluationModel.findOne({
      where: {
        and: [{id: idEvaluation}, {evaluationCode: code}],
      },
    });
    if (evaluation == null) {
      throw handleError(
        await new Error(
          'Invalid id or evaluation code for statistics. (Latex)',
        ),
        'generateReportSecurityFilter',
        idEvaluation,
      );
    } else {
      this.generateReport(idEvaluation);
      return returnObj;
    }
  };

  /**
   * Main function start the report generation process.
   * @param {number} idEvaluation
   */
  this.generateReport = async idEvaluation => {
    try {
      await reportsModel.create({
        evaluationsId: idEvaluation,
      });
      await evaluationModel.update(
        {id: idEvaluation},
        {managerialReportState: eAWConstants.ReportStates.PROGRESS},
      );
      await generateTEX(idEvaluation, eAWConstants.ReportType.MANAGERIAL);

      const managerialPath = await generatePDF(
        idEvaluation,
        eAWConstants.ReportType.MANAGERIAL,
      ).then(async generatedReportPath => {
        if (await isSlaveAndActive()) {
          await loadAndSendReport('managerial');
        }
        return generatedReportPath;
      });
      await reportsModel.update(
        {evaluationsId: idEvaluation},
        {managerialReportPath: managerialPath},
      );
      await evaluationModel.update(
        {id: idEvaluation},
        {
          managerialReportState: eAWConstants.ReportStates.FINISHED,
          technicalReportState: eAWConstants.ReportStates.PROGRESS,
        },
      );
      await datesByEvaluationsModel.update(
        {evaluationsId: idEvaluation},
        {managerialReportCreatedAt: await new Date()},
      );

      await generateTEX(idEvaluation, eAWConstants.ReportType.TECHNICAL);
      const technicalPath = await generatePDF(
        idEvaluation,
        eAWConstants.ReportType.TECHNICAL,
      ).then(async generatedReportPath => {
        if (await isSlaveAndActive()) {
          await loadAndSendReport('technical');
        }
        return generatedReportPath;
      });
      await reportsModel.update(
        {evaluationsId: idEvaluation},
        {technicalReportPath: technicalPath},
      );
      await evaluationModel.update(
        {id: idEvaluation},
        {technicalReportState: eAWConstants.ReportStates.FINISHED},
      );
      await datesByEvaluationsModel.update(
        {evaluationsId: idEvaluation},
        {technicalReportCreatedAt: await new Date()},
      );

      try {
        await removeTrash(idEvaluation, eAWConstants.ReportType.MANAGERIAL);
        await removeTrash(idEvaluation, eAWConstants.ReportType.TECHNICAL);
      } catch (error) {}

      await reportNotificationsServices.notifySuccessfullReportFinished(
        idEvaluation,
      );
      await notifyPromoterUsers(
        eAWConstants.reportNotificationsPaths.SUCCESSFULL,
        idEvaluation,
      );
    } catch (error) {
      await evaluationModel.update(
        {id: idEvaluation},
        {
          managerialReportState: eAWConstants.ReportStates.FAILED,
          technicalReportState: eAWConstants.ReportStates.FAILED,
        },
      );
      await reportNotificationsServices.notifyFailedCreationReport(
        idEvaluation,
      );
      await notifyPromoterUsers(
        eAWConstants.reportNotificationsPaths.FAIL,
        idEvaluation,
      );

      throw handleError(error, 'generateReport', idEvaluation);
    }
  };

  /**
   * Main function start the report generation process with Jaspersoft.
   * @param {number} idEvaluation
   */
  this.generateReportJasper = async idEvaluation => {
    try {
      const evaluation = await evaluationModel
        .findOne({
          where: {
            id: idEvaluation,
          },
          include: [{relation: 'evaluationsPackages'}],
        })
        .then(evaluation => JSON.parse(JSON.stringify(evaluation)));
      const isAutomaticReport =
        evaluation.packagesId == eAWConstants.packagesTypes.AUTOMATIC_RANDOM ||
        evaluation.packagesId == eAWConstants.packagesTypes.AUTOMATIC_SPECIFIC;
      const isCompleteReport =
        evaluation.packagesId == eAWConstants.packagesTypes.COMPLETE_RANDOM;
      const isOnlyManual =
        evaluation.packagesId == eAWConstants.packagesTypes.MANUAL_SPECIFIC;

      await reportsModel.create({
        evaluationsId: idEvaluation,
      });
      await evaluationModel.update(
        {id: idEvaluation},
        {managerialReportState: eAWConstants.ReportStates.PROGRESS},
      );

      let jasperReportName = '';
      if (isAutomaticReport) {
        jasperReportName = 'technical_report';
      } else if (isCompleteReport) {
        jasperReportName = 'complete_report';
      } else if (isOnlyManual) {
        jasperReportName = 'manual_report';
      }

      // Managerial Start Jasper Report
      let pathJasperManagerial =
        eAWConstants.REPORTS_ENDPOINT +
        jasperReportName +
        '.pdf?g_reportType=' +
        1 +
        '&g_evaluationId=' +
        idEvaluation +
        '&j_username=' +
        eAWConstants.JASPERSERVER_USERNAME +
        '&j_password=' +
        eAWConstants.JASPERSERVER_PASSWORD;

      const containerName = 'reports';

      const managerialName = await generateJasperNamePDF(
        idEvaluation,
        eAWConstants.ReportType.MANAGERIAL,
      );

      await generateJasper(pathJasperManagerial, managerialName);
      const managerialPath =
        '/containers/' + containerName + '/download/' + managerialName;
      await reportsModel.update(
        {evaluationsId: idEvaluation},
        {managerialReportPath: managerialPath},
      );

      await evaluationModel.update(
        {id: idEvaluation},
        {
          managerialReportState: eAWConstants.ReportStates.FINISHED,
          technicalReportState: eAWConstants.ReportStates.PROGRESS,
        },
      );
      await datesByEvaluationsModel.update(
        {evaluationsId: idEvaluation},
        {managerialReportCreatedAt: await new Date()},
      );

      // Technical Start Jasper Report
      let pathJasperTechnical =
        eAWConstants.REPORTS_ENDPOINT +
        jasperReportName +
        '.pdf?g_reportType=' +
        2 +
        '&g_evaluationId=' +
        idEvaluation +
        '&j_username=' +
        eAWConstants.JASPERSERVER_USERNAME +
        '&j_password=' +
        eAWConstants.JASPERSERVER_PASSWORD;

      const technicalName = await generateJasperNamePDF(
        idEvaluation,
        eAWConstants.ReportType.TECHNICAL,
      );

      await generateJasper(pathJasperTechnical, technicalName);

      const technicalPath =
        '/containers/' + containerName + '/download/' + technicalName;

      await reportsModel.update(
        {evaluationsId: idEvaluation},
        {technicalReportPath: technicalPath},
      );
      await evaluationModel.update(
        {id: idEvaluation},
        {technicalReportState: eAWConstants.ReportStates.FINISHED},
      );
      await datesByEvaluationsModel.update(
        {evaluationsId: idEvaluation},
        {technicalReportCreatedAt: await new Date()},
      );

      await reportNotificationsServices.notifySuccessfullReportFinished(
        idEvaluation,
      );
      await notifyPromoterUsers(
        eAWConstants.reportNotificationsPaths.SUCCESSFULL,
        idEvaluation,
      );
    } catch (error) {
      await evaluationModel.update(
        {id: idEvaluation},
        {
          managerialReportState: eAWConstants.ReportStates.FAILED,
          technicalReportState: eAWConstants.ReportStates.FAILED,
        },
      );
      await reportNotificationsServices.notifyFailedCreationReport(
        idEvaluation,
      );
      await notifyPromoterUsers(
        eAWConstants.reportNotificationsPaths.FAIL,
        idEvaluation,
      );

      throw handleError(error, 'generateReportJasper', idEvaluation);
    }
  };

  async function generateJasperNamePDF(idEvaluation, reportType) {
    const evaluation = await evaluationModel.findOne({
      where: {id: idEvaluation},
      fields: {evaluationCode: true, siteName: true, createdAt: true},
    });
    let texFileName;

    const datetime = new Date(evaluation.createdAt);

    const year = datetime.getFullYear().toString();
    const month = (datetime.getMonth() + 1).toString();
    const date = datetime.getDate().toString();
    const hour = datetime.getHours().toString();
    const minutes = datetime.getMinutes().toString();
    const seconds = datetime.getSeconds().toString();

    texFileName = `${year}-${month}-${date}_${hour}-${minutes}-${seconds}_${evaluation.siteName}`;

    if (reportType == eAWConstants.ReportType.MANAGERIAL) {
      texFileName += '_managerial';
    } else if (reportType == eAWConstants.ReportType.TECHNICAL) {
      texFileName += '_technical';
    }

    //Use a Regex tp replace all spaces for an underscore
    const find = ' ';
    const re = new RegExp(find, 'g');

    return (texFileName + '.pdf').replace(re, '_');
  }

  /**
   * Function to generate a pdf from a latex file
   * filtered by report type and evaluation.
   * @param {*} idEvaluation
   * @param {*} reportType
   */
  async function generatePDF(idEvaluation, reportType) {
    let evaluation = await evaluationModel.findOne({
      where: {id: idEvaluation},
      fields: {evaluationCode: true},
    });
    let containerName = 'reports';
    let texFileName;
    if (reportType == eAWConstants.ReportType.MANAGERIAL) {
      texFileName = 'managerial' + evaluation.evaluationCode;
    } else if (reportType == eAWConstants.ReportType.TECHNICAL) {
      texFileName = 'technical' + evaluation.evaluationCode;
    }
    const reportsDirName =
      '../../../server/local-storage/' + containerName + '/';
    const inputsDirName =
      '../../../server/local-storage/' + containerName + '/media';
    let input = await readFile(
      join(__dirname, reportsDirName, texFileName + '.tex'),
    );

    return new Promise(function(resolve, reject) {
      const output = fs.createWriteStream(
        join(__dirname, reportsDirName, texFileName + '.pdf'),
      );
      const options = {
        cmd: 'lualatex',
        errorLogs: join(__dirname, reportsDirName, texFileName + '.log'),
        args: ['--shell-escape'],
        inputs: join(__dirname, inputsDirName),
        passes: 2,
      };
      try {
        const pdf = latex(input, options);
        pdf.pipe(output);
        pdf.on('error', err => reject(err));
        pdf.on('finish', () =>
          resolve(
            '/containers/' + containerName + '/download/' + texFileName + '.pdf',
          ),
        );
      } catch (error) {
        return false
      } 
    });
  }

  /**
   * Send a file to master node
   * @param {*} containerName
   * @param {*} dirname
   */
  async function sendReportToMaster(containerName, dirname) {
    const formData = {
      my_file: fs.createReadStream(__dirname + '/' + dirname),
    };

    request.post(
      {
        url: `${IP_MASTER_NODE}/eaw-api/containers/${containerName}/upload`,
        formData: formData,
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          return console.error('upload failed:', err);
        }
      },
    );
  }

  /**
   * Load a file and send it to master
   * @param {*} typeReport
   */
  async function loadAndSendReport(typeReport) {
    let containerName = 'reports';
    let evaluation = await evaluationModel.findOne({
      where: {id: idEvaluation},
      fields: {evaluationCode: true},
    });
    const texFileName = typeReport + evaluation;

    const reportsDirName =
      '../../../server/local-storage/' +
      containerName +
      '/' +
      texFileName +
      '.pdf';
    await sendReportToMaster(containerName, reportsDirName);
  }

  async function generateJasper(pathJasper, filename) {
    http.get(encodeURI(pathJasper), function(res) {
      var bodyChunks = [];
      res
        .on('data', function(chunk) {
          bodyChunks.push(chunk);
        })
        .on('end', function() {
          var body = Buffer.concat(bodyChunks);
          fs.writeFileSync(
            './server/local-storage/reports/' + filename,
            body,
            'binary',
          );
        });
    });
  }

  /**
   * Function to generate a Tex extension file
   * @param {*} idEvaluation
   * @param {*} reportType
   */
  async function generateTEX(idEvaluation, reportType) {
    let stream = null;
    try {
      const customTex = await new CustomTex();
      const evaluation = await evaluationModel
        .findOne({
          where: {
            id: idEvaluation,
          },
          include: [{relation: 'evaluationsPackages'}],
        })
        .then(evaluation => JSON.parse(JSON.stringify(evaluation)));

      let texFileName;
      if (reportType == eAWConstants.ReportType.MANAGERIAL) {
        texFileName = 'managerial' + evaluation.evaluationCode;
      } else if (reportType == eAWConstants.ReportType.TECHNICAL) {
        texFileName = 'technical' + evaluation.evaluationCode;
      }

      const reportsDirName = '../../../server/local-storage/reports';
      stream = fs.createWriteStream(
        join(__dirname, reportsDirName, texFileName + '.tex'),
        {
          flags: 'a',
        },
      );
      const hasManualEvaluation =
        evaluation.packagesId == 3 || evaluation.packagesId == 4;
      const hasAutomaticEvaluation =
        evaluation.packagesId == 1 ||
        evaluation.packagesId == 2 ||
        evaluation.packagesId == 4;

      let reportTypeName = '';
      if (reportType == eAWConstants.ReportType.MANAGERIAL) {
        reportTypeName = 'Informe Gerencial';
      } else if (reportType == eAWConstants.ReportType.TECHNICAL) {
        reportTypeName = 'Informe Técnico';
      }

      let metaData = await customTex.getMetaData(reportTypeName);
      stream.write(metaData + '\n');

      let date = await getDate();
      let firstPage = await customTex.getFirstPage(
        evaluation.siteName,
        reportTypeName,
        date,
      );
      stream.write(firstPage + '\n');

      const contents = await customTex.getTableOfContents();
      stream.write(contents + '\n');

      const introduction = await customTex.getIntroduction();
      stream.write(introduction + '\n');

      const methodology = await customTex.getMethodology(
        evaluation.packagesId,
        evaluation.evaluationsPackages.name,
      );
      stream.write(methodology + '\n');

      const pagesByEvaluation = await pagesModel.find({
        where: {
          evaluationsId: idEvaluation,
        },
      });
      const pagesTable = await customTex.getPagesTable(pagesByEvaluation);
      stream.write(pagesTable + '\n');

      const evaluatedCriterionSection = await customTex.getEvaluatedCriterionListSection();
      stream.write(evaluatedCriterionSection + '\n');

      if (hasManualEvaluation) {
        const criterions = await criterionsModel.find();
        const evaluatedCriterionList = await customTex.getEvaluatedCriterionList(
          criterions,
          hasManualEvaluation,
        );
        stream.write(evaluatedCriterionList + '\n');
      }

      if (hasAutomaticEvaluation) {
        const criterions = await criterionsModel.find({
          where: {
            id: {
              inq: eAWConstants.PallyConstants.EVALUATED_CRITERION_LIST,
            },
          },
        });
        const evaluatedCriterionList = await customTex.getEvaluatedCriterionList(
          criterions,
        );
        stream.write(evaluatedCriterionList + '\n');
      }
      const graphicsResults = await customTex.getGeneralGraphicsResultsIntro();
      stream.write(graphicsResults + '\n');

      if (hasManualEvaluation) {
        const graphicResultManualSection = await customTex.getGraphicsResultsManualSection();
        stream.write(graphicResultManualSection);

        const generalSiteAccesibilityStatusForManual = await customTex.getGeneralSiteAccesibilityStatusForManual(
          idEvaluation,
        );
        stream.write(generalSiteAccesibilityStatusForManual + '\n');

        const manualResults = await customTex.getGraphicsResultsManual(
          idEvaluation,
        );
        stream.write(manualResults + '\n');

        const manualSummaty = await customTex.getGeneralGraphicsResultsManual(
          idEvaluation,
        );
        stream.write(manualSummaty + '\n');
      }
      if (hasAutomaticEvaluation) {
        const graphicsResultsAutomaticSection = await customTex.getGraphicsResultsAutomaticSection();
        stream.write(graphicsResultsAutomaticSection + '\n');

        const generalSiteAccesibilityStatusForAutomatic = await customTex.getGeneralSiteAccesibilityStatusForAutomatic(
          idEvaluation,
        );
        stream.write(generalSiteAccesibilityStatusForAutomatic + '\n');

        const automaticResults = await customTex.getGraphicsResultsAutomatic(
          idEvaluation,
        );
        stream.write(automaticResults + '\n');

        const automaticSummary = await customTex.getGeneralGraphicsResultsAutomatic(
          idEvaluation,
        );
        stream.write(automaticSummary + '\n');
      }

      const noticesList = await noticesModel.find();
      const noticesSection = await customTex.noticesSection(noticesList);
      stream.write(noticesSection + '\n');

      if (reportType == eAWConstants.ReportType.TECHNICAL) {
        const criterions = await criterionsModel.find({
          fields: ['id', 'referenceLink', 'numberCriterion', 'name'],
        });
        const recommendations = await recommendationsModel.find();
        const mapCriterionsIdXCriterions = await getHashFieldXModel(criterions);
        const mapRecommendationIdXRecommendation = await getHashFieldXModel(
          recommendations,
        );

        if (hasAutomaticEvaluation) {
          let automaticEvaluationSection = await customTex.automaticEvaluationSection();
          stream.write(automaticEvaluationSection + '\n');

          const findings = await findingsModel
            .findingsByEvaluation(idEvaluation)
            .then(data => data.results);

          const automaticDescriptionMapIdXModel = await automaticDescriptionsModel.generateMapIdXModel();

          let findingsFilteredByCriterion = [];
          for (const criterion of criterions) {
            findingsFilteredByCriterion = await filterFindingsListByAField(
              findings,
              'criterionsId',
              criterion.id,
            );

            if (findingsFilteredByCriterion.length > 0) {
              let criterionSection = await customTex.getCriterionSection(
                criterion,
                findingsFilteredByCriterion.length,
              );
              stream.write(criterionSection + '\n');
              let findingsGroupedByAutomaticDescriptions = await groupObjectsListByFieldName(
                findingsFilteredByCriterion,
                'automaticDescriptionsId',
              );

              for (let automaticDescriptionId in findingsGroupedByAutomaticDescriptions) {
                let automaticDescription =
                  automaticDescriptionMapIdXModel[automaticDescriptionId];
                let currentFindings =
                  findingsGroupedByAutomaticDescriptions[
                    automaticDescriptionId
                  ];
                if (currentFindings.length > 0) {
                  let findingSection = await customTex.getBeginFindingsSection(
                    currentFindings[0].findingType,
                    automaticDescription.description,
                  );
                  stream.write(findingSection + '\n');
                  let findingsGroupedByURL = await groupObjectsListByFieldName(
                    currentFindings,
                    'url',
                  );
                  for (let findingURL in findingsGroupedByURL) {
                    let findings = findingsGroupedByURL[findingURL];
                    if (findings.length > 0) {
                      let urlFindingsTableSeparator = await customTex.getURLFindingsTableSeparator(
                        findings[0].title,
                        findings[0].url,
                      );
                      stream.write(urlFindingsTableSeparator);

                      for (let i = 0; i < findings.length; i++) {
                        let findingsTable = await customTex.getFindingsTable(
                          i,
                          findings[i].htmlCode,
                          findings[i].htmlSelectorPath,
                        );
                        stream.write(findingsTable);
                      }
                    }
                  }
                  let endFindingSection = await customTex.getEndFindingsSection();
                  stream.write(endFindingSection + '\n');
                }
              }
            }
          }
        }
        //######################################   sandia end
        //######################################
        //######################################   sandia end
        if (hasManualEvaluation) {
          const manualEvaluationSection = await customTex.manualEvaluationSection();
          stream.write(manualEvaluationSection + '\n');

          const specifications = await specificationsModel.getEspecificationsAndDisabilitiesByEvaluation(
            idEvaluation,
          );
          const principleList = await principlesModel.find();
          const observationFieldNamesList =
            eAWConstants.EvaluatorFormConstants.OBSERVATION_FIELDS;
          const mMapIdCritrionXIdPrinciple = await criterionsModel
            .generateMapIdCritrionXIdPrinciple()
            .then(data => data.results);
          for (const specInfo of specifications) {
            let usersDisability = await customTex.userDisabilityRoleSection(
              specInfo.disability,
            );
            stream.write(usersDisability + '\n');

            let specSubSection = await customTex.specSubSection(specInfo);
            stream.write(specSubSection + '\n');

            const manualAnswers = await manualAnswersModel.getManualAnswersBySpecificationOrEvaluation(
              idEvaluation,
              specInfo.specificationId,
            );
            const mAnswersByMPages = await groupObjectsListByFieldName(
              manualAnswers,
              'manualPageId',
            );
            const manualPages = await manualPagesModel.manualPagesBySpecification(
              specInfo.specificationId,
            );
            const mPagesIdXmPages = await groupObjectsListByFieldName(
              manualPages,
              'id',
            );
            let mAnswersByMPage = [];
            let manualPageInfo = {};
            for (const manualPageId in mPagesIdXmPages) {
              mAnswersByMPage = mAnswersByMPages[manualPageId];
              manualPageInfo = mPagesIdXmPages[manualPageId][0];
              let pageSection = await customTex.pageSection(
                manualPageInfo.index,
                manualPageInfo.title,
                manualPageInfo.url,
              );
              stream.write(pageSection + '\n');

              if (mAnswersByMPage && mAnswersByMPage.length > 0) {
                let userObservation = '';
                let observationText = '';
                for (const principle of principleList) {
                  const principleSection = await customTex.principleSection(
                    principle.name,
                    principle.referenceLink,
                  );
                  stream.write(principleSection + '\n');

                  observationText =
                    manualPageInfo[observationFieldNamesList[principle.id - 1]];
                  if (observationText != null) {
                    userObservation = await customTex.userObservation(
                      observationText,
                    );
                    stream.write(userObservation + '\n');
                  }

                  let filteredByPrinciple = await filterAnswersByPrinciple(
                    mAnswersByMPage,
                    mMapIdCritrionXIdPrinciple,
                    principle.id,
                  );
                  const NO_ERRORS_FOUND =
                    'No se encontraron errores para este principio.';
                  if (filteredByPrinciple && filteredByPrinciple.length > 0) {
                    let answerGroupedByCriteria = await groupObjectsListByFieldName(
                      filteredByPrinciple,
                      'criterionsId',
                    );
                    let criteria = {};
                    let criterionSection = '';
                    let recommendations = '';
                    for (const criterionId in answerGroupedByCriteria) {
                      let answers = answerGroupedByCriteria[criterionId];
                      criteria = await mapCriterionsIdXCriterions[criterionId];
                      criterionSection = await customTex.criterionSection(
                        criteria.numberCriterion,
                        criteria.name,
                        criteria.referenceLink,
                      );
                      stream.write(criterionSection + '\n');

                      recommendations = await customTex.recommendations(
                        answers,
                        mapRecommendationIdXRecommendation,
                      );
                      stream.write(recommendations + '\n');
                    }
                  } else {
                    stream.write(`
                      \\begin{itemize}
                      \\item ${NO_ERRORS_FOUND}
                      \\end{itemize}
                    `);
                  }
                }
              } else {
                stream.write(`
                  \\begin{itemize}
                  \\item No se encontraron hallazgos para la página correspondiente.
                  \\end{itemize}
                `);
              }
            }
          }
        }
      }

      let endDocument = await customTex.getEndDocument(
        evaluation.mainUrl,
        evaluation.evaluationCode,
      );

      stream.write(endDocument + '\n');
      stream.end();
    } catch (error) {
      stream.end();
      throw handleError(error, 'generateTEX', idEvaluation);
    }
  }

  async function removeTrash(idEvaluation, reportType) {
    let evaluation = await evaluationModel.findOne({
      where: {id: idEvaluation},
      fields: {evaluationCode: true},
    });

    let texFileName;
    if (reportType == eAWConstants.ReportType.MANAGERIAL) {
      texFileName = 'managerial' + evaluation.evaluationCode;
    } else if (reportType == eAWConstants.ReportType.TECHNICAL) {
      texFileName = 'technical' + evaluation.evaluationCode;
    }

    const reportsDirName = '../../../server/local-storage/reports/';
    await deleteFile(join(__dirname, reportsDirName, texFileName + '.tex'));

    const inputsDirName = `${reportsDirName}media/`;
    for (let index = 1; index <= 6; index++) {
      if (
        fs.existsSync(
          join(
            __dirname,
            inputsDirName,
            'g' + index + '_' + evaluation.evaluationCode + '.png',
          ),
        )
      ) {
        await deleteFile(
          join(
            __dirname,
            inputsDirName,
            'g' + index + '_' + evaluation.evaluationCode + '.png',
          ),
        );
      }
    }
  }

  async function deleteFile(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  async function readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  async function getDate() {
    return new Promise(resolve => {
      let today = new Date();
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();
      const months = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ];
      today = months[mm - 1] + ', ' + yyyy;
      resolve(today);
    });
  }

  /**
   * Filter an object list by a field name
   * @param {array<Object>} findings
   * @param {string} fieldName
   * @param {any} fieldValue
   */
  async function filterFindingsListByAField(findings, fieldName, fieldValue) {
    let result = [];
    try {
      result = findings.filter(finding => {
        return finding[fieldName] == fieldValue;
      });
    } catch (error) {
      handleError(error, 'filterFindingsListByAField');
    }
    return result;
  }

  /**
   * Create a map with lists grouped by a field name
   * @param {array<Object>} objects
   * @param {string} fieldName
   */
  async function groupObjectsListByFieldName(objects, fieldName) {
    let groups = {};
    try {
      for (let index = 0; index < objects.length; index++) {
        const finding = objects[index];
        if (finding[fieldName] in groups) {
          groups[finding[fieldName]].push(finding);
        } else {
          groups[finding[fieldName]] = [finding];
        }
      }
    } catch (error) {
      handleError(error, 'groupObjectsListByFieldName');
    }

    return groups;
  }

  async function filterAnswersByPrinciple(
    mAnswersByMPage,
    mMapIdCritrionXIdPrinciple,
    principleId,
  ) {
    try {
      let result = [];
      for (const manualAnswer of mAnswersByMPage) {
        if (
          mMapIdCritrionXIdPrinciple[manualAnswer.criterionsId] == principleId
        ) {
          result.push(manualAnswer);
        }
      }
      return await result;
    } catch (error) {
      throw handleError(error, 'filterAnswersByPrinciple');
    }
  }

  /**
   * Function to insert a notification for all promoter active users.
   */
  async function notifyPromoterUsers(notificationPath, evaluationId) {
    try {
      let evaluation = await evaluationModel
        .findOne({
          where: {
            id: evaluationId,
          },
          fields: ['id', 'siteName', 'clientsId'],
          include: {
            relation: 'evaluationsClientUser',
          },
        })
        .then(result => JSON.parse(JSON.stringify(result)));

      const siteName = evaluation.siteName;
      const clientName =
        evaluation.evaluationsClientUser.firstName +
        ' ' +
        evaluation.evaluationsClientUser.lastName;

      const currentDate = await new Date();
      const promoterUsers = await app.models.Users.find({
        where: {
          and: [{roleTypesId: 2}, {isActive: true}],
        },
      });
      for (const promoterUser of promoterUsers) {
        const notificationData = {
          date: currentDate,
          descriptionPath: notificationPath,
          usersId: promoterUser.id,
          viewed: 0,
          parameters: `{name: '${clientName}', siteName: '${siteName}'}`,
        };
        await app.models.Notifications.create(notificationData);
      }
    } catch (error) {
      handleError(error, 'notifyPromoterUsers', evaluationId);
    }
  }

  /**
   * Generate a map with a variable name as key and
   * an object as a value
   * @param {string} fieldName
   * @param {array<object>} modelObjects
   */
  async function getHashFieldXModel(modelObjects, fieldName = 'id') {
    let result = {};
    for (const modelObject of modelObjects) {
      result[modelObject[fieldName]] = modelObject;
    }
    return result;
  }

  async function isSlaveAndActive() {
    const promoterEvaluationsManager = new PromoterEvaluationsManager();
    const nodeId = process.env.NODE_ID;
    const activeNodes = await promoterEvaluationsManager.getAllActivesNodes();
    const node = activeNodes.filter(x => x.id == nodeId);
    return node.length !== 0;
  }

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId = null) {
    new CustomErrorLog(
      'BE > reportGenerator > ' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
}

module.exports = ReportGenerator;
