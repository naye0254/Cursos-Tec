/*
 * Available graphic types (in order) */
export enum GraphicTypesEnum {
  bar,
  column,
  pie,
  donut,
  spline,
  stacked,
  stackedColumn,
}

/* error, warning, notices */
export const COLORS_FOR_AUTOMATIC_EVALUATION_GRAPHIC = [
  '#d83d3d',
  '#66009A',
  '#026729',
];

/* noComply, comply, noApply */
export const COLORS_FOR_MANUAL_EVALUATION_GRAPHIC = [
  '#d83d3d',
  '#727272',
  '#026729',
];

/*
 * Available graphic type names */
export const GRAPHIC_NATIVE_TYPE_NAMES = {
  nameList: [
    'bar',
    'column',
    'pie',
    'donut',
    'spline',
    'stacked',
    'stackedColumn',
  ],
};

/*
 * Main class to switch between graphics
 * Called in a client class */
export class ChartOptionsFactory {
  private baseChart: CustomBaseChart;

  /**
   * @param {object} xAxisCategories
   * @param {object} dataColumn
   * @param {string} graphicTypeIndex
   * @param {string} titleText
   * @param {string} descriptionChart
   * @param {string} subtitleText
   * @param {string} creditText
   * @param {string} creditHRef
   * @param {string} xAxisText
   * @param {string} yAxisText
   * @param {string} countedVariableName
   * @param {boolean} includePattern
   * @param {boolean} includeHighConstrast
   */
  constructor(
    xAxisCategories: any,
    dataColumn: any,
    graphicTypeIndex: number,
    titleText: string,
    descriptionChart: string,
    subtitleText: string,
    creditText: string,
    creditHRef: string,
    xAxisText: string,
    yAxisText: string,
    countedVariableName: string,
    includePattern: boolean = false,
    includeHighConstrast: boolean = false,
  ) {
    const graphicOptionDto = new CustomBaseChart(
      GRAPHIC_NATIVE_TYPE_NAMES.nameList[graphicTypeIndex],
      titleText,
      descriptionChart,
      subtitleText,
      creditText,
      creditHRef,
      xAxisCategories,
      xAxisText,
      yAxisText,
      countedVariableName,
      dataColumn,
      includePattern,
      includeHighConstrast,
    ).getGraphicOptions();

    switch (graphicTypeIndex) {
      case GraphicTypesEnum.bar:
        this.baseChart = new CustomBarChart(graphicOptionDto);
        break;
      case GraphicTypesEnum.column:
        this.baseChart = new CustomBarChart(graphicOptionDto);
        break;
      case GraphicTypesEnum.pie:
        this.baseChart = new CustomPieChart(graphicOptionDto);
        break;
      case GraphicTypesEnum.donut:
        this.baseChart = new CustomDonutChart(graphicOptionDto);
        break;
      case GraphicTypesEnum.spline:
        this.baseChart = new CustomBarChart(graphicOptionDto);
        break;
      case GraphicTypesEnum.stacked:
        this.baseChart = new CustomStackedBarChart(graphicOptionDto);
        break;
      case GraphicTypesEnum.stackedColumn:
        this.baseChart = new CustomStackedColumnChart(graphicOptionDto);
        break;
      default:
        this.baseChart = new CustomBarChart(graphicOptionDto);
        break;
    }
  }

  public buildGraphicOptions() {
    return this.baseChart.getGraphicOptions();
  }
}

/*
 * Main class to switch between graphics
 * Called in a client class */
export class CustomBaseChart {
  protected graphicOptions = {};
  protected patterns: Patterns;
  protected includeHighConstrast: boolean;
  protected includePattern: boolean;
  protected graphicType: string;
  protected descriptionChart: string;
  protected titleText: string;
  protected subtitleText: string;
  protected creditText: string;
  protected creditHRef: string;
  protected xAxisText: string;
  protected yAxisText: string;
  protected countedVariableName: string;
  protected xAxisCategories: any;
  protected dataColumn: any;

  protected backgroundStyle: object;
  protected titleStyle: object;
  protected subtitleStyle: object;
  protected itemStyle: object;
  protected itemOver: object;
  protected tooltipStyle: object;
  protected pointStyle: object;
  protected xAxisStyle: object;
  protected yAxisStyle: object;

