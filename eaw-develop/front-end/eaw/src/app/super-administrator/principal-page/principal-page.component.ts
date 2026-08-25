import {Component} from '@angular/core';
import {SuperAdministratorConstants} from '../super-administrator.constants';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

@Component({
  selector: 'app-super-administrator-principal-page',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.scss'],
  providers: [SuperAdministratorConstants],
})
export class SuperAdminPrincipalPageComponent {
  /**
   * Pass the list menu to principal page
   */
  public principalMenuSuperAdministratorOptions: any;

  constructor(
    public adminPageConstants: SuperAdministratorConstants,
    public translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.principalMenuSuperAdministratorOptions =
      SuperAdministratorConstants.PRINCIPAL_MENU_SUPER_ADMINISTRATOR_OPTIONS[
        this.translateCacheService.getCachedLanguage()
      ];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.principalMenuSuperAdministratorOptions =
        SuperAdministratorConstants.PRINCIPAL_MENU_SUPER_ADMINISTRATOR_OPTIONS[
          event.lang
        ];
    });
  }
}
