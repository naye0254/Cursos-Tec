const app = require('../../../../server/server');

const CustomErrorLog = require('../../../shared/shared-services/errorLog-shared-services');
const ChartPNGCreator = require('./chart-PNG-creator.js');
const ReportStatisticsData = require('./report-statistics-data');
const EAWConstants = require('../../../eaw-constants');

/**
 * This class use store procedures and
 * functions from statistics module
 * to generate different graphics.
 * Also returns used data.
 * @param {number} idEvaluation
 */
module.exports = function ReportGraphics(idEvaluation) {
  const reportStatisticsData = new ReportStatisticsData();
  const eAWConstants = new EAWConstants();

  const COLORS_FOR_AUTOMATIC_GRAPHIC = [
    '#d83d3d',
    '#026729',
    '#66009A',
    '#198382',
    '#c4244b',
    '#5257ad',
    '#a2653e',
    '#5d0e22',
    '#063b3a',
    '#800e0e',
    '#1a1f76',
    '#532e16',
    '#53207e',
    '#0a6681',
    '#5c5c5c',
    '#2a5188',
    '#637211',
    '#6a434d',
  ];

  const COLORS_FOR_MANUAL_GRAPHIC = [
    '#d83d3d',
    '#026729',
    '#727272',
    '#198382',
    '#c4244b',
    '#5257ad',
    '#a2653e',
    '#5d0e22',
    '#063b3a',
    '#800e0e',
    '#1a1f76',
    '#532e16',
    '#53207e',
    '#0a6681',
    '#5c5c5c',
    '#2a5188',
    '#637211',
    '#6a434d',
  ];

  /**
   * exportFileName must have the extension .svg
   * @param {String} defPath
   * @param {String} exportFileName
   * */
  this.getSiteAccesibilityStatus = async (
    defPath,
    exportFileName,
    generalType,
  ) => {
    let data = {};
    const yAxisLabel = 'Categoría de cumplimiento';
    try {
      data = await reportStatisticsData.getGeneralAccesibilityGraphicData(
        idEvaluation,
        generalType,
      );
      data.results.yAxisLabel = yAxisLabel;
      const chartPNGCreator = await new ChartPNGCreator(
        '',
        data.results.yVariableForPie,
        eAWConstants.GraphicTypesEnum.pie,
        '',
        '',
        '',
        '',
        '',
        '',
        'Porcentajes',
      );
      let highchartsOptions = await chartPNGCreator.generateHighChartOptions();
      highchartsOptions.colors = COLORS_FOR_AUTOMATIC_GRAPHIC;
      await chartPNGCreator.storeHighchartGraphic(
        highchartsOptions,
        defPath,
        exportFileName,
      );
    } catch (error) {
      throw handleError(error, 'getSiteAccesibilityStatus', idEvaluation);
    }

    return data.results;
  };

  /**
   * exportFileName must have the extension .svg
   * @param {String} defPath
   * @param {String} exportFileName
   * */
  this.getAutomaticStatisticsByGuideline = async (defPath, exportFileName) => {
    let data = {};
    const yAxisLabel = 'Pautas';
    try {
      data = await reportStatisticsData.reportFindingsByGuideline(idEvaluation);
      data.results.yAxisLabel = yAxisLabel;

      const chartPNGCreator = await new ChartPNGCreator(
        data.results.xVariableList,
        data.results.yVariableList,
        eAWConstants.GraphicTypesEnum.bar,
        '',
        '',
        '',
        '',
        '',
        yAxisLabel,
        'Criterios (cantidad)',
      );
      let highchartsOptions = await chartPNGCreator.generateHighChartOptions();
      highchartsOptions.colors = COLORS_FOR_AUTOMATIC_GRAPHIC;
      await chartPNGCreator.storeHighchartGraphic(
        highchartsOptions,
        defPath,
        exportFileName,
      );
    } catch (error) {
      throw handleError(
        error,
        'getAutomaticStatisticsByGuideline',
        idEvaluation,
      );
    }

    return data.results;
  };

  /**
   * exportFileName must have the extension .svg
   * @param {String} defPath
   * @param {String} exportFileName
   * */
  this.getAutomaticStatisticsByPage = async (defPath, exportFileName) => {
    const yAxisLabel = 'Páginas';
    let data = {};
    try {
      data = await reportStatisticsData.reportFindingsByPage(idEvaluation);
      data.results.yAxisLabel = yAxisLabel;
      const chartPNGCreator = await new ChartPNGCreator(
        data.results.xVariableList,
        data.results.yVariableList,
        eAWConstants.GraphicTypesEnum.bar,
        '',
        '',
        '',
        '',
        '',
        yAxisLabel,
        'Criterios (cantidad)',
      );
      let highchartsOptions = await chartPNGCreator.generateHighChartOptions();
      highchartsOptions.colors = COLORS_FOR_AUTOMATIC_GRAPHIC;
      await chartPNGCreator.storeHighchartGraphic(
        highchartsOptions,
        defPath,
        exportFileName,
      );
      data.results.yVariableList.push(data.results.variableYForTables);
    } catch (error) {
      throw handleError(error, 'getAutomaticStatisticsByPage', idEvaluation);
    }

    return data.results;
  };

  /**
   * exportFileName must have the extension .png
   * @param {String} defPath
   * @param {String} exportFileName
   * */
  this.getManualStatisticsByPage = async (defPath, exportFileName) => {
    const yAxisLabel = 'Páginas';
    let data = {};
    try {
      data = await reportStatisticsData.getManualStatisticsByPage(idEvaluation);
      data.results.yAxisLabel = yAxisLabel;
      const chartPNGCreator = await new ChartPNGCreator(
        data.results.xVariableList,
        data.results.yVariableList,
        eAWConstants.GraphicTypesEnum.bar,
        '',
        '',
        '',
        '',
        '',
        yAxisLabel,
        'Criterios (cantidad)',
      );
      let highchartsOptions = await chartPNGCreator.generateHighChartOptions();
      highchartsOptions.colors = COLORS_FOR_MANUAL_GRAPHIC;
      await chartPNGCreator.storeHighchartGraphic(
        highchartsOptions,
        defPath,
        exportFileName,
      );
      data.results.yVariableList.push(data.results.variableYForTables);
    } catch (error) {
      throw handleError(error, 'getManualStatisticsByPage', idEvaluation);
    }

    return data.results;
  };

  /**
   * exportFileName must have the extension .svg
   * @param {String} defPath
   * @param {String} exportFileName
   * */
  this.getManualStatisticsByGuideline = async (defPath, exportFileName) => {
    let data = {};
    const yAxisLabel = 'Pautas';
    try {
      data = await reportStatisticsData.getManualStatisticsByGuideline(
        idEvaluation,
      );
      data.results.yAxisLabel = yAxisLabel;
      const chartPNGCreator = await new ChartPNGCreator(
        data.results.xVariableList,
        data.results.yVariableList,
        eAWConstants.GraphicTypesEnum.bar,
        '',
        '',
        '',
        '',
        '',
        yAxisLabel,
        'Criterios (cantidad)',
      );
      let highchartsOptions = await chartPNGCreator.generateHighChartOptions();
      highchartsOptions.colors = COLORS_FOR_MANUAL_GRAPHIC;
      await chartPNGCreator.storeHighchartGraphic(
        highchartsOptions,
        defPath,
        exportFileName,
      );
    } catch (error) {
      throw handleError(error, 'getManualStatisticsByGuideline', idEvaluation);
    }

    return data.results;
  };

  /**
   * Recive an option and generate corresponding
   * graphic image and data.
   * @param {String} option
   * @returns {object}
   * */
  this.retriveStatisticsData = async function retriveStatisticsData(option) {
    try {
      let evaluationCode = await app.models.Evaluations.findOne({
        where: {id: idEvaluation},
        fields: {evaluationCode: true},
      });
      if (evaluationCode !== null) {
        const defPath = 'server/local-storage/reports/media';
        const exportFileName = await `g${option}_${evaluationCode.evaluationCode}.png`;
        let result = {
          data: {},
          defPath: defPath,
          exportFileName: exportFileName,
        };
        switch (option) {
          case 1:
            result.data = await this.getAutomaticStatisticsByGuideline(
              defPath,
              exportFileName,
            );
            break;
          case 2:
            result.data = await this.getAutomaticStatisticsByPage(
              defPath,
              exportFileName,
            );
            break;
          case 3:
            result.data = await this.getManualStatisticsByGuideline(
              defPath,
              exportFileName,
            );
            break;
          case 4:
            result.data = await this.getManualStatisticsByPage(
              defPath,
              exportFileName,
            );
            break;
          case 5:
            result.data = await this.getSiteAccesibilityStatus(
              defPath,
              exportFileName,
              eAWConstants.GeneralGraphicDataTypes.AUTOMATIC,
            );
            break;
          case 6:
            result.data = await this.getSiteAccesibilityStatus(
              defPath,
              exportFileName,
              eAWConstants.GeneralGraphicDataTypes.MANUAL,
            );
            break;
          default:
            throw new Error('Statistic option should be a lower number');
        }
        return result;
      }
    } catch (error) {
      throw handleError(error, 'retriveStatisticsData', idEvaluation);
    }
  };

  /**
   * Generate a latex table from an specific format;
   * Data format example:
   *    xVariableList: [ " 1", " 2" ]
   *    yVariableList: [ { "name": "No cumple", "data": [6, 2, 25, ...]},
   *                     {... }, ... ]
   *    yAxisLabel: "y axis label"
   *
   * @param {String} caption
   * @param {Array} xVariableList
   * @param {Array<object>} yVariableList
   * @param {string} yAxisLabel
   */
  this.latexTableGenerator = async function latexTableGenerator(
    caption,
    xVariableList,
    yVariableList,
    yAxisLabel,
  ) {
    let columnsConfig = '|l' + '|c'.repeat(yVariableList.length) + '|';
    for (const yVar of yVariableList) {
      if (yVar.name === 'URL') {
        columnsConfig =
          '|l' + '|c'.repeat(yVariableList.length - 1) + '| p{11cm} |';
        break;
      }
    }
    const verticalSpace = ' & '.repeat(yVariableList.length) + '\\\\';
    const bellowMargin = '*[2mm]';
    let result =
      `\\begin{center} \\begin{longtable}{${columnsConfig}}\n` +
      `${caption ? '\\caption{' + caption + '}\\\\' : ''}` +
      `\\hline${verticalSpace} `;
    let headers = `{\\color[HTML]{377A81} ${yAxisLabel}}`;

    for (let yVIndex = 0; yVIndex < yVariableList.length; yVIndex++) {
      let element = yVariableList[yVIndex];
      headers += ` & {\\color[HTML]{377A81} ${element.name}}`;
    }
    result += headers + ' \\\\' + bellowMargin + '\n \\hline';
    let row = '';
    for (let index = 0; index < xVariableList.length; index++) {
      row = `${verticalSpace} {\\color[HTML]{002D2E} ${xVariableList[index]}}`;
      for (let yVIndex = 0; yVIndex < yVariableList.length; yVIndex++) {
        let element = yVariableList[yVIndex];
        let field = await replaceSpecialLatexCharacters(element.data[index]);
        row += ` & {\\color[HTML]{002D2E} ${field}}`;
      }
      row += ' \\\\' + bellowMargin + '\n \\hline';
      result += row;
    }
    result += '\\end{longtable} \\end{center}';

    return result;
  };

  /**
   * Replace special latex chars that has
   * functions and are not characters.
   * @param {String} text
   */
  async function replaceSpecialLatexCharacters(text) {
    let result = text;
    if (typeof text === 'string') {
      const doubleBackSlash = '\x5C\x5C';
      result = await result.replace(/\x5C/g, doubleBackSlash);
      result = await result.replace(/_/g, '\x5C_');
      result = await result.replace(/&/g, '\x5C&');
      result = await result.replace(/#/g, '\x5C#');
      result = await result.replace(/%/g, '\x5C%');
      result = await result.replace(/{/g, '\x5C{');
      result = await result.replace(/}/g, '\x5C}');
      result = await result.replace(/~/g, '\x5C~');
      result = await result.replace(/\$/g, '\x5C$');
    }
    return result;
  }

  /**
   * Generate latex text code to insert an png image
   * @param {string} completeImageName
   * @param {float} widthPercentage
   * @param {string} caption
   */
  this.generateSVGImageLatexText = async function generateSVGImageLatexText(
    completeImageName,
    widthPercentage,
    caption = null,
  ) {
    const latexSVG = await (`
    \\begin{figure}[H]
      \\centering
      \\includegraphics[width=${widthPercentage}\\textwidth]{${completeImageName}}` +
      `
      ${caption ? '\\caption{' + caption + '}' : ''}` +
      `
      \\label{${completeImageName}}
    \\end{figure} 
    `);
    return latexSVG;
  };

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, idEvaluation = null) {
    new CustomErrorLog(
      'BE > ChartPNGCreator > ' + functionName,
      error,
      idEvaluation,
    ).saveError();
    return error;
  }
};
