import {Component, OnInit} from '@angular/core';
import {SuperAdministratorConstants} from '../super-administrator.constants';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  providers: [SuperAdministratorConstants],
})
export class ClientsComponent implements OnInit {
  /**
   * Pass the routes and names to the sidebar
   */
  public sidebarSuperAdministratorOptions: any;

  /**
   * Constructor clients
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
      SuperAdministratorConstants.SIDEBAR_SUPER_ADMINISTRATOR_CLIENTS_OPTIONS[
        translateCacheService.getCachedLanguage()
      ];

    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.sidebarSuperAdministratorOptions =
        SuperAdministratorConstants.SIDEBAR_SUPER_ADMINISTRATOR_CLIENTS_OPTIONS[
          event.lang
        ];
    });
  }

  ngOnInit() {}
}
