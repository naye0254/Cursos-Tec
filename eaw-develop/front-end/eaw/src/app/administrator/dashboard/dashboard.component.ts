import {Component, OnInit} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {AdministratorConstants} from '../administrator.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AdministratorConstants],
})
export class DashboardComponent implements OnInit {
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
      AdministratorConstants.MENU_ADMINISTRATOR_OPTIONS;

    this.navbarAdministratorOptions =
      AdministratorConstants.NAVBAR_ADMINISTRATOR_OPTIONS[
        translateCacheService.getCachedLanguage()
      ];

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.navbarAdministratorOptions =
        AdministratorConstants.NAVBAR_ADMINISTRATOR_OPTIONS[event.lang];
    });
  }

  ngOnInit() {}
}