  /**
   * Use the enum GraphicTypes to create a graphic.
   * @param {string} graphicType
   * @param {string} titleText
   * @param {string} descriptionChart
   * @param {string} subtitleText
   * @param {string} creditText
   * @param {string} creditHRef
   * @param {object} xAxisCategories
   * @param {string} xAxisText
   * @param {string} yAxisText
   * @param {string} countedVariableName
   * @param {object} dataColumn
   * @param {boolean} includePattern
   * @param {boolean} includeHighConstrast
   */
  constructor(
    graphicType: string,
    titleText: string,
    descriptionChart: string,
    subtitleText: string,
    creditText: string,
    creditHRef: string,
    xAxisCategories: any,
    xAxisText: string,
    yAxisText: string,
    countedVariableName: string,
    dataColumn: any,
    includePattern: boolean = false,
    includeHighConstrast: boolean = false,
  ) {
    this.graphicType = graphicType;
    this.titleText = titleText;
    this.descriptionChart = descriptionChart;
    this.subtitleText = subtitleText;
    this.creditText = creditText;
    this.creditHRef = creditHRef;
    this.xAxisCategories = xAxisCategories;
    this.xAxisText = xAxisText;
    this.yAxisText = yAxisText;
    this.countedVariableName = countedVariableName;
    this.dataColumn = dataColumn;
    this.includePattern = includePattern;
    this.includeHighConstrast = includeHighConstrast;
    this.patterns = new Patterns('custom-pattern');
    this.setContrast();
    this.setBaseOptions();
  }

  protected setContrast() {
    if (this.includeHighConstrast) {
      this.setHighcontrast();
    } else {
      this.unSetHighConstrast();
    }
  }

  /**
   * set Highcontrast color settings
   */
  protected setHighcontrast() {
    this.backgroundStyle = CHART_OPTIONS.highContrastOptions.backgroundStyle;
    this.titleStyle = CHART_OPTIONS.highContrastOptions.titleStyle;
    this.subtitleStyle = CHART_OPTIONS.highContrastOptions.subtitleStyle;
    this.itemStyle = CHART_OPTIONS.highContrastOptions.itemStyle;
    this.itemOver = CHART_OPTIONS.highContrastOptions.itemOver;
    this.tooltipStyle = CHART_OPTIONS.highContrastOptions.tooltipStyle;
    this.pointStyle = CHART_OPTIONS.highContrastOptions.pointStyle;
    this.xAxisStyle = CHART_OPTIONS.highContrastOptions.xAxis;
    this.yAxisStyle = CHART_OPTIONS.highContrastOptions.yAxis;
  }

  /**
   * unset Highcontrast color settings
   */
  protected unSetHighConstrast() {
    this.backgroundStyle = CHART_OPTIONS.initialOptions.backgroundStyle;
    this.titleStyle = CHART_OPTIONS.initialOptions.titleStyle;
    this.subtitleStyle = CHART_OPTIONS.initialOptions.subtitleStyle;
    this.itemStyle = CHART_OPTIONS.initialOptions.itemStyle;
    this.itemOver = CHART_OPTIONS.initialOptions.itemOver;
    this.tooltipStyle = CHART_OPTIONS.initialOptions.tooltipStyle;
    this.pointStyle = CHART_OPTIONS.initialOptions.pointStyle;
    this.xAxisStyle = CHART_OPTIONS.initialOptions.xAxis;
    this.yAxisStyle = CHART_OPTIONS.initialOptions.yAxis;
  }

