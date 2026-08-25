import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserRestoreService} from '../user-restore.service';
import {AlertService} from '../../../utils/alerts/alerts.service';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['../user-restore.component.scss'],
})
class ChangePasswordComponent implements OnInit {
  public isUpdated: boolean;
  public showPass: boolean;
  public showMessage: boolean;
  public changePasswordForm: FormGroup;

  public successAlertObj: any;
  public errorAlertObj: any;

  public translatePath = 'landingPage.userRestore.changePassword';

  @Input() accessToken: string;

  /**
   * Constructor change-password
   * @param formBuilder
   * @param userRestoreService
   * @param router
   */
  constructor(
    private formBuilder: FormBuilder,
    private userRestoreService: UserRestoreService,
    private router: Router,
    private alertService: AlertService,
    private translate: TranslateService,
  ) {
    this.showPass = false;
    this.isUpdated = false;
    this.showMessage = false;
  }

  ngOnInit() {
    this.formConfiguration();
    this.getTranslationsAlerts();
  }

  /**
   * Translate the alerts for success and error.
   */
  getTranslationsAlerts() {
    this.translate
      .get(this.translatePath + '.successAlert')
      .subscribe((res: any) => {
        this.successAlertObj = {
          title: res.title,
          text: res.text,
        };
      });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate
        .get(this.translatePath + '.successAlert')
        .subscribe((res: any) => {
          this.successAlertObj = {
            title: res.title,
            text: res.text,
          };
        });
    });

    this.translate
      .get(this.translatePath + '.errorAlert')
      .subscribe((res: any) => {
        this.errorAlertObj = {
          title: res.title,
          text: res.text,
        };
      });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translate
        .get(this.translatePath + '.errorAlert')
        .subscribe((res: any) => {
          this.errorAlertObj = {
            title: res.title,
            text: res.text,
          };
        });
    });
  }

  /**
   * To change the password of one user.
   * @param passwordForm
   * @param isValid
   */
  changePassword(passwordForm: any, isValid: boolean) {
    if (isValid) {
      this.userRestoreService
        .changeNewPassword(this.accessToken, passwordForm.password)
        .subscribe(
          data => {
            this.handleChangePassword(data);
          },
          error => {
            this.rejectChangePassword(error);
          },
        );
    }
  }

  /**
   * When user press enter key excecutes changePassword function
   * @param event
   * @param credentials
   * @param isValid
   */
  onKeyToSignIn(event: any, credentials: any, isValid: boolean) {
    if (event.keyCode === 13) {
      this.changePassword(credentials, isValid);
    }
  }

  /**
   * To handle password change.
   * @param data
   */
  handleChangePassword(data: any) {
    this.alertService.openAlert(
      this.successAlertObj.title,
      this.successAlertObj.text,
      'éxito',
      () => {
        this.router.navigate(['login']);
      },
    );
  }

  /**
   * To handle reject password.
   * @param err
   */
  rejectChangePassword(err: Error) {
    this.alertService.openAlert(
      this.errorAlertObj.title,
      this.errorAlertObj.text,
      'error',
      () => {
        this.changePasswordForm.reset();
      },
    );
  }

  /**
   * Creates the form configuration.
   */
  formConfiguration() {
    this.changePasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.maxLength(50)]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(50)]],
      },
      {
        validator: this.userRestoreService.checkIfMatchingPasswords(
          'password',
          'confirmPassword',
        ),
      },
    );
  }
}
export {ChangePasswordComponent};
