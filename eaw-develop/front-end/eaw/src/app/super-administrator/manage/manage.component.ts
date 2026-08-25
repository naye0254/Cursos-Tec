import {Component, OnInit} from '@angular/core';

import {SuperAdministratorConstants} from '../super-administrator.constants';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  providers: [SuperAdministratorConstants],
})
export class ManageComponent implements OnInit {
  /**
   * Pass the routes and names to the sidebar
   */
  public sidebarSuperAdministratorOptions: any;

  /**
   * Constructor manage
   * @param adminPageConstants
   * @param translate
   * @param translateCacheService
   */
  constructor(
    public adminPageConstants: SuperAdministratorConstants,
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.sidebarSuperAdministratorOptions =
      SuperAdministratorConstants.SIDEBAR_SUPER_ADMINISTRATOR_MANAGE_OPTIONS[
        this.translateCacheService.getCachedLanguage()
      ];

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.sidebarSuperAdministratorOptions =
        SuperAdministratorConstants.SIDEBAR_SUPER_ADMINISTRATOR_MANAGE_OPTIONS[
          event.lang
        ];
    });
  }

  ngOnInit() {}
}
