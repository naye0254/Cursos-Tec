import {Component} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {AdministratorConstants} from '../../administrator.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [AdministratorConstants],
})
/**
 * Dashboard for clients module
 */
export class DashboardComponent {
  /**
   * Pass the routes and names to the sidebar
   */
  public sidebarAdministratorOptions: any;

  /**
   * Constructor method
   * @param translate
   * @param translateCacheService
   */
  constructor(
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.sidebarAdministratorOptions =
      AdministratorConstants.SIDEBAR_ADMINISTRATOR_CLIENTS_OPTIONS[
        this.translateCacheService.getCachedLanguage()
      ];

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.sidebarAdministratorOptions =
        AdministratorConstants.SIDEBAR_ADMINISTRATOR_CLIENTS_OPTIONS[
          event.lang
        ];
    });
  }
}
