import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {Chart, Highcharts} from 'angular-highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
import {Unsubscribable} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
highcharts3D(Highcharts);

import {StatisticsService} from './../statistics.service';
import {SharedService} from '../../../../../../shared/shared.service';
import {DetailConstants} from '../../detail.constants';

import {
  CHART_OPTIONS,
  ChartOptionsFactory,
  COLORS_FOR_AUTOMATIC_EVALUATION_GRAPHIC,
  COLORS_FOR_MANUAL_EVALUATION_GRAPHIC,
} from './highcharts.graphicOptionsFactory';

@Component({
  selector: 'app-highchart-selector',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss'],
})
/**
 * Highcharts Component Class
 */
export class HighchartsComponent implements OnInit, OnDestroy {
  public evaluation: any;
  public graphicChartOptions: any;
  public conformityLevel: string;
  public chart: any;
  private unsubscribeStatisticsServiceData: Unsubscribable;
  public displayGraphic: boolean;
  public displayTable: boolean;
  public patternOptionSelected: boolean;
  public highContrastOptionSelected: boolean;
  public highContrast: string;
  public dataTableMatrixVariables: any;
  public dataTableColumnHeaders: any;
  public key = 'Pautas';
  public reverse = true;
  public graphicTypeNumber: number;
  public patternStateAriaLabel: string;
  public highContrastStateAriaLabel: string;
  public xGraphicVariableList: any;
  public yGraphicVariableList: any;
  public graphicWithResults: boolean;
  private serviceData: any;
  public pH: number;
  public filter: any;
  public langIANA: string;

