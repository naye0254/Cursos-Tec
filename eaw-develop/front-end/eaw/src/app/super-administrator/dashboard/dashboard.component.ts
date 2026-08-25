import {Component, OnInit} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {SuperAdministratorConstants} from '../super-administrator.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [SuperAdministratorConstants],
})
export class DashboardComponent implements OnInit {
  /**
   * Pass the routes and names to the sidebar
   */
  public navbarSuperAdministratorOptions: any;
  public menuSuperAdministratorOptions: any;

  /**
   * Constructor dashboard super administrator
   * @param adminPageConstants
   * @param translate
   */
  constructor(
    public adminPageConstants: SuperAdministratorConstants,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.menuSuperAdministratorOptions =
      SuperAdministratorConstants.MENU_SUPER_ADMINISTRATOR_OPTIONS;

    this.navbarSuperAdministratorOptions =
      SuperAdministratorConstants.NAVBAR_SUPER_ADMINISTRATOR_OPTIONS[
        translateCacheService.getCachedLanguage()
      ];

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.navbarSuperAdministratorOptions =
        SuperAdministratorConstants.NAVBAR_SUPER_ADMINISTRATOR_OPTIONS[
          event.lang
        ];
    });
  }

  ngOnInit() {}
}
