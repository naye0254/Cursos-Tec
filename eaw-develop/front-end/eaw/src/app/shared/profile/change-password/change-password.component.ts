import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {Subject} from 'rxjs';

import {GenericModal} from '../../../shared/abstract-classes/modals/generic-modal.abstract';
import {ProfileConstants} from '../profile.constants';
import {ProfileService} from '../profile.service';
import {SharedService} from '../../shared.service';
import {AlertService} from '../../../utils/alerts/alerts.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ProfileConstants],
})
export class ChangePasswordComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();
  public passwordForm: FormGroup;
  public userDetail: any;
  public formOptions: any;
  public hide = true;
  public labelHidePassword: string;
  public labelShowPassword: string;
  public translatePathChangePassModal = 'shared.profile.changePasswordModal';

  /**
   * Constructor change-password
   * @param dialogRef
   * @param profileService
   * @param translate
   * @param sharedService
   * @param formBuilder
   * @param alertService
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private profileService: ProfileService,
    private translate: TranslateService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
    this.formOptions = ProfileConstants.FORM_CHANGE_PASSWORD_OPTIONS;
    this.userDetail = {};
  }

  ngOnInit() {
    this.getLabelsHide();
    this.userDetail = JSON.parse(
      this.sharedService.getItemFromLocalStorage('userDetail'),
    );

    this.passwordForm = this.formBuilder.group(
      {
        oldPassword: new FormControl('', [
          Validators.required,
          Validators.maxLength(this.formOptions.lengthInputPassword),
        ]),
        newPassword: new FormControl('', [
          Validators.required,
          Validators.maxLength(this.formOptions.lengthInputPassword),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.maxLength(this.formOptions.lengthInputPassword),
        ]),
      },
      {
        validator: this.profileService.checkIfMatchingPasswords(
          'newPassword',
          'confirmPassword',
        ),
      },
    );
  }

  /**
   * Get the translated labes of hide password and show password.
   */
  getLabelsHide() {
    this.translate
      .get(this.translatePathChangePassModal + '.hidePassword')
      .subscribe((res: string) => {
        this.labelHidePassword = res;
      });

    this.translate
      .get(this.translatePathChangePassModal + '.showPassword')
      .subscribe((res: string) => {
        this.labelShowPassword = res;
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Cancel event
   */
  public cancel(): void {
    this.data.cancelFn();
    this.dialogRef.close();
  }

  /**
   * Change the password of the user.
   * @param formData
   * @param isValid
   */
  async changePassword(formData: any, isValid: boolean) {
    if (isValid) {
      const date = await new Date();
      const userData = {
        updatedAt: date,
      };

      this.profileService
        .changePassword(
          formData.oldPassword,
          formData.newPassword,
          this.userDetail.userToken,
        )
        .subscribe(
          data => {
            this.profileService
              .updateUserData(
                this.userDetail.userToken,
                this.userDetail.id,
                userData,
              )
              .subscribe(
                // tslint:disable-next-line: no-shadowed-variable
                data => {
                  this.alertService.openAlert(
                    'Se ha guardado',
                    'Se ha actualizado su contraseña de forma correcta.',
                    'éxito',
                    () => {
                      this.data.confirmFn();
                      this.dialogRef.close();
                    },
                  );
                },
                error => {
                  this.alertService.openAlert(
                    'Error al actualizar',
                    'Se ha producido un error al actualizar su contraseña, por favor vuelva a intentarlo.',
                    'error',
                    () => {},
                  );
                },
              );
          },
          error => {
            this.alertService.openAlert(
              'Error al actualizar',
              'Se ha producido un error al actualizar su contraseña, por favor vuelva a intentarlo.',
              'error',
              () => {},
            );
          },
        );
    }
  }
}
