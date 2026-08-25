import {Component, OnInit} from '@angular/core';
import {Layout} from '@swimlane/ngx-graph';
import {ActivatedRoute} from '@angular/router';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {Router} from '@angular/router';

import {SharedService} from '../../../../shared/shared.service';
import {DagreNodesOnlyLayout} from './customLayout/customDagreNodesOnly';
import {stepRound} from './customLayout/customStepCurved';
import {DetailEvaluationService} from './detail-evaluation.service';
import {CounterListService} from './counter-list/counter-list.service';
import {AlertService} from '../../../../utils/alerts/alerts.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-detail-evaluation',
  templateUrl: './detail-evaluation.component.html',
  styleUrls: ['./detail-evaluation.component.scss'],
  providers: [DetailEvaluationService, CounterListService],
})
export class DetailEvaluationComponent implements OnInit {
  public hierarchialGraph: any;
  public userDetail: any;
  public idEvaluation: any;
  public siteData: any;
  public siteName: string;
  public packageName: string;
  public isAlreadySelected: boolean;
  public seeOnlyMap: boolean;
  public selectedPages = [];

  public noSelectedMapSite: any;
  public selectedMapSite: any;

  public alertSaveSuccess: any;
  public alertSaveError: any;

  public curve: any = stepRound;
  public layout: Layout = new DagreNodesOnlyLayout();

  public translatePath = 'administrator.evaluations.selectionPage.mapSite';
  public translatePathDetail = 'administrator.evaluations.detail';
  public translatePathModal =
    'administrator.evaluations.detail.modalCounterList';
  public selectedLabel: string;
  public noselectedLabel: string;

  panToNodeObservable: Subject<string> = new Subject<string>();
  update$: Subject<boolean> = new Subject();

