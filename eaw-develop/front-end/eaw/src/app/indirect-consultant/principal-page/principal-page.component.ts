import {Component, OnInit} from '@angular/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {IndirectClientConstants} from '../indirect-consultant.constants';
import {SharedService} from 'src/app/shared/shared.service';

@Component({
  selector: 'app-principal-direct-client-page',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.scss'],
})
/**
 * Class principal page component
 */
export class PrincipalPageComponent {
  /**
   * Pass the list menu to principal page
   */
  public principalDirectClientOptions: any;

  /**
   * Constructor method
   * @param translate
   * @param translateCacheService
   */
  constructor(
    public translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private sharedService: SharedService,
  ) {
    this.principalDirectClientOptions = IndirectClientConstants.PRINCIPAL_MENU_INDIRECT_CLIENT_OPTIONS(
      this.sharedService.getEvaluationId(),
    )[this.translateCacheService.getCachedLanguage()];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.principalDirectClientOptions = IndirectClientConstants.PRINCIPAL_MENU_INDIRECT_CLIENT_OPTIONS(
        this.sharedService.getEvaluationId(),
      )[event.lang];
    });
  }
}