  /**
   * Define base properties of the chart
   */
  public async setBaseOptions() {
    this.graphicOptions = {
      colors: this.includePattern
        ? CHART_OPTIONS.colorFillPattern
        : CHART_OPTIONS.colors,
      defs: this.patterns.def,
      chart: {
        type: this.graphicType,
        backgroundColor: this.backgroundStyle,
        description: this.descriptionChart,
        height: null,
      },
      title: {
        text: this.titleText,
        style: this.titleStyle,
      },
      subtitle: {
        text: this.subtitleText,
        style: this.subtitleStyle,
      },
      credits: {
        text: this.creditText,
        href: this.creditHRef,
      },
      legend: {
        symbolHeight: 20,
        margin: 10,
        itemMarginBottom: 10,
        itemStyle: this.itemStyle,
        itemHoverStyle: this.itemOver,
      },
      accessibility: {
        enabled: true,
        describeSingleSeries: true,
      },
      xAxis: {
        title: {
          text: this.xAxisText,
          style: this.yAxisStyle,
        },
        categories: this.xAxisCategories,
        crosshair: true,
        labels: {
          style: this.xAxisStyle,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: this.yAxisText,
          style: this.yAxisStyle,
        },
        labels: {
          style: this.yAxisStyle,
        },
        gridLineColor: this.includeHighConstrast ? '#212121' : '#e6e6e6',
      },
      tooltip: {
        borderColor: this.includeHighConstrast ? 'white' : '',
        backgroundColor: this.includeHighConstrast
          ? 'rgba(0, 0, 0, 0.85)'
          : 'rgba(255, 255, 255, 0.85)',
        headerFormat: '<span>{point.key}</span><br><table>',
        pointFormat: `<tr><td style="color:black; padding:0"><b>{series.name}</b>: {point.y}</td></tr>`,
        footerFormat: '</table>',
        useHTML: true,
        valueSuffix: ` ${this.countedVariableName}`,
        style: this.tooltipStyle,
      },
      plotOptions: {
        bar: {
          pointPadding: 0.2,
          borderWidth: 1,
          borderColor:
            !this.includeHighConstrast && this.includePattern
              ? '#212121'
              : '#ccd6eb',
          cursor: 'pointer',
          allowPointSelect: true,
        },
        column: {
          pointPadding: 0.2,
          borderWidth: 1,
          borderColor:
            !this.includeHighConstrast && this.includePattern
              ? '#212121'
              : '#ccd6eb',
          cursor: 'pointer',
          allowPointSelect: true,
        },
        pie: {
          borderWidth: 2,
          borderColor:
            !this.includeHighConstrast && this.includePattern
              ? '#212121'
              : '#ccd6eb',
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
          cursor: 'pointer',
          allowPointSelect: true,
        },
      },
      series: this.dataColumn,
      exporting: {
        buttons: {
          contextButton: {
            menuItems: [
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG',
              'separator',
              'downloadCSV',
              'downloadXLS',
            ],
          },
        },
      },
    };
  }

  /**
   * Return the graphic options
   */
  public getGraphicOptions() {
    return this.graphicOptions;
  }
}

/**
 * Class to change some options to use bar/column graphic type
 */
export class CustomBarChart extends CustomBaseChart {
  /**
   * Constructor method
   * @param { json } baseGraphicOptionsDto
   */
  constructor(baseGraphicOptionsDto: any) {
    super(
      baseGraphicOptionsDto.graphicType,
      baseGraphicOptionsDto.titleText,
      baseGraphicOptionsDto.descriptionChart,
      baseGraphicOptionsDto.subtitleText,
      baseGraphicOptionsDto.creditText,
      baseGraphicOptionsDto.creditHRef,
      baseGraphicOptionsDto.xAxisCategories,
      baseGraphicOptionsDto.xAxisText,
      baseGraphicOptionsDto.yAxisText,
      baseGraphicOptionsDto.countedVariableName,
      baseGraphicOptionsDto.dataColumn,
      baseGraphicOptionsDto.includePattern,
      baseGraphicOptionsDto.includeHighConstrast,
    );
    this.graphicOptions = baseGraphicOptionsDto;
    this.setBarGraphicOptions();
  }

  /**
   * Set options to graphic bar
   */
  public setBarGraphicOptions() {
    const barGraphicHeight = 800;
    this.graphicOptions['chart'].height = barGraphicHeight;
  }
}

export class CustomPieChart extends CustomBaseChart {
  /**
   * Class to change some options to use pie graphic type
   * @param { json } baseGraphicOptionsDto
   */
  constructor(baseGraphicOptionsDto: any) {
    super(
      baseGraphicOptionsDto.graphicType,
      baseGraphicOptionsDto.titleText,
      baseGraphicOptionsDto.descriptionChart,
      baseGraphicOptionsDto.subtitleText,
      baseGraphicOptionsDto.creditText,
      baseGraphicOptionsDto.creditHRef,
      baseGraphicOptionsDto.xAxisCategories,
      baseGraphicOptionsDto.xAxisText,
      baseGraphicOptionsDto.yAxisText,
      baseGraphicOptionsDto.countedVariableName,
      baseGraphicOptionsDto.dataColumn,
      baseGraphicOptionsDto.includePattern,
      baseGraphicOptionsDto.includeHighConstrast,
    );
    this.graphicOptions = baseGraphicOptionsDto;
    this.setPieGraphicOptions();
  }

