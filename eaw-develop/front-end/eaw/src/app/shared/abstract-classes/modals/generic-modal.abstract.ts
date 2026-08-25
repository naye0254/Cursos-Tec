import {SharedService} from '../../shared.service';
import {AlertService} from '../../../utils/alerts/alerts.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/**
 * Abstract class to reuse the functions of modals
 */
export abstract class GenericModal {
  protected unSubscriber = new Subject<void>();

  /**
   * Method to unsubcribe services
   */
  public unSubscribe() {
    this.unSubscriber.next();
    this.unSubscriber.complete();
  }
  /**
   * Create an Item into DB
   * @param modelName name of the model
   * @param modelData item to create
   * @param successFn  when success function
   * @param errorFn when error function
   * @param sharedService service to post in db
   */
  public createItemModel(
    modelName: string,
    modelData: any,
    successFn: () => void,
    errorFn: () => void,
    sharedService: SharedService,
  ): void {
    sharedService
      .createModel(modelName, modelData)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(
        success => {
          successFn();
        },
        err => {
          errorFn();
        },
      );
  }

  /**
   * Update an Item into DB
   * @param modelName name of the model
   * @param modelData item to update
   * @param successFn when success function
   * @param errorFn when error function
   * @param sharedService service to update in db
   */
  public updateItemModel(
    modelName: string,
    modelData: any,
    successFn: () => void,
    errorFn: () => void,
    sharedService: SharedService,
  ): void {
    sharedService
      .updateModel(modelName, modelData)
      .pipe(takeUntil(this.unSubscriber))
      .subscribe(
        success => {
          successFn();
        },
        err => {
          errorFn();
        },
      );
  }

  /**
   * Call an alert when succes
   * @param alertTitle
   * @param alertBody
   * @param alertService
   * @param onCloseFn function when close the alert
   */
  public success(
    alertTitle,
    alertBody,
    alertService: AlertService,
    onCloseFn: () => void,
  ) {
    alertService.openAlert(alertTitle, alertBody, 'éxito', () => {
      onCloseFn();
    });
  }

  /**
   * Call an alert when error
   * @param alertTitle
   * @param alertBody
   * @param alertService
   * @param onCloseFn function when close the alert
   */
  public error(
    alertTitle,
    alertBody,
    alertService: AlertService,
    onCloseFn: () => void,
  ) {
    alertService.openAlert(alertTitle, alertBody, 'error', () => {
      onCloseFn();
    });
  }
}