  /**
   * Constructor method
   * @param sharedService
   * @param statisticsService
   */
  constructor(
    private sharedService: SharedService,
    private statisticsService: StatisticsService,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.evaluation = {};
    this.pH = 1;
    this.conformityLevel = '';
    this.graphicChartOptions = {};
    this.chart = null;
    this.dataTableColumnHeaders = null;
    this.dataTableMatrixVariables = null;
    this.displayGraphic = true;
    this.displayTable = false;
    this.patternOptionSelected = false;
    this.highContrastOptionSelected = false;
    this.graphicTypeNumber = 0;
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;

      this.setInitLanguage(this.langIANA);
    });
    this.graphicWithResults = true;
    this.serviceData = {};

    Highcharts.setOptions({
      lang: CHART_OPTIONS.langOptions,
    } as any);
  }

  OnDestroy() {
    if (this.unsubscribeStatisticsServiceData) {
      this.unsubscribeStatisticsServiceData.unsubscribe();
    }
  }

  ngOnInit() {
    this.evaluation = JSON.parse(
      this.sharedService.getItemFromLocalStorage('evaluationDetail'),
    );
    this.initSuscribedVariables();
  }

  ngOnDestroy(): void {
    if (this.unsubscribeStatisticsServiceData) {
      this.unsubscribeStatisticsServiceData.unsubscribe();
    }
  }

  /**
   * Set initial languages
   * @param language string language
   */
  private setInitLanguage(language: string) {
    this.sharedService.setTitle(DetailConstants.HTML_TITLE[language].title);
    this.patternStateAriaLabel =
      DetailConstants.BUTTON_STATE[language].inactive;
    this.highContrastStateAriaLabel =
      DetailConstants.BUTTON_STATE[language].inactive;
  }

  /**
   * Sort chart
   * @param key
   */
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  /**
   * Validate page number
   * @param page
   */
  handlePageEmitted(page: any) {
    if (!isNaN(page)) {
      this.pH = +page;
    }
  }

  /**
   * Subscribe to parent variables
   */
  initSuscribedVariables() {
    this.unsubscribeStatisticsServiceData = this.statisticsService.statisticsServiceDataSubject.subscribe(
      serviceData => {
        this.updateData(serviceData);
      },
    );
  }

  /**
   * Update data in view
   * @param serviceData
   */
  async updateData(serviceData) {
    this.serviceData = serviceData;
    await this.formatDataToGraphicOptions(serviceData);
    await this.formatDataToDataTable(serviceData);
    this.refreshChart();
    this.rerenderDataTable(this.dataTableMatrixVariables);
  }

  /**
   * Recive a list of lists of objects, and return a list of
   * objects with format: [ obj, obj, ... ]
   * Each object should have the following properties: name, data.
   * Return  [ {x1, y11, y12, y1n}, {x2, y21, y22, y2n}, ... ]
   * @param {Array} serviceData
   */
  formatDataToDataTable(serviceData: any) {
    const xVariableList = serviceData.results.xVariableList;
    const yVariableList = serviceData.results.yVariableList;
    const rowsData = [];
    this.dataTableColumnHeaders = ['Pautas'];
    yVariableList.forEach(element => {
      this.dataTableColumnHeaders.push(element.name);
    });

    for (let index = 0; index < xVariableList.length; index++) {
      const currentRow = [];
      currentRow.push(xVariableList[index]);
      yVariableList.forEach(element => {
        currentRow.push(element.data[index]);
      });
      rowsData.push(currentRow);
    }
    this.dataTableMatrixVariables = rowsData;
  }

  /**
   * Change constrast of graphic
   */
  changeGraphicContrast() {
    this.highContrastOptionSelected = !this.highContrastOptionSelected;
    if (this.highContrastOptionSelected) {
      this.highContrastStateAriaLabel =
        DetailConstants.BUTTON_STATE[this.langIANA].active;
    } else {
      this.highContrastStateAriaLabel =
        DetailConstants.BUTTON_STATE[this.langIANA].inactive;
    }
    this.refreshChart();
  }

  /**
   * Change patterns to graphic
   */
  changeGraphicPattern() {
    this.patternOptionSelected = !this.patternOptionSelected;
    if (this.patternOptionSelected) {
      this.patternStateAriaLabel =
        DetailConstants.BUTTON_STATE[this.langIANA].active;
    } else {
      this.patternStateAriaLabel =
        DetailConstants.BUTTON_STATE[this.langIANA].inactive;
    }
    this.refreshChart();
  }

  /**
   * Change the graphic type
   * @param graphicType
   */
  changeChartType(graphicType) {
    this.graphicTypeNumber = graphicType;
    this.refreshChart();
  }

  /**
   * Show the table
   */
  showTable() {
    this.displayGraphic = false;
    this.displayTable = true;
    this.rerenderDataTable(this.dataTableMatrixVariables);
  }

  /**
   * Show the graphic
   */
  showGraphic() {
    this.displayGraphic = true;
    this.displayTable = false;
    this.refreshChart();
  }

  /**
   * Set the results in the graphic
   * @param list
   */
  async setGraphicWithResultsState(list: any) {
    if (list.length > 0) {
      this.graphicWithResults = true;
    } else {
      this.graphicWithResults = false;
    }
  }

  /**
   * Formar the data to the graphic structure
   * @param serviceData
   */
  async formatDataToGraphicOptions(serviceData) {
    this.xGraphicVariableList = serviceData.results.xVariableList;
    this.yGraphicVariableList = serviceData.results.yVariableList;
    await this.setGraphicWithResultsState(this.xGraphicVariableList);
    const enlacee = 'https://www.w3.org/TR/WCAG21/#text-alternatives';
    const tempList = [];
    this.xGraphicVariableList.forEach(category => {
      tempList.push(
        `<a aria-label="${category}. Enlace externo." href="${enlacee}" target="${'_blank'}">${category}</a>`,
      );
    });
    this.xGraphicVariableList = tempList;
  }

  async refreshChart() {
    this.graphicChartOptions = await new ChartOptionsFactory(
      this.xGraphicVariableList,
      this.yGraphicVariableList,
      this.graphicTypeNumber,
      'Estadísticas de Evaluación',
      'Gráfico de hallazgos encontrados',
      'Estadísticas',
      'OTAI - Evaluador de Accesibilidad Web',
      'http://otai/eaw/#/',
      'Pautas x Hallazgos',
      'Hallazgos (cantidad)',
      'hallazgos',
      this.patternOptionSelected,
      this.highContrastOptionSelected,
    ).buildGraphicOptions();

    if (!this.patternOptionSelected) {
      if (this.serviceData.evaluationType === 'automatic') {
        this.graphicChartOptions.colors = COLORS_FOR_AUTOMATIC_EVALUATION_GRAPHIC;
      }
      if (this.serviceData.evaluationType === 'manual') {
        this.graphicChartOptions.colors = COLORS_FOR_MANUAL_EVALUATION_GRAPHIC;
      }
    }

    await (this.chart = null);
    this.chart = await new Chart(this.graphicChartOptions);
  }

  /**
   * Render the table
   * @param data
   */
  rerenderDataTable(data: any): void {
    this.dataTableMatrixVariables = [...data];
  }
}
