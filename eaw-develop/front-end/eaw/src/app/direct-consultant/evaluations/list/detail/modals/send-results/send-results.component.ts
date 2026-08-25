import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {Subject} from 'rxjs';

import {GenericModal} from '../../../../../../shared/abstract-classes/modals/generic-modal.abstract';
import {AlertService} from '../../../../../../utils/alerts/alerts.service';
import {SendResultsConstants} from './send-results.contants';
import {DetailService} from '../../detail.service';

@Component({
  selector: 'app-send-result-dialog',
  templateUrl: './send-results.component.html',
  styleUrls: ['./send-results.component.scss'],
  providers: [DetailService],
})
/**
 * Send results to indirect client component
 */
export class SendResultComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public formEmail: FormGroup;
  public translatePath =
    'directClient.evaluations.seeEvaluations.results.header.dialog';
  public formOptions: any;

  /**
   * Constructor send-results
   * @param dialogRef
   * @param translate
   * @param sharedService
   * @param alertService
   * @param data
   */
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SendResultComponent>,
    private alertService: AlertService,
    private detailService: DetailService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
    this.formOptions = SendResultsConstants.FORM_SEND_RESULTS_OPTIONS;
    this.formEmail = this.formBuilder.group({
      emailsArray: this.formBuilder.array([this.initEmailArray()]),
    });
  }

  ngOnInit() {
    this.formEmail = this.formBuilder.group({
      emailsArray: this.formBuilder.array([this.initEmailArray()]),
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Create an elemento to email array
   */
  private initEmailArray() {
    const emailElement = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(this.formOptions.lengthInputEmail),
        ],
      ],
    });
    return emailElement;
  }

  /**
   * Cancel event
   */
  public cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Confirm event
   */
  public confirm(): void {
    this.getControls('emailsArray').forEach((element: any) => {
      this.detailService
        .notifyIndirectClient(+this.data.evaluationId, element.value.email)
        .subscribe(
          data => {
            this.alertService.openAlert(
              'Resultado Enviado',
              'Se envió el resultado con éxito',
              'éxito',
              () => {
                this.data.confirmFn();
                this.dialogRef.close();
              },
            );
          },
          err => {
            this.alertService.openAlert(
              'Resultado no enviado',
              'No se pudo enviar el resultado',
              'error',
              () => {},
            );
          },
        );
    });
  }

  /**
   * Get Controls of email array
   * @param key
   */
  public getControls(key: string) {
    return (this.formEmail.controls[key] as FormArray).controls;
  }

  /**
   * Add email to email array
   */
  public addEmail() {
    const element = this.formEmail.controls.emailsArray as FormArray;
    element.push(this.initEmailArray());
  }

  /**
   * Delete email from array
   * @param index
   */
  public deleteEmail(index) {
    const element = this.formEmail.controls.emailsArray as FormArray;
    element.removeAt(index);
  }
}
