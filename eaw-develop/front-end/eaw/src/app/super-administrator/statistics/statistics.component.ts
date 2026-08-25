import {Component, OnInit} from '@angular/core';

import {SuperAdministratorConstants} from '../super-administrator.constants';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  /**
   * Pass the routes and names to the sidebar
   */
  public sidebarSuperAdministratorOptions: any;
  public sideBarStartsOpened: boolean;

  /**
   * Constructor manage
   * @param adminPageConstants
   * @param translate
   * @param translateCacheService
   */
  constructor(
    public adminPageConstants: SuperAdministratorConstants,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService
  ) {
    this.sidebarSuperAdministratorOptions =
      SuperAdministratorConstants.SIDEBAR_SUPER_ADMINISTRATOR_STATISTICS_OPTIONS[
        this.translateCacheService.getCachedLanguage()
      ];

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.sidebarSuperAdministratorOptions =
        SuperAdministratorConstants.SIDEBAR_SUPER_ADMINISTRATOR_STATISTICS_OPTIONS[event.lang];
    });

    this.sideBarStartsOpened = false;
  }

  ngOnInit() {}
}