  /**
   * Set options to pie chart
   */
  public setPieGraphicOptions() {
    this.graphicOptions[
      'tooltip'
    ].pointFormat = `<tr><td style="color:{white};padding:0"><b>{series.name}:\
    </b> </td><td style="padding:0">{point.y}</td></tr> <tr><td style="color:{white};padding:0"><b>Porcentaje:</b> \
    {point.percentage:.1f} </td></tr>`;
  }
}

/**
 * Class to change some options to use donut graphic type,
 * that is a graphic.
 */
export class CustomDonutChart extends CustomPieChart {
  /**
   * Constructor method
   * @param { json } baseGraphicOptionsDto
   */
  constructor(baseGraphicOptionsDto: any) {
    super(baseGraphicOptionsDto);

    this.graphicOptions = baseGraphicOptionsDto;
    this.setPieGraphicOptions();
    this.setDonutGraphicOptions();
  }

  /**
   * Set options to donut chart
   */
  setDonutGraphicOptions() {
    this.graphicOptions['chart'].type = 'pie';
    this.graphicOptions['plotOptions'].borderWidth = 10;
    this.graphicOptions['plotOptions'].borderColor = 212121;
    this.graphicOptions['plotOptions'].pie.innerSize = '50%';
    this.graphicOptions['plotOptions'].pie.depth = 40;
    this.graphicOptions['chart'].options3d = {
      enabled: true,
      alpha: 20,
    };
  }
}

/**
 * Class to change some options to use stacked representation
 * for bars and columns.
 */
export class CustomStackedBarChart extends CustomBarChart {
  /**
   * Constructor method
   * @param { json } baseGraphicOptionsDto
   */
  constructor(baseGraphicOptionsDto: any) {
    super(baseGraphicOptionsDto);

    this.graphicOptions = baseGraphicOptionsDto;
    this.setStackedBarOptions();
  }

  private setStackedBarOptions() {
    this.graphicOptions['chart'].type = 'bar';
    this.graphicOptions['plotOptions'].bar.stacking = 'normal';
    this.graphicOptions['tooltip'].shared = true;
    this.graphicOptions['legend'].labelFormatter = function() {
      if (this.userOptions.stack !== undefined) {
        return this.name + ' (' + this.userOptions.stack + ')';
      }
      return this.name;
    };
  }
}

/**
 * Class to change some options to use stacked representation
 * for bars and columns.
 */
export class CustomStackedColumnChart extends CustomBarChart {
  /**
   * Constructor mehod
   * @param { json } baseGraphicOptionsDto
   */
  constructor(baseGraphicOptionsDto: any) {
    super(baseGraphicOptionsDto);

    this.graphicOptions = baseGraphicOptionsDto;
    this.setStackedColumnOptions();
  }

  /**
   * Set options tp column options
   */
  private setStackedColumnOptions() {
    this.graphicOptions['chart'].type = 'column';
    this.graphicOptions['plotOptions'].column.stacking = 'normal';
    this.graphicOptions['tooltip'].shared = true;
    this.graphicOptions['legend'].labelFormatter = function() {
      if (this.userOptions.stack !== undefined) {
        return this.name + ' (' + this.userOptions.stack + ')';
      }
      return this.name;
    };
  }
}

/**
 * Class to define patters of the graphic
 */
