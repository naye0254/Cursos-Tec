import {Component, OnInit} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {DirectClientConstants} from '../direct-consultant.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  /**
   * Pass the routes and names to the sidebar
   */
  public navbarAdministratorOptions: any;
  public menuAdministratorOptions: any;

  /**
   * Constructor dashboard administrator
   * @param translate
   * @param translateCacheService
   */
  constructor(
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.menuAdministratorOptions =
      DirectClientConstants.MENU_DIRECT_CLIENT_OPTIONS;

    this.navbarAdministratorOptions =
      DirectClientConstants.NAVBAR_DIRECT_CLIENT_OPTIONS[
        this.translateCacheService.getCachedLanguage()
      ];

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.navbarAdministratorOptions =
        DirectClientConstants.NAVBAR_DIRECT_CLIENT_OPTIONS[event.lang];
    });
  }
}
