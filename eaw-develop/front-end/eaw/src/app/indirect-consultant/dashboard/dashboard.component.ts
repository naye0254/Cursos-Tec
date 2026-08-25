import {Component, OnInit} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {IndirectClientConstants} from '../indirect-consultant.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  /**
   * Pass the routes and names to the sidebar
   */
  public navbarInDirectClientOptions: any;
  public menuDirectClientOptions: any;

  /**
   * Constructor dashboard direct client
   * @param translate
   * @param translateCacheService
   */
  constructor(
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.navbarInDirectClientOptions =
      IndirectClientConstants.NAVBAR_INDIRECT_CLIENT_OPTIONS[
        this.translateCacheService.getCachedLanguage()
      ];

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.navbarInDirectClientOptions =
        IndirectClientConstants.NAVBAR_INDIRECT_CLIENT_OPTIONS[event.lang];
    });
  }
}
