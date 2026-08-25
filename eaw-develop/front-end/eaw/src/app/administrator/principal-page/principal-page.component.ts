import {Component} from '@angular/core';

import {AdministratorConstants} from '../administrator.constants';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

@Component({
  selector: 'app-principal-page-administrator',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.scss'],
  providers: [AdministratorConstants],
})
export class PrincipalPageComponent {
  /**
   * Pass the list menu to principal page
   */
  public principalAdministratorOptions: any;

  constructor(
    public translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.principalAdministratorOptions =
      AdministratorConstants.PRINCIPAL_MENU_ADMINISTRATOR_OPTIONS[
        this.translateCacheService.getCachedLanguage()
      ];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.principalAdministratorOptions =
        AdministratorConstants.PRINCIPAL_MENU_ADMINISTRATOR_OPTIONS[event.lang];
    });
  }
}
