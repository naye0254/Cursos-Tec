import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {Subject} from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';

import {GenericModal} from '../../../abstract-classes/modals/generic-modal.abstract';
import {SharedService} from '../../../shared.service';
import {AlertService} from '../../../../utils/alerts/alerts.service';

@Component({
  selector: 'app-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.scss'],
})
export class CheckpointComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public checkpointInfo: any;
  public user: any;
  public translatePath = 'evaluator.manualEvaluation.modals.addRecommendation';

  /**
   * Constructor checkpoint
   * @param dialogRef
   * @param translate
   * @param sharedService
   * @param alertService
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<CheckpointComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private sharedService: SharedService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  ngOnInit() {
    this.user = this.sharedService.getUserInfoFromLocalStorage();
    this.initCheckpoint();
  }

  /**
   * Initialize the checkpoint.
   */
  initCheckpoint() {
    this.sharedService
      .getCheckpointByEvaluation(this.user.userToken, this.data.idEvaluation)
      .subscribe(data => {
        this.checkpointInfo = data.results;
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * finish event
   */
  public finish(): void {
    this.sharedService
      .getFinishScrapingInCheckpoint(
        this.user.userToken,
        this.data.idEvaluation,
      )
      .subscribe(
        data => {
          this.alertService.openAlert(
            'Se ha finalizado con éxito',
            'El web scraping se ha finalizado con éxito en el último checkpoint.',
            'éxito',
            () => {
              this.data.confirmFn();
              this.dialogRef.close();
            },
          );
        },
        error => {
          this.alertService.openAlert(
            'Error al finalizar',
            'Se ha generado un error al intentar finalizar el scraping en el último checkpoint, intentelo de nuevo.',
            'error',
            () => {},
          );
        },
      );
  }

  /**
   * restart event
   */
  public restart(): void {
    this.sharedService
      .getResetScrapingInProgress(this.user.userToken, this.data.idEvaluation)
      .subscribe(
        data => {
          this.alertService.openAlert(
            'Se ha reiniciado con éxito',
            'El web scraping se ha reiniciado con éxito.',
            'éxito',
            () => {
              this.data.confirmFn();
              this.dialogRef.close();
            },
          );
        },
        error => {
          this.alertService.openAlert(
            'Error al reiniciar',
            'Se ha generado un error al intentar reiniciar el scraping, intentelo de nuevo.',
            'error',
            () => {},
          );
        },
      );
  }

  /**
   * Confirm event
   */
  public confirm(): void {
    this.data.confirmFn();
    this.dialogRef.close();
  }
}
