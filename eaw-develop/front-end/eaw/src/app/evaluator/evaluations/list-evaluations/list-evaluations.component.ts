import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SelectionPageService} from '../../../shared/list-evaluations/list-evaluations/selection-page/selection-page.service';
import {SharedService} from '../../../shared/shared.service';

@Component({
  selector: 'app-evaluator-list-evaluations',
  templateUrl: './list-evaluations.component.html',
  styleUrls: ['./list-evaluations.component.scss'],
  providers: [SelectionPageService],
})
/**
 * List evaluations component
 */
export class ListEvaluationsComponent implements OnInit {
  public evaluationState: number;

  /**
   * Constructor Class
   * @param activatedRoute
   * @param selectionPageService
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private selectionPageService: SelectionPageService,
  ) {
    this.evaluationState = 0;
    this.activatedRoute.paramMap.subscribe(param => {
      this.evaluationState = +param.get('state');
    });
  }

  ngOnInit() {
    if (this.sharedService.isItemInLocalStorage('evaluationInfo')) {
      this.getSelectedEvaluation(
        JSON.parse(
          this.sharedService.getItemFromLocalStorage('evaluationInfo'),
        ),
      );
      this.sharedService.deleteItemFromLocalStorage('evaluationInfo');
    }
  }

  /**
   * Get selected Evaluation of the componet child
   * @param selectedEvaluation
   */
  public getSelectedEvaluation(selectedEvaluation) {
    this.selectionPageService.openDialog(
      selectedEvaluation,
      () => {},
      () => {},
    );
  }
}
