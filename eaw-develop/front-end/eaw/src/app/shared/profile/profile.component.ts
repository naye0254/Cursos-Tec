import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {DOCUMENT} from '@angular/common';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

import {ConfiguratinLanguageService} from '../../utils/language-config/language-config.service';
import {SharedService} from '../shared.service';
import {ProfileService} from './profile.service';
import {ProfileConstants} from './profile.constants';
import {AlertService} from '../../utils/alerts/alerts.service';
import {Notifications, Languages} from '../../common/common.interfaces';

import {ChangePasswordService} from './change-password/change-password.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    ProfileService,
    ProfileConstants,
    ConfiguratinLanguageService,
    ChangePasswordService,
  ],
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public userDetail: any;
  public formOptions: any;
  public gender: string;
  public isEditing: boolean;
  public langs: Languages[];
  public notifications: Notifications[];

  public translatePathCardInformation = 'shared.profile.cardInformation';
  public translatePathEdit = 'shared.profile.editInformation';
  public translatePathNotifications = 'shared.profile.notifications';

  /**
   * Constructor profile
   * @param formBuilder
   * @param sharedService
   * @param profileService
   */
  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private alertService: AlertService,
    private profileService: ProfileService,
    private changePasswordService: ChangePasswordService,
    @Inject(DOCUMENT) private document: Document,
    private configurationLanguageService: ConfiguratinLanguageService,
  ) {
    this.formOptions = ProfileConstants.FORM_PROFILE_OPTIONS;
    this.userDetail = {};
    this.isEditing = false;
    this.gender = '';

    this.sharedService.notificationChange.subscribe(value => {
      this.getAllNotifications();
    });
  }

  ngOnInit() {
    this.userDetail = JSON.parse(
      this.sharedService.getItemFromLocalStorage('userDetail'),
    );
    this.getLangs(this.userDetail.userToken);
    this.setGenderImg(this.userDetail.sex);
    this.formConfiguration();

    this.patchValuesForm();
    this.getAllNotifications();
  }

  /**
   * Creates the form configuration.
   */
  formConfiguration() {
    this.profileForm = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputFirstName),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputLastName),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputEmail),
        Validators.email,
      ]),
      telephone: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputTelephone),
      ]),
      roleType: new FormControl({value: '', disabled: true}),
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputUserName),
      ]),
      language: new FormControl('', [Validators.required]),
    });
  }

  /**
   * To enable the form inputs, except role type.
   */
  formEnable() {
    this.profileForm.enable();
    this.profileForm.controls.roleType.disable();
    this.isEditing = true;
  }

  /**
   * To disable the form inputs.
   */
  formDisable() {
    this.profileForm.disable();
    this.isEditing = false;
  }

  /**
   * Opens the modal for change password.
   */
  editPassword() {
    this.changePasswordService.openDialog(
      '50%',
      () => {},
      () => {},
    );
  }

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

  /**
   * To put all the info from the user in the form.
   * @param userDetail
   */
  patchValuesForm() {
    this.profileForm.setValue({
      firstName: this.userDetail.firstName,
      lastName: this.userDetail.lastName,
      email: this.userDetail.email,
      telephone: this.userDetail.telephone,
      roleType: this.userDetail.nameRole,
      username: this.userDetail.username,
      language: JSON.stringify(this.userDetail.languagesId),
    });

    this.formDisable();
  }

  /**
   * Get all notifications.
   */
  getAllNotifications() {
    this.profileService
      .getAllNotifications(this.userDetail.userToken, this.userDetail.id)
      .subscribe(data => {
        this.notifications = data.results;
      });
  }

  /**
   * Mark as seen a notification.
   * @param notificationId
   */
  setNotificationAsSeen(notificationId: number) {
    this.profileService
      .setNotificationAsSeen(this.userDetail.userToken, notificationId)
      .subscribe(
        data => {
          this.sharedService.toggleNotificationChange();
        },
        error => {
          this.alertService.openAlert(
            'Error al actualizar',
            'Se ha producido un error al marcar como vista la notificación, por favor vuelva a intentarlo.' +
              error,
            'error',
            () => {},
          );
        },
      );
  }

  /**
   * Function to update the user information.
   * @param isValid
   * @param formData
   */
  async updateUserData(formData: any, isValid: boolean) {
    if (isValid) {
      const date = await new Date();
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        telephone: formData.telephone,
        username: formData.username,
        updatedBy: this.userDetail.id,
        updatedAt: date,
      };
      this.profileService
        .updateUserData(this.userDetail.userToken, this.userDetail.id, userData)
        .subscribe(
          data => {
            this.changeUserDataLocalStorage(formData);
            this.alertService.openAlert(
              'Se ha guardado',
              'Se ha actualizado su información de forma correcta.',
              'éxito',
              () => {},
            );
          },
          error => {
            this.alertService.openAlert(
              'Error al actualizar',
              'Se ha producido un error al actualizar su información, por favor vuelva a intentarlo.',
              'error',
              () => {},
            );
          },
        );
    }
  }

  /**
   * Get all languages
   * @param token
   */
  getLangs(token) {
    this.profileService.getLangs(token).subscribe(data => {
      this.langs = data;
    });
  }

  /**
   * Get Iana by id of the lang and set the language of the page.
   * @param idLang
   * @param token
   */
  getIana(idLang, token) {
    this.profileService.getIana(token, idLang).subscribe(data => {
      const languageData = {
        userId: this.userDetail.id,
        iana: data.iana,
      };
      this.useLanguage(languageData, idLang);
    });
  }

  /**
   * Get the value of mat-select
   */
  get language() {
    return this.profileForm.get('language');
  }

  /**
   * When language select change.
   */
  onLanguageChange() {
    this.getIana(this.language.value, this.userDetail.userToken);
  }
  /**
   * Change current language to another one
   * @param language
   */
  useLanguage(languageData: any, idLang: any) {
    this.translate.use(languageData.iana);
    this.profileService
      .changeLanguageForUser(languageData, this.userDetail.userToken)
      .subscribe(
        data => {
          this.document.documentElement.lang = languageData.iana;
          this.changeUserLanguageInLocalStorage(idLang);
          this.configurationLanguageService.openConfigurationLanguagePage();
        },
        error => {
          this.alertService.openAlert(
            'Error al cambiar idioma',
            'Se ha producido un error al cambiar el idioma preferente, por favor vuelva a intentarlo.',
            'error',
            () => {},
          );
        },
      );
  }

  /**
   * Change the language of user in the current local storage.
   * @param idLang
   */
  changeUserLanguageInLocalStorage(idLang: string) {
    this.userDetail.languagesId = JSON.parse(idLang);
    this.sharedService.setItemToLocalStorage(
      'userDetail',
      JSON.stringify(this.userDetail),
    );
  }

  /**
   * Change the user information of user in the current local storage.
   * @param formData
   */
  changeUserDataLocalStorage(formData: any) {
    this.userDetail.firstName = formData.firstName;
    this.userDetail.lastName = formData.lastName;
    this.userDetail.email = formData.email;
    this.userDetail.telephone = formData.telephone;
    this.userDetail.username = formData.username;
    this.sharedService.setItemToLocalStorage(
      'userDetail',
      JSON.stringify(this.userDetail),
    );
  }
}