export class Patterns {
  def: any = null;
  constructor(name: string) {
    this.def = {
      patterns: [
        {
          id: `${name}-0`,
          path: {
            d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
          },
          color: '#198382',
        },
        {
          id: `${name}-1`,
          image:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%232a5188' fill-opacity='1'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
          width: 20,
          height: 9,
        },

        {
          id: `${name}-2`,
          path: {
            d: 'M 5 5 m -4 0 a 4 4 0 1 1 8 0 a 4 4 0 1 1 -8 0',
          },
          color: '#a2653e',
        },
        {
          id: `${name}-3`,
          image:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='5' viewBox='0 0 5 5'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%230a6681' fill-opacity='1'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
          width: 8,
          height: 8,
        },
        {
          id: `${name}-4`,
          path: {
            d: 'M 0 0 L 5 10 L 10 0',
          },
          color: '#026729',
        },
        {
          id: `${name}-5`,
          path: {
            d: 'M 0 3 L 10 3 M 0 8 L 10 8',
          },
          color: '#5257ad',
        },
        {
          id: `${name}-6`,
          path: {
            d: 'M 10 3 L 5 3 L 5 0 M 5 10 L 5 7 L 0 7',
          },
          color: '#800e0e',
        },
        {
          id: `${name}-7`,
          path: {
            d: 'M 3 3 L 8 3 L 8 8 L 3 8 Z',
          },
          color: '#1a1f76',
        },
        {
          id: `${name}-8`,
          path: {
            d: 'M 2 5 L 5 2 L 8 5 L 5 8 Z',
          },
          color: '#532e16',
        },
        {
          id: `${name}-9`,
          image:
            "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23c45b00' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E",
          width: 45,
          height: 45,
        },
        {
          id: `${name}-10`,
          path: {
            d: 'M 3 0 L 3 10 M 8 0 L 8 10',
          },
          color: '#095d5c',
        },
        {
          id: `${name}-11`,
          image:
            "data:image/svg+xml,%3Csvg width='2' height='2' viewBox='0 0 2 2' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%2353207e' fill-opacity='200'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
          width: 8,
          height: 8,
        },
        {
          id: `${name}-12`,
          path: {
            d: 'M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9',
          },
          color: '#5d0e22',
        },

        {
          id: `${name}-13`,
          image:
            "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10h10v10H0V10zM10 0h10v10H10V0z' fill='%235c5c5c' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E",
          width: 10,
          height: 10,
        },
        {
          id: `${name}-14`,
          image:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='%23d83d3d' fill-opacity='1' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E",
          width: 20,
          height: 9,
        },
        {
          id: `${name}-15`,
          path: {
            d: 'M 0 3 L 5 3 L 5 0 M 5 10 L 5 7 L 10 7',
          },
          color: '#c4244b',
        },
        {
          id: `${name}-16`,
          image:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='20' viewBox='0 0 10 20'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23637211' fill-opacity='1'%3E%3Cpath d='M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
          width: 20,
          height: 10,
        },
        {
          id: `${name}-17`,
          image:
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%236a434d' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
          width: 15,
          height: 20,
        },
      ],
    };
  }
}

/**
 * Class to define the colors and other properties of the graphic
 */
