import {Component, OnInit, OnDestroy, OnChanges} from '@angular/core';

import {Country} from '../../../models/country';
import {ClientsService} from '../clients.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {SharedService} from '../../../shared/shared.service';
import {ManageClientsConstants} from '../clients.constants';
import {Router, ActivatedRoute} from '@angular/router';
import {Segments} from 'src/app/models/segments.model';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
})
export class ViewClientComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public step: number;
  private selectedCountry: number;
  private countryZero: Country;
  private segmentZero: Segments;
  private seeAllLabel: string;

  public langIANA: string;
  public subtitle: string;
  public searchFilter: string;
  public list: any[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private clientsService: ClientsService,
    public sharedService: SharedService,
  ) {
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.setHTMLTitle(this.langIANA);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.setHTMLTitle(this.langIANA);
    });

    let options = this.clientsService.getItemFromLocalStorage(
      'persistentOptions',
    );
    if (options) {
      options = JSON.parse(options);
      this.step = options.step;
      this.selectedCountry = options.selectedCountry;
      this.subtitle =
        ManageClientsConstants.VIEW_CLIENTS[this.langIANA].subtitleSegment;
    } else {
      this.step = 0;
      this.selectedCountry = null;
      this.subtitle =
        ManageClientsConstants.VIEW_CLIENTS[this.langIANA].subtitleCountry;
    }
    this.seeAllLabel =
      ManageClientsConstants.SEE_ALL_LABEL[this.langIANA].seeAll;

    this.countryZero = new Country(
      0,
      this.seeAllLabel,
      this.seeAllLabel,
      this.seeAllLabel,
    );
    this.segmentZero = new Segments(0, this.seeAllLabel, null, null, null, 0);
  }

  ngOnInit() {
    if (this.step === 0) {
      this.getCountries();
    } else {
      this.getSegments();
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(
      ManageClientsConstants.VIEW_CLIENTS[language].titleHtml,
    );
  }

  /**
   * Get countries
   */
  private getCountries(applyFilter = false, filterValue = '') {
    this.clientsService
      .getModelListByStatus<Country>('Countries', null)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        data = [this.countryZero].concat(data);
        if (applyFilter) {
          this.list = this.fiterList(data, filterValue);
        } else {
          this.list = data;
        }
      });
  }

  private getSegments(applyFilter = false, filterValue = '') {
    this.clientsService
      .getSegmensByCountry(this.selectedCountry)
      .subscribe(async data => {
        data = await [this.segmentZero].concat(data);
        if (applyFilter) {
          this.list = this.fiterList(data, filterValue);
        } else {
          this.list = data;
        }
      });
  }

  private getAllSegmens() {
    this.clientsService.getAllSegmens().subscribe(async data => {
      for (const segment of data) {
        segment.name = `${segment.name} (${segment.segmentsCountries.name})`;
      }
      this.list = await [this.segmentZero].concat(data);
    });
  }

  private fiterList(data, filterValue) {
    return data.filter(x => {
      let name: string = x.name;
      name = name.toLowerCase();
      return name.includes(filterValue);
    });
  }

  /**
   * Filter the list
   * @param event filter
   */
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    if (this.step === 0) {
      this.getCountries(true, filterValue);
    } else {
      this.getSegments(true, filterValue);
    }
  }

  private showAllSegments() {
    return this.selectedCountry === 0;
  }

  public getSelectedItem(selectedItem) {
    if (this.step === 0) {
      this.selectedCountry = selectedItem.id;
      this.step = 1;
      this.subtitle =
        ManageClientsConstants.VIEW_CLIENTS[this.langIANA].subtitleSegment;
      this.saveValues();
      if (this.showAllSegments()) {
        this.getAllSegmens();
      } else {
        this.getSegments();
      }
    } else {
      this.router.navigate(['list-clients', selectedItem.id], {
        relativeTo: this.activatedRoute.parent,
      });
    }
  }

  private saveValues() {
    const options = {
      step: this.step,
      selectedCountry: this.selectedCountry,
    };
    this.clientsService.setItemToLocalStorage(
      'persistentOptions',
      JSON.stringify(options),
    );
  }

  public goStepOne() {
    this.selectedCountry = null;
    this.step = 0;
    this.subtitle =
      ManageClientsConstants.VIEW_CLIENTS[this.langIANA].subtitleCountry;
    this.saveValues();
    this.getCountries();
  }
}
