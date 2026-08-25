import {Component} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {EvaluatorConstants} from './evaluator.constants';

@Component({
  selector: 'app-evaluator',
  templateUrl: './evaluator.component.html',
  styleUrls: ['./evaluator.component.scss'],
  providers: [EvaluatorConstants],
})
export class EvaluatorComponent {
  /**
   * Pass the routes and names to the sidebar
   */
  public navbarEvaluatorOptions: any;
  public menuEvaluatorOptions: any;

  /**
   * Constructor dashboard evaluator
   * @param translate
   * @param translateCacheService
   */
  constructor(
    private translate: TranslateService,
    private translateCacheService: TranslateCacheService,
  ) {
    this.menuEvaluatorOptions = EvaluatorConstants.MENU_EVALUATOR_OPTIONS;

    this.navbarEvaluatorOptions =
      EvaluatorConstants.NAVBAR_EVALUATOR_OPTIONS[
        this.translateCacheService.getCachedLanguage()
      ];

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.navbarEvaluatorOptions =
        EvaluatorConstants.NAVBAR_EVALUATOR_OPTIONS[event.lang];
    });
  }
}