export const CHART_OPTIONS = {
  highContrastOptions: {
    backgroundStyle: {
      linearGradient: [0, 0, 500, 500],
      stops: [
        [0, 'rgb(0 , 0, 0)'],
        [1, 'rgb(0, 0, 0)'],
      ],
    },
    titleStyle: {
      font: '16pt Helvetica',
      fontSize: '16px',
      color: 'yellow',
    },
    subtitleStyle: {
      font: '14pt Helvetica',
      fontSize: '15px',
      color: 'white',
    },
    itemStyle: {
      font: '10pt Helvetica',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'regular',
    },
    itemOver: {
      font: '10pt Helvetica',
      color: 'white',
      fontWeight: 'regular',
      fontSize: '14px',
    },
    tooltipStyle: {
      font: '14pt Helvetica',
      color: 'white',
      fontSize: '14px',
      fontWeight: 'regular',
    },
    pointStyle: {
      font: '14pt Helvetica',
      color: 'white',
      fontSize: '12px',
    },
    yAxis: {
      font: '10pt Helvetica',
      fontSize: '13px',
      color: 'white',
    },
    xAxis: {
      font: '10pt Helvetica',
      fontSize: '13px',
      color: 'white',
    },
  },
  initialOptions: {
    backgroundStyle: {},
    titleStyle: {
      font: '16pt Helvetica',
      fontSize: '16px',
      color: '#505050',
    },
    subtitleStyle: {
      font: '14pt Helvetica',
      fontSize: '15px',
      color: '#505050',
    },
    itemStyle: {
      font: '10pt Helvetica',
      fontSize: '14px',
      fontWeight: 'regular',
      color: '#505050',
    },
    itemOver: {
      font: '10pt Helvetica',
      fontSize: '14px',
      fontWeight: 'regular',
    },
    tooltipStyle: {
      font: '14pt Helvetica',
      fontSize: '12px',
      color: '#505050',
    },
    pointStyle: {
      font: '14pt Helvetica',
      fontSize: '10px',
    },
    yAxis: {
      font: '10pt Helvetica',
      fontSize: '13px',
      color: '#505050',
    },
    xAxis: {
      font: '10pt Helvetica',
      fontSize: '13px',
      color: '#505050',
    },
  },
  langOptions: {
    loading: 'Cargando...',
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    weekdays: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    decimalPoint: '.',
    numericSymbols: ['Mil', 'M', 'G', 'T', 'P', 'E'],
    resetZoom: 'Reiniciar zoom',
    resetZoomTitle: 'Reiniciar zoom level 1:1',
    thousandsSep: ' ',
    printChart: 'Imprimir gráfico',
    downloadPNG: 'Descargar imagen PNG ',
    downloadJPEG: 'Descargar imagen JPEG ',
    downloadPDF: 'Descargar documento PDF',
    downloadSVG: 'Descargar imagen vector SVG ',
    contextButtonTitle: 'Menú de contexto del gráfico',
    downloadCSV: 'Descargar CSV',
    downloadXLS: 'Descargar XLS',
    openInCloud: 'Abrir en Highcharts Cloud',
    viewData: 'Ver tabla de datos',
    accessibility: {
      screenReaderRegionLabel: 'Información del gráfico.',
      navigationHint:
        'Use la tecla G para saltar al gráfico {#plural(numSeries, y navegar entre series de datos,)}',
      defaultChartTitle: 'Categoría',
      longDescriptionHeading: '',
      noDescription: 'No disponible',
      structureHeading: 'Estructura',
      viewAsDataTable: 'Ver como tabla de datos',
      chartHeading: '{title}',
      chartContainerLabel:
        'Gráfico interactivo. {title}. Use las flechas hacia arriba y hacia abajo para navegar en el gráfico',
      rangeSelectorMinInput: 'Select start date.',
      rangeSelectorMaxInput: 'Select end date.',
      tableSummary: 'Table presentación del gráfico.',
      mapZoomIn: 'Zoom chart',
      mapZoomOut: 'Zoom out chart',
      rangeSelectorButton: 'Seleccione rango {buttonText}',
      legendItem: 'Filtrar datos {itemName}',
      svgContainerTitle: '{chartTitle}',
      seriesTypeDescriptions: {
        boxplot:
          'Box plot charts are typically used to display groups de statistical data. Each data point in the chart can have up to 5 values: minimum, lower quartile, median, upper quartile, and maximum.',
        arearange:
          'Arearange charts are line charts displaying a range between a lower and higher value for each point.',
        areasplinerange:
          'These charts are line charts displaying a range between a lower and higher value for each point.',
        bubble:
          'Bubble charts are scatter charts where each data point also has a size value.',
        columnrange:
          'Columnrange charts are column charts displaying a range between a lower and higher value for each point.',
        errorbar:
          'Errorbar series are used to display the variability de the data.',
        funnel:
          'Funnel charts are used to display reduction de data in stages.',
        pyramid:
          'Pyramid charts consist de a single pyramid with item heights corresponding to each point value.',
        waterfall:
          'A waterfall chart is a column chart where each column contributes towards a total end value.',
      },
      chartTypes: {
        emptyChart: 'Gráfico vacío',
        mapTypeDescription: 'Moap de {mapTitle} with {numSeries} data series.',
        unknownMap: 'Map de unspecified region with {numSeries} data series.',
        combinationChart: 'Combination chart with {numSeries} data series.',
        defaultSingle:
          'Gráfico con {numPoints} datos {#plural(numPoints, points, point)}.',
        defaultMultiple: 'Gráfico con {numSeries} series de datos.',
        splineSingle:
          'Gráfico de líneas con {numPoints} series de datos {#plural(numPoints, points, point)}.',
        splineMultiple: 'Gráfico de líneas con {numSeries} lineas.',
        lineSingle:
          'Gráfico de lineas con {numPoints} series de datos {#plural(numPoints, points, point)}.',
        lineMultiple: 'Line chart with {numSeries} lines.',
        columnSingle:
          'Gráfico de columnas con {numPoints} {#plural(numPoints, barras, bar)}.',
        columnMultiple: 'Gráfico de columnas con {numSeries} series de datos.',
        barSingle:
          'Gráfico de barras con {numPoints} {#plural(numPoints, barras, bar)}.',
        barMultiple: 'Gráfico de barras con {numSeries} series de datos.',
        pieSingle:
          'Gráfico de pastel con {numPoints} {#plural(numPoints, partes, slice)}.',
        pieMultiple: 'Gráfico de pastel con {numSeries} pasteles.',
        scatterSingle:
          'Scatter chart with {numPoints} {#plural(numPoints, points, point)}.',
        scatterMultiple: 'Scatter chart with {numSeries} data series.',
        boxplotSingle:
          'Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.',
        boxplotMultiple: 'Boxplot with {numSeries} data series.',
        bubbleSingle:
          'Bubble chart with {numPoints} {#plural(numPoints, bubbles, bubble)}.',
        bubbleMultiple: 'Bubble chart with {numSeries} data series.',
      },
      axis: {
        xAxisDescriptionSingular:
          'El gráfico tiene 1 eje X, mostrando categorías.',
        xAxisDescriptionPlural:
          'El gráfico tiene {numAxes} ejes X, mostrando {#each(names, -1) } y {names[-1]}',
        yAxisDescriptionSingular:
          'El gráfico tiene 1 eje Ye, mostrando {names[0]}.',
        yAxisDescriptionPlural:
          'El gráfico tiene {numAxes} ejes Ye, mostrando {#each(names, -1) } y {names[-1]}',
      },
      exporting: {
        chartMenuLabel: 'Exportación del gráfico',
        menuButtonLabel: 'Ver el menú de exportación',
        exportRegionLabel: 'Menú de exportación',
      },
      series: {
        summary: {
          default:
            '{name}, series {ix} de {numSeries} con {numPoints} datps {#plural(numPoints, puntos, punto)}.',
          defaultCombination:
            '{name}, series {ix} de {numSeries} con {numPoints} datos {#plural(numPoints, puntos, punto)}.',
          line:
            '{name}, linea {ix} de {numSeries} con {numPoints} data {#plural(numPoints, points, point)}.',
          lineCombination:
            '{name}, series {ix} de {numSeries}. Lineas con {numPoints} datos {#plural(numPoints, points, point)}.',
          spline:
            '{name}, lineas {ix} de {numSeries} con {numPoints} datos {#plural(numPoints, puntos, punto)}.',
          splineCombination:
            '{name}, series {ix} de {numSeries}. Line con {numPoints} data {#plural(numPoints, puntos, punto)}.',
          column:
            '{name}, columnas {ix} de {numSeries} con {numPoints} {#plural(numPoints, columnas, columna)}.',
          columnCombination:
            '{name}, series {ix} de {numSeries}. Bar series con {numPoints} {#plural(numPoints, columnas, columna)}.',
          bar:
            '{name}, barras {ix} de {numSeries} con {numPoints} {#plural(numPoints, barras, barra)}.',
          barCombination:
            '{name}, series {ix} de {numSeries}. Bar series con {numPoints} {#plural(numPoints, barras, bar)}.',
          pie:
            '{name}, pastel {ix} de {numSeries} con {numPoints} {#plural(numPoints, partes, parte)}.',
          pieCombination:
            '{name}, series {ix} de {numSeries}. Pie con {numPoints} {#plural(numPoints, partes, slice)}.',
          scatter:
            '{name}, scatter plot {ix} de {numSeries} con {numPoints} {#plural(numPoints, points, point)}.',
          scatterCombination:
            '{name}, series {ix} de {numSeries}, scatter plot con {numPoints} {#plural(numPoints, points, point)}.',
          boxplot:
            '{name}, boxplot {ix} de {numSeries} con {numPoints} {#plural(numPoints, boxes, box)}.',
          boxplotCombination:
            '{name}, series {ix} de {numSeries}. Boxplot con {numPoints} {#plural(numPoints, boxes, box)}.',
          bubble:
            '{name}, bubble series {ix} de {numSeries} con {numPoints} {#plural(numPoints, bubbles, bubble)}.',
          bubbleCombination:
            '{name}, series {ix} de {numSeries}. Bubble series con {numPoints} {#plural(numPoints, bubbles, bubble)}.',
          map:
            '{name}, map {ix} de {numSeries} con {numPoints} {#plural(numPoints, areas, area)}.',
          mapCombination:
            '{name}, series {ix} de {numSeries}. Map con {numPoints} {#plural(numPoints, areas, area)}.',
          mapline:
            '{name}, line {ix} de {numSeries} con {numPoints} data {#plural(numPoints, points, point)}.',
          maplineCombination:
            '{name}, series {ix} de {numSeries}. Line con {numPoints} data {#plural(numPoints, points, point)}.',
          mapbubble:
            '{name}, bubble series {ix} de {numSeries} con {numPoints} {#plural(numPoints, bubbles, bubble)}.',
          mapbubbleCombination:
            '{name}, series {ix} de {numSeries}. Bubble series con {numPoints} {#plural(numPoints, bubbles, bubble)}.',
        },
        description: '{description}',
        xAxisDescription: 'Eje X, {name}',
        yAxisDescription: 'Eje Y, {name}',
      },
    },
  },
  colors: [
    '#d83d3d',
    '#c45b00',
    '#026729',
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
  ],
  colorFillPattern: [
    `url(#custom-pattern-6)`,
    `url(#custom-pattern-14)`,
    `url(#custom-pattern-3)`,
    `url(#custom-pattern-0)`,
    `url(#custom-pattern-1)`,
    `url(#custom-pattern-2)`,
    `url(#custom-pattern-4)`,
    `url(#custom-pattern-5)`,
    `url(#custom-pattern-7)`,
    `url(#custom-pattern-8)`,
    `url(#custom-pattern-9)`,
    `url(#custom-pattern-10)`,
    `url(#custom-pattern-11)`,
    `url(#custom-pattern-12)`,
    `url(#custom-pattern-13)`,
    `url(#custom-pattern-15)`,
    `url(#custom-pattern-16)`,
    `url(#custom-pattern-17)`,
  ],
};

