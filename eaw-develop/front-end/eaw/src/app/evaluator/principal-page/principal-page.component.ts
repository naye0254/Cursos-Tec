import {Component, OnInit} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {EvaluatorConstants} from '../evaluator.constants';
import {SharedService} from '../../shared/shared.service';

@Component({
  selector: 'app-principal-page-evaluator',
  templateUrl: './principal-page.component.html',
  styleUrls: ['./principal-page.component.scss'],
  providers: [EvaluatorConstants],
})
export class PrincipalPageComponent implements OnInit {
  /**
   * Pass the list menu to principal page
   */
  public principalAdministratorOptions: any;

  constructor(
    public translate: TranslateService,
    private translateCacheService: TranslateCacheService,
    private sharedService: SharedService,
  ) {
    this.principalAdministratorOptions =
      EvaluatorConstants.PRINCIPAL_MENU_EVALUATOR_OPTIONS[
        this.translateCacheService.getCachedLanguage()
      ];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.principalAdministratorOptions =
        EvaluatorConstants.PRINCIPAL_MENU_EVALUATOR_OPTIONS[event.lang];
    });
  }

  ngOnInit() {
    this.sharedService.deleteItemFromLocalStorage('evaluationInfo');
    this.sharedService.deleteItemFromLocalStorage('spectInfo');
  }
}
