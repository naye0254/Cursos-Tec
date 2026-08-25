import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Chart} from 'angular-highcharts';
import {GeneralStatisticsService} from './general-statistics.service';
import {
  CHART_OPTIONS,
  ChartOptionsFactory,
  COLORS_FOR_AUTOMATIC_EVALUATION_GRAPHIC,
  COLORS_FOR_MANUAL_EVALUATION_GRAPHIC
} from './general-statistics-Options';

@Component({
  selector: 'app-general-statistics',
  templateUrl: './general-statistics.component.html',
  styleUrls: ['./general-statistics.component.scss']
})
export class GeneralStatisticsComponent implements OnInit {
  public selectedClients = [];
  public selectedSegments = [];
  public clientsDropdownSettings = {};
  public segmentsDropdownSettings = {};
  public listClients = [];
  public listSegments = [];
  public initialDate: any;
  public finalDate: any;

  constructor(
    public generalStatisticsService: GeneralStatisticsService,
    public datePipe: DatePipe
  ) {
    this.getAllDirectClients();
    this.getAllActiveSegments();
  }
  chart: Chart;

  ngOnInit() {
    this.clientsDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'firstName',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Deseleccionar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      scrollable: true
    };

    this.segmentsDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Seleccionar todos',
      unSelectAllText: 'Deseleccionar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      scrollable: true
    };
  }

  /**
   * Fetches the data needed to display the graph based on the current state of the filters
   */
  fetchGeneralStatistics(selectAllEvent = null, clientFetch = true) {
    if (selectAllEvent && clientFetch) {
      this.selectedClients = selectAllEvent;
    }
    if (selectAllEvent && !clientFetch) {
      this.selectedSegments = selectAllEvent;
    }
    const clientsIds = [];
    const segmentsIds = [];

    const initialDate = this.initialDate || '1970/01/01';
    const finalDate = this.finalDate || '3000/01/01';
    const formatedInitialDate = this.datePipe.transform(new Date(initialDate), 'yyyy/MM/dd');
    const formatedFinalDate = this.datePipe.transform(new Date(finalDate), 'yyyy/MM/dd');

    for (const d of this.selectedClients) {
      clientsIds.push(d['id']);
    }
    for (const d of this.selectedSegments) {
      segmentsIds.push(d['id']);
    }

    const noClients = clientsIds.length === 0;
    const noSegments = segmentsIds.length === 0;

    this.generalStatisticsService
      .getGeneralStatistics(clientsIds, segmentsIds, formatedInitialDate, formatedFinalDate)
      .subscribe(
        async result => {
          let formatedData =
            noClients || noSegments
              ? await this.formatDataToGraphicOptionsWithoutClientOrSegment(result)
              : await this.formatDataToGraphicOptions(result);

          this.refreshChart(
            formatedData.categories,
            [{data: formatedData.data, name: 'Cantidad de Evaluaciones'}],
            noClients,
            noSegments
          );
        },
        error => {
          console.log('ERROR:', error); //TODO to make a better implementation of how to handle this
        }
      );
  }

  /**
   * Get all direct clients
   */
  getAllDirectClients(): void {
    this.generalStatisticsService
      .getAllDirectClients<any>()
      .pipe()
      .subscribe(data => {
        this.listClients = data;
        this.selectedClients = this.listClients;
        this.fetchGeneralStatistics(this.listClients, true);
      });
  }

  /**
   * Get all active segments
   */
  getAllActiveSegments(): void {
    this.generalStatisticsService
      .getAllSegments<any>()
      .pipe()
      .subscribe(data => {
        this.listSegments = data;
        this.selectedSegments = this.listSegments;
        this.fetchGeneralStatistics(this.listSegments, false);
      });
  }

  async refreshChart(graphListX: any, graphListY: any, noClients: boolean, noSegments: boolean) {
    let xAxisText = ', clientes y segmentos';
    if (noClients || noSegments) {
      if (noClients) xAxisText = ' y segmentos';
      if (noSegments) xAxisText = ' y clientes';
    }
    if (noClients && noSegments) {
      xAxisText = '';
    }

    const graphicChartOptions = await new ChartOptionsFactory(
      graphListX,
      graphListY,
      1,
      'Estadísticas de Evaluaciones en un rango de tiempo',
      `Gráfico de evaluaciones por años${xAxisText}`,
      'Estadísticas',
      'OTAI - Evaluador de Accesibilidad Web',
      'http://otai/eaw/#/',
      `Años${xAxisText}`,
      'Cantidad',
      'Evaluaciones',
      false,
      false
    ).buildGraphicOptions();

    graphicChartOptions['colors'] = COLORS_FOR_AUTOMATIC_EVALUATION_GRAPHIC;

    await (this.chart = null);
    this.chart = await new Chart(graphicChartOptions);
  }

  /**
   * Format the data to the graphic structure without client
   * @param data
   */
  async formatDataToGraphicOptionsWithoutClientOrSegment(data) {
    const xAxis = {data: [], categories: []};
    const year_keys = Object.keys(data);

    year_keys.forEach(y => {
      if (!data[y].count) {
        const segmentOrClient_keys = Object.keys(data[y]);
        const year_group = {name: y, categories: segmentOrClient_keys};

        segmentOrClient_keys.forEach(sc => {
          const count = data[y][sc]['count'];
          xAxis.data.push(count);
        });

        xAxis.categories.push(year_group);
      } else {
        const count = data[y]['count'];
        xAxis.data.push(count);
        xAxis.categories.push({name: y});
      }
    });

    return xAxis;
  }

  /**
   * Format the data to the graphic structure
   * @param data
   */
  async formatDataToGraphicOptions(data) {
    const xAxis = {data: [], categories: []};
    const year_keys = Object.keys(data);

    year_keys.forEach(y => {
      const year_group = {name: y, categories: []};

      const client_keys = Object.keys(data[y]);

      client_keys.forEach(c => {
        const client_group = {name: c, categories: []};

        const segment_keys = Object.keys(data[y][c]);
        client_group.categories = segment_keys;

        segment_keys.forEach(s => {
          const count = data[y][c][s]['count'];
          xAxis.data.push(count);
        });

        year_group.categories.push(client_group);
      });

      xAxis.categories.push(year_group);
    });

    return xAxis;
  }
}