  /**
   * Constructor detail-evaluation
   * @param route
   * @param detailEvaluationService
   * @param translate
   * @param sharedService
   * @param router
   * @param alertService
   * @param counterListService
   */
  constructor(
    private route: ActivatedRoute,
    private detailEvaluationService: DetailEvaluationService,
    private translate: TranslateService,
    private sharedService: SharedService,
    private router: Router,
    private alertService: AlertService,
    private counterListService: CounterListService,
  ) {
    this.userDetail = {};
    this.hierarchialGraph = {};
    this.siteData = {};
    this.noSelectedMapSite = {};
    this.selectedMapSite = {};
    this.hierarchialGraph.nodes = [
      {
        id: 'idNode1',
        label: 'Loading...',
        options: {
          url: 'Loading...',
          color: '#DEDEDE',
          textcolor: '#4B4B4B',
          isSelected: false,
        },
      },
    ];
    this.hierarchialGraph.links = [];
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idEvaluation = params.id;
    });
    this.getTranslationsLabels();
    this.userDetail = JSON.parse(
      this.sharedService.getItemFromLocalStorage('userDetail'),
    );
    this.showGraph();
    this.getSiteData();
  }

  /**
   * Puts the graphs in the center.
   */
  panToRootNode() {
    this.panToNodeObservable.next('idNode1');
    this.update$.next(true);
  }

  /**
   * Load the data of the graph.
   */
  showGraph() {
    this.detailEvaluationService
      .getParsedSiteMap(this.userDetail.userToken, this.idEvaluation)
      .subscribe(
        data => {
          this.hierarchialGraph = data;
          this.noSelectedMapSite = data;
          setTimeout(() => {
            this.panToRootNode();
          }, 1000);
        },
        error => {
          this.hierarchialGraph.nodes = [
            {
              id: 'idNode1',
              label: 'ERROR!',
              options: {
                url: 'https://web.ac.cr/',
                color: '#D8400E',
                textcolor: '#FFFFFF',
                isSelected: false,
              },
            },
          ];
          this.hierarchialGraph.links = [];
        },
      );
  }

  /**
   * Change the filter when is see only map.
   * @param event
   */
  applyStateFilter(event: any): void {
    if (event.index === 0) {
      this.seeOnlyMap = true;
      this.hierarchialGraph = this.noSelectedMapSite;
    } else if (event.index === 1) {
      this.seeOnlyMap = false;
      this.hierarchialGraph = this.selectedMapSite;
      this.selectedPages.length = this.selectedMapSite.selectedCount;
    }
  }

  /**
   * Get extra data from the site.
   */
  getSiteData() {
    this.detailEvaluationService
      .getSiteMap(this.userDetail.userToken, this.idEvaluation)
      .subscribe(data => {
        this.siteData = JSON.parse(data.siteMap);
        this.siteName = data.siteName;
        if (data.pagesChoosed === 0) {
          this.isAlreadySelected = false;
          this.seeOnlyMap = false;
        } else {
          this.isAlreadySelected = true;
          this.seeOnlyMap = true;
          this.packageName = data.evaluationsPackages.name;
          this.getSelectedSiteMap();
        }
      });
  }

  /**
   * Get the already selected site map for show when its only see map.
   */
  getSelectedSiteMap() {
    this.detailEvaluationService
      .getSelectedSiteMap(this.userDetail.userToken, this.idEvaluation)
      .subscribe(async data => {
        data = await JSON.parse(data.selectedSiteMap);
        this.selectedMapSite = data;
      });
  }

  /**
   * Function to select the node clicked.
   * @param node
   */
  selectNode(node: any) {
    if (this.isAlreadySelected === false) {
      if (!node.options.isSelected) {
        if (this.selectedPages.length < 32) {
          this.selectedPages.push({topic: node.label, url: node.options.url});
          node.options.color = '#0F828A';
          node.options.textcolor = '#FFFFFF';
          node.options.isSelected = true;
        }
      } else {
        const nodeSelected = this.selectedPages
          .map(e => {
            return e.url;
          })
          .indexOf(node.options.url);
        this.selectedPages.splice(nodeSelected, 1);
        node.options.color = '#DEDEDE';
        node.options.textcolor = '#4B4B4B';
        node.options.isSelected = false;
      }
    }
  }

  /**
   * Save the selected pages.
   */
  setSelectedPages() {
    this.hierarchialGraph.selectedCount = this.selectedPages.length;
    this.detailEvaluationService
      .saveSelectedPages(
        this.userDetail.userToken,
        this.idEvaluation,
        this.selectedPages,
        JSON.stringify(this.hierarchialGraph),
      )
      .subscribe(
        data => {
          this.alertService.openAlert(
            this.alertSaveSuccess.title,
            this.alertSaveSuccess.text,
            'éxito',
            () => {
              this.router.navigate([
                '/administrator/evaluations/list-evaluations',
              ]);
            },
          );
        },
        error => {
          this.alertService.openAlert(
            this.alertSaveError.title,
            this.alertSaveError.text,
            'error',
            () => {},
          );
        },
      );
  }

  /**
   * Opens the modal to see the list of links of some category.
   * @param counter
   * @param title
   * @param text
   * @param list
   */
  seeList(counter: string, title: string, text: string, list: any) {
    this.counterListService.openDialog(
      '50%',
      counter,
      this.translatePathModal + title,
      this.translatePathModal + text,
      list,
      () => {},
      () => {},
    );
  }

  /**
   * For get the aria-label of a node. It allows to know if a node is selected or not.
   * @param node
   */
  getSelectedLabel(node: any) {
    if (!node.options.isSelected) {
      return this.noselectedLabel;
    } else if (node.options.isSelected) {
      return this.selectedLabel;
    }
  }

  /**
   * Download a Zip with the site map.
   */
  downloadZip() {
    this.detailEvaluationService
      .getPathZipTree(this.userDetail.userToken, this.idEvaluation)
      .subscribe(x => this.handleZipFile(x));
  }

  /**
   * Open another page to download the zip.
   * @param response
   */
  handleZipFile(response) {
    window.open(
      this.detailEvaluationService.getCompletePathToDownload(response),
      '_blank',
    );
  }

  /**
   * For go back to the list of evaluations.
   */
  goBack() {
    this.router.navigate(['/administrator/evaluations/list-evaluations']);
  }

  /**
   * For translate all label variables.
   */
  getTranslationsLabels() {
    this.translate
      .get(this.translatePath + '.selected')
      .subscribe((res: any) => {
        this.selectedLabel = res;
      });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate
        .get(this.translatePath + '.selected')
        .subscribe((res: any) => {
          this.selectedLabel = res;
        });
    });

    this.translate
      .get(this.translatePath + '.noselected')
      .subscribe((res: any) => {
        this.noselectedLabel = res;
      });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate
        .get(this.translatePath + '.noselected')
        .subscribe((res: any) => {
          this.noselectedLabel = res;
        });
    });

    this.translate
      .get(this.translatePathDetail + '.alertSaveSuccess')
      .subscribe((res: any) => {
        this.alertSaveSuccess = res;
      });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate
        .get(this.translatePathDetail + '.alertSaveSuccess')
        .subscribe((res: any) => {
          this.alertSaveSuccess = res;
        });
    });

    this.translate
      .get(this.translatePathDetail + '.alertSaveError')
      .subscribe((res: any) => {
        this.alertSaveError = res;
      });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate
        .get(this.translatePathDetail + '.alertSaveError')
        .subscribe((res: any) => {
          this.alertSaveError = res;
        });
    });
  }

  public goToLink() {}
}
