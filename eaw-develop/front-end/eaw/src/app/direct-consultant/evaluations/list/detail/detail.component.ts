import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {EvaluationsService} from '../../evaluations.service';
import {Evaluations} from '../../../../models/evaluations.model';
import {SendResultService} from './modals/send-results/send-results.service';
import {CommonConstants} from '../../../../common/common.constants';
import {SharedService} from '../../../../shared/shared.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [EvaluationsService, SendResultService, SharedService],
})
/**
 * Detail components class
 */
export class DetailComponent implements OnInit {
  private evaluationId: number;

  public evaluation: Evaluations;
  public areSendedResuts: boolean;
  public directClientRole: number;
  public userRole: number;

  /**
   * Constructor method
   * @param router
   * @param activatedRoute
   * @param evaluationService
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private evaluationService: EvaluationsService,
    private criteriaInfoService: SendResultService,
    private sharedService: SharedService,
  ) {
    this.evaluationId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.directClientRole = CommonConstants.roles.DirectClient;
    this.userRole = this.sharedService.getUserInfoFromLocalStorage().roleTypesId;
  }

  ngOnInit() {
    this.getEvaluationById();
  }

  /**
   * get evaluation from local storage
   */
  private getEvaluationById() {
    this.evaluationService
      .getEvaluationById(this.evaluationId)
      .subscribe(data => {
        this.evaluation = data.results;
        this.evaluationService.setItemToLocalStorage(
          'evaluationDetail',
          JSON.stringify(this.evaluation),
        );
      });
  }

  /**
   * Send results to indirect client by email
   */
  public sendResults() {
    this.criteriaInfoService.openDialog('50%', this.evaluation.id, () => {});
  }

  /**
   * Go to selection steps
   */
  public goBack() {
    if (this.sharedService.isItemInLocalStorage('userDetail')) {
      const user = JSON.parse(
        this.sharedService.getItemFromLocalStorage('userDetail'),
      );
      switch (user.roleTypesId) {
        case 1:
          // TODO: For the moment super-admin role can access to results.
          break;

        case 2:
          this.router.navigate(['/administrator/evaluations/list-evaluations']);
          break;

        case 4:
          this.router.navigate([
            '/direct-consultant/evaluations/list-evaluations/selection',
          ]);
          break;

        default:
          break;
      }
    } else {
      this.router.navigate(['/indirect-consultant']);
    }
  }
}
