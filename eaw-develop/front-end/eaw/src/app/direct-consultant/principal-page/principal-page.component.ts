import {Component, OnInit} from '@angular/core';
import {DirectClientConstants} from '../direct-consultant.constants';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

@Component({
  selector: 'app-principal-direct-client-page',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.scss'],
})
export class PrincipalPageComponent {
  /**
   * Pass the list menu to principal page
   */
  public principalDirectClientOptions: any;

  constructor(
    public translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.principalDirectClientOptions =
      DirectClientConstants.PRINCIPAL_MENU_DIRECT_CLIENT_OPTIONS[
        this.translateCacheService.getCachedLanguage()
      ];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.principalDirectClientOptions =
        DirectClientConstants.PRINCIPAL_MENU_DIRECT_CLIENT_OPTIONS[event.lang];
    });
  }
}
