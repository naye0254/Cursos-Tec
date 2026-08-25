import {Component, OnInit, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {SharedService} from '../../../shared/shared.service';
import {TrackingService} from '../tracking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [TrackingService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public userDetail: any;
  public gender: string;
  public quantityEvaluations: any;
  public translatePathCardInformation: string;
  public quantityByEvaluators: any;

  constructor(
    private sharedService: SharedService,
    private trackingService: TrackingService,
  ) {
    this.userDetail = {};
    this.gender = '';
    this.quantityEvaluations = {};
    this.quantityByEvaluators = {};
    this.translatePathCardInformation = 'shared.profile.cardInformation';
  }

  ngOnInit() {
    this.userDetail = JSON.parse(
      this.sharedService.getItemFromLocalStorage('userDetail'),
    );
    this.trackingService
      .getQuantityEvalPromoterEvaluator()
      .subscribe(quantityData => {
        this.quantityByEvaluators = quantityData;
      });
    this.setGenderImg(this.userDetail.sex);
    this.getQuantityEvaluationCreated(this.userDetail.id);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Call the service to get quantity evaluations by promoter
   * @param promoterId
   */
  getQuantityEvaluationCreated(promoterId: number): void {
    this.trackingService
      .getQuantityEvaluationByPromoter<any>(promoterId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.quantityEvaluations = data.results;
      });
  }

  /**
   * Set the gender string for the img
   * @param sex
   */
  setGenderImg(sex: number) {
    switch (sex) {
      case 0:
        this.gender = 'male';
        break;

      case 1:
        this.gender = 'female';
        break;

      case 3:
        this.gender = 'undefined';
        break;

      default:
        this.gender = 'undefined';
        break;
    }
  }
}