/**
 * Variable descriptions fot the graphic
 */
export const VARIABLE_GRAPHIC_OPTION = {
  TypeOfDisability: {
    type: 'column',
    title: 'Tipo de discapacidad',
    subtitle: 'Cantidad de personas por tipo de discapacidad',
    xAxis: ['Censo 2011'],
    yAxis: 'Cantidad de personas',
    conteo: 'personas',
    columns: [{title: 'Tipo de discapacidad'}, {title: 'Número de personas'}],
  },
  Sex: {
    type: 'pie',
    title: 'Sexo',
    subtitle: 'Cantidad de personas con discapacidad por sexo',
    xAxis: ['Censo 2011'],
    yAxis: 'Cantidad de personas',
    conteo: 'personas',
    columns: [{title: 'Sexo'}, {title: 'Número de personas'}],
  },
  TypeOfDisabilityBySex: {
    type: 'stackedColumn',
    title: 'Tipo de discapacidad según sexo',
    tableName: 'Tipo de discapacidad',
    subtitle: 'Cantidad de personas según tipo discapacidad por sexo',
    xAxis: [
      'Sexo',
      'Para ver',
      'Para oir',
      'Para hablar',
      'Para caminar',
      'Para utilizar brazos y manos',
      'Tipo intelectual',
      'Tipo mental',
    ],
    yAxis: 'Cantidad de personas',
    conteo: 'personas',
    numRow: 8,
    dtOptions: {
      retrieve: true,
      pagingType: 'full_numbers',
      pageLength: 50,
      searching: true,
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'excel',
          text: '<i class="fas fa-download" aria-label="Descargar tabla"> </i>',
          className: 'btn-second datatable',
        },
        {
          extend: 'print',
          text: '<i class="fas fa-print" aria-label="Imprimir"></i>',
          className: 'btn-second datatable',
        },
      ],
      columns: [
        {title: 'Sexo'},
        {title: 'Para ver'},
        {title: 'Para oir'},
        {title: 'Para hablar'},
        {title: 'Para caminar'},
        {title: 'Para utilizar brazos y manos'},
        {title: 'Tipo intelectual'},
        {title: 'Tipo mental'},
      ],
      language: {
        processing: 'Procesando...',
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ elementos',
        info: 'Mostrando desde _START_ al _END_ de _TOTAL_ elementos',
        infoEmpty: 'Mostrando ningún elemento.',
        infoFiltered: '(filtrado _MAX_ elementos total)',
        infoPostFix: '',
        loadingRecords: 'Cargando registros...',
        zeroRecords: 'No se encontraron registros',
        emptyTable: 'No hay datos disponibles en la tabla',
        paginate: {
          first: 'Primero',
          previous: 'Anterior',
          next: 'Siguiente',
          last: 'Último',
        },
        aria: {
          sortAscending: ': Activar para ordenar la tabla en orden ascendente',
          sortDescending:
            ': Activar para ordenar la tabla en orden descendente',
        },
      },
    },
    columns: [
      {title: 'Sexo'},
      {title: 'Para ver'},
      {title: 'Para oir'},
      {title: 'Para hablar'},
      {title: 'Para caminar'},
      {title: 'Para utilizar brazos y manos'},
      {title: 'Tipo intelectual'},
      {title: 'Tipo mental'},
    ],
  },
};
