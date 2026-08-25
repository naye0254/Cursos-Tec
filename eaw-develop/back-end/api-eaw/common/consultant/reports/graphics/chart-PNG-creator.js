const fse = require('fs-extra');
const puppeteer = require('puppeteer');
const svg2png = require('svg-png-converter');

const ChartOptionsFactory = require('./highcharts-options-factory');
const CustomErrorLog = require('../../../shared/shared-services/errorLog-shared-services');

/**
 * First two parameters must be set
 * @param {Array} xVariableList
 * @param {Array} yVariableList
 * @param {string} graphicType
 * @param {string} tittle
 * @param {string} description
 * @param {string} subtitle
 * @param {string} creditText
 * @param {string} creditHRef
 * @param {string} axisYname
 * @param {string} axisXname
 * @param {string} thingsCounted
 * @param {string} patternOptionSelected
 * @param {string} highContrastOptionSelected
 */
module.exports = function ChartPNGCreator(
  xVariableList,
  yVariableList,
  graphicType = 'bar',
  tittle = '',
  description = '',
  subtitle = '',
  creditText = '',
  creditHRef = '',
  axisYname = 'Pautas',
  axisXname = 'Hallazgos (cantidad)',
  thingsCounted = 'hallazgos',
  patternOptionSelected = false,
  highContrastOptionSelected = false,
) {
  this.defaultConfig = {
    xGraphicVariableList: xVariableList,
    yGraphicVariableList: yVariableList,
    graphicType: graphicType,
    tittle: tittle,
    description: description,
    subtitle: subtitle,
    creditText: creditText,
    creditHRef: creditHRef,
    axisYname: axisYname,
    axisXname: axisXname,
    thingsCounted: thingsCounted,
    patternOptionSelected: patternOptionSelected,
    highContrastOptionSelected: highContrastOptionSelected,
  };

  /**
   * Safe a file with some content. Does not replease existent.
   * @param {string} path The path where the file may be written
   * @param {string} content The content that would be written in a file
   * @param {string} fileName The name of the file that would be written
   */
  this.saveFile = async function(path, content, fileName) {
    const completePath = path + '/' + fileName;
    const response = await fse
      .outputFile(completePath, content)
      .then(DONE => {
        return 'successfull';
      })
      .catch(error => {
        throw error;
      });
    return response;
  };

  /**
   * Function to re asing a grahic configuration if it
   * were necesary.
   */
  this.generateHighChartOptions = async function(pConfig = null) {
    const config = await (pConfig ? pConfig : this.defaultConfig);
    const chartOptionsFactory = await new ChartOptionsFactory(
      config.xGraphicVariableList,
      config.yGraphicVariableList,
      config.graphicType,
      config.tittle,
      config.description,
      config.subtitle,
      config.creditText,
      config.creditHRef,
      config.axisYname,
      config.axisXname,
      config.thingsCounted,
      config.patternOptionSelected,
      config.highContrastOptionSelected,
    ).buildGraphicOptions();

    return chartOptionsFactory;
  };

  /**
   * Generate only svg images
   * @param {object} graphicOptions
   * @param {string} folderPath
   * @param {string} fileName
   */
  this.storeHighchartGraphic = async (
    graphicOptions = null,
    folderPath,
    fileName,
  ) => {
    try {
      const chartOpt = graphicOptions ? graphicOptions : this.defaultConfig;

      // Launch our browser
      let browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      });

      // Virtual page configuration (Pages cannot be used in multiple runs)
      let page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36',
      );
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      });
      await page.addScriptTag({path: require.resolve('jquery')});
      await page.addScriptTag({path: require.resolve('highcharts')});
      await page.addScriptTag({
        path: require.resolve('highcharts-pattern-fill'),
      });
      await page.addScriptTag({
        path: require.resolve('highcharts/modules/exporting'),
      });

      let svgImage = await page.evaluate(chartOpt => {
        $('body').prepend('<div id="container"></div>');
        chart = Highcharts.chart('container', chartOpt);

        return chart.getSVG({
          exporting: {
            sourceWidth: chart.chartWidth,
            sourceHeight: chart.chartHeight,
          },
        });
      }, chartOpt);
      let outputBuffer = await svg2png.svg2png({
        input: svgImage,
        encoding: 'buffer',
        format: 'png',
      });

      await this.saveFile(folderPath, outputBuffer, fileName);
      await page.close();
      browser.close();

      return 1;
    } catch (error) {
      handleError(error, 'storeHighchartGraphic');
      await page.close();
      browser.close();

      return 0;
    }
  };

  /**
   * Store error
   * @param {Error} error
   * @param {string} functionName
   */
  function handleError(error, functionName, evaluationId = null) {
    new CustomErrorLog(
      'BE > ChartPNGCreator > ' + functionName,
      error,
      evaluationId,
    ).saveError();
    return error;
  }
};
