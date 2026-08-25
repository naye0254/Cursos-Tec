import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {RequestConstants} from './request.constants';
import {EvaluationsService} from '../evaluations.service';
import {SharedService} from '../../../shared/shared.service';
import {AlertService} from '../../../utils/alerts/alerts.service';

@Component({
  selector: 'app-request-evaluation',
  templateUrl: './request-evaluation.component.html',
  styleUrls: ['./request-evaluation.component.scss'],
  providers: [EvaluationsService],
})
/**
 * Class to request evaluation component
 */
export class RequestEvaluationComponent {
  public formRequest: FormGroup;
  public formOptions: any;

  /**
   * COnstructor method
   * @param formBuilder
   * @param evaluationService
   * @param sharedService
   * @param alertService
   */
  constructor(
    private formBuilder: FormBuilder,
    private evaluationService: EvaluationsService,
    private sharedService: SharedService,
    private alertService: AlertService,
  ) {
    this.formOptions = RequestConstants.FORM_OPTIONS;
    this.formRequest = this.formBuilder.group({
      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(this.formOptions.lengthInputDescription),
        ],
      ],
    });
  }

  /**
   * Cancel event
   */
  public cancel() {
    this.formRequest.reset();
  }

  /**
   * Send request and alert
   */
  public sendRequest() {
    if (this.formRequest.valid) {
      const clientId = this.sharedService.getUserInfoFromLocalStorage().id;
      this.evaluationService
        .sendRequestEvaluation(
          clientId,
          this.formRequest.controls.description.value,
        )
        .subscribe(
          data => {
            this.alertService.openAlert(
              'Correo enviado',
              'Se envió la solicitud a los administradores, pronto se contactarán con usted',
              'éxito',
              () => {
                this.formRequest.reset();
              },
            );
          },
          err => {
            this.alertService.openAlert(
              'Correo no  enviado',
              'No se pudo enviar la solicitud a los administradores, intente más tarde',
              'error',
              () => {},
            );
          },
        );
    }
  }
}
