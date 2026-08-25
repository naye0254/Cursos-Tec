import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {AddManuallyPageService} from './add-manually-page.service';
import {AlertService} from '../alerts/alerts.service';

@Component({
  selector: 'app-add-manually-page',
  templateUrl: './add-manually-page.component.html',
  styleUrls: ['./add-manually-page.component.scss'],
  providers: [AddManuallyPageService],
  encapsulation: ViewEncapsulation.None,
})
export class AddManuallyPageComponent implements OnInit {
  public manuallyForm: FormGroup;

  /**
   * Constructor add-manually-page
   * @param router
   */
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private addManuallyPageService: AddManuallyPageService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.formConfiguration();
  }
  /**
   * Creates the form configuration.
   */
  formConfiguration() {
    this.manuallyForm = this.formBuilder.group({
      idEvaluation: ['', [Validators.required]],
      url: ['', [Validators.required]],
      title: ['', [Validators.required]],
    });
  }

  /**
   * Start the evaluation manually, to avoid duplicated pages with the normal start.
   */
  startEvaluation(credentials: any) {
    if (credentials.idEvaluation) {
      this.addManuallyPageService
        .startDevelopManualEvaluation(credentials.idEvaluation)
        .subscribe(
          data => {
            this.alertService.openAlert(
              'Evaluación iniciada con éxito!',
              'La evaluación manual ha iniciado con éxito.',
              'éxito',
              () => {
                this.manuallyForm.reset();
              },
            );
          },
          error => {
            this.alertService.openAlert(
              'Error al iniciar',
              'La evaluación manual ha fallado al intentar inicar, por favor intentelo de nuevo.',
              'error',
              () => {},
            );
          },
        );
    }
  }

  addPage(credentials: any, isValid: any) {
    if (isValid) {
      const url = credentials.url.replace(/\s/g, '');
      this.addManuallyPageService
        .addPageToManualEvaluation(
          credentials.idEvaluation,
          url,
          credentials.title,
        )
        .subscribe(
          data => {
            this.alertService.openAlert(
              'Página agregada con éxito!',
              'La página se ha agregado con éxito a la evaluación manual.',
              'éxito',
              () => {
                this.manuallyForm.reset();
              },
            );
          },
          error => {
            this.alertService.openAlert(
              'Error al agregar',
              'La página no se ha agregado a la evaluación manual, por favor intentelo de nuevo.',
              'error',
              () => {},
            );
          },
        );
    }
  }
}
