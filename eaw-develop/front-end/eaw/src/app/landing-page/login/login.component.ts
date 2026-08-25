import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {reject} from 'q';

import {SharedService} from '../../shared/shared.service';
import {LoginService} from './login.service';
import {CommonConstants} from '../../common/common.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService, CommonConstants],
})
export class LoginComponent implements OnInit {
  public loginURLForm: FormGroup;
  public evaluation: any;
  public isRejectedURL: boolean;
  public loginURL: boolean;

  public translatePath = 'landingPage.login';

  public loginForm: FormGroup;
  private user: any;
  private nameRole: any;
  public isRejected: boolean;

  /**
   * Constructor login
   * @param formBuilder
   * @param router
   * @param sharedService
   * @param loginService
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private loginService: LoginService,
  ) {
    this.user = {};
    this.nameRole = {};
    this.evaluation = {};
    this.isRejectedURL = false;
    this.isRejected = false;
    this.loginURL = false;
  }

  ngOnInit() {
    this.formConfiguration();
    this.verifyAlreadyLogged();
  }

  /**
   * Check if an user is already logged
   */
  verifyAlreadyLogged() {
    if (localStorage.getItem('userDetail') != null) {
      const user = JSON.parse(
        this.sharedService.getItemFromLocalStorage('userDetail'),
      );
      this.handleUserRole(user.roleTypesId);
    }
  }

  /**
   * Creates the form configuration.
   */
  formConfiguration() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i),
        ],
      ],
      password: ['', [Validators.required, Validators.maxLength(50)]],
    });

    this.loginURLForm = this.formBuilder.group({
      url: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  /**
   * Change login by user, to login by url.
   * @param state
   */
  changeLogin(state: boolean) {
    this.loginURL = state;
  }

  /**
   * When user press enter key or space key, excecutes enterUrl function
   * @param event
   * @param optionType
   */
  onKeyToChangeLogin(event: any, optionType) {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.changeLogin(optionType);
    }
  }

  /**
   * Login by url and code.
   * @param credentials
   * @param isValid
   */
  enterUrl(credentials: any, isValid: any) {
    if (isValid) {
      const url = credentials.url.replace(/\s/g, '');
      const code = credentials.code.replace(/\s/g, '');
      this.loginService.loginByUrl(url, code).subscribe(
        data => {
          if (data.hasError) {
            this.rejectLoginURL(data);
            this.sharedService.setItemToLocalStorage(
              CommonConstants.KEY_INDIRECT_CLIENT,
              JSON.stringify(false),
            );
          } else {
            this.router.navigate(['indirect-consultant']);
            this.sharedService.setItemToLocalStorage(
              CommonConstants.KEY_INDIRECT_CLIENT,
              JSON.stringify(true),
            );
            this.sharedService.setItemToLocalStorage(
              CommonConstants.KEY_EVALUATIONID_INDIRECT_CLIENT,
              data.results.id.toString(),
            );
          }
        },
        error => {
          this.rejectLoginURL(error);
          this.sharedService.setItemToLocalStorage(
            CommonConstants.KEY_INDIRECT_CLIENT,
            JSON.stringify(false),
          );
        },
      );
    }
  }

  /**
   * Login by email and password.
   * @param credentials
   * @param isValid
   */
  logIn(credentials: any, isValid: boolean) {
    if (isValid) {
      this.loginService
        .loginByUser(credentials.email, credentials.password)
        .subscribe(
          async data => {
            const role = await this.handlePostLogin(data);
            this.handleUserRole(role);
          },
          error => {
            this.rejectLogin(error);
          },
        );
    }
  }

  /**
   * Verify that the user is active, otherwise reject the login,
   * and add the user data and the AccessToken to localstorage encrypted.
   * @param response
   */
  async handlePostLogin(response: any) {
    this.isRejected = false;
    if (response.user.isActive === 0) {
      response.status = '401';
      this.rejectLogin(response);
      return reject;
    }
    this.nameRole = await this.getRoleName(
      response.id,
      response.user.roleTypesId,
    );

    this.user.id = response.user.id;
    this.user.email = response.user.email;
    this.user.firstName = response.user.firstName;
    this.user.lastName = response.user.lastName;
    this.user.roleTypesId = response.user.roleTypesId;
    this.user.nameRole = this.nameRole.roleType;
    this.user.languagesId = response.user.languagesId;
    this.user.telephone = response.user.telephone;
    this.user.username = response.user.username;
    this.user.sex = response.user.sex;
    this.user.userToken = response.id;
    this.sharedService.setItemToLocalStorage(
      'userDetail',
      JSON.stringify(this.user),
    );
    return await response.user.roleTypesId;
  }

  /**
   * Get role name by id role.
   * @param token
   * @param id
   */
  getRoleName(token, id) {
    const promise = new Promise(resolve => {
      this.loginService
        .getRoleName(token, id)
        .toPromise()
        .then(data => {
          resolve(data);
        });
    });

    return promise;
  }

  /**
   * Redirect the user after login to the corresponding profile.
   * @param response
   */
  handleUserRole(roleTypesId: any) {
    this.sharedService.setTemporalItemToLocalStorage('changinLang', 0, 5000);
    switch (roleTypesId) {
      case CommonConstants.roles.SuperAdministrator:
        this.router.navigate(['super-administrator']);
        break;

      case CommonConstants.roles.Promoter:
        this.router.navigate(['administrator']);
        break;

      case CommonConstants.roles.Evaluator:
        this.router.navigate(['evaluator']);
        break;

      case CommonConstants.roles.DirectClient:
        this.router.navigate(['direct-consultant']);
        break;

      default:
        break;
    }
  }

  /**
   * Save evaluation data in localstorage.
   * @param response
   */
  handlePostLoginURL(response: any) {
    this.evaluation.results = response.results;
    this.sharedService.setItemToLocalStorage(
      'evaluationDetail',
      JSON.stringify(this.evaluation),
    );
    this.router.navigate(['results']);
    return response;
  }

  /**
   * Rejects login by URL, and shows message.
   * @param response
   */
  rejectLoginURL(response: any = null) {
    this.isRejectedURL = false;
    setTimeout(() => {
      this.isRejectedURL = true;
    }, 2);
  }

  /**
   * Rejects login by user, shows message and reset the password.
   * @param response
   */
  rejectLogin(response: any) {
    if (response.status === 401) {
      this.isRejected = false;
      setTimeout(() => {
        this.isRejected = true;
      }, 2);
      this.loginForm.controls.password.reset();
    }
  }

  /**
   * When user press enter key excecutes enterUrl function
   * @param event
   * @param credentials
   * @param isValid
   */
  onKeyToSignInURL(event: any, credentials: any, isValid: any) {
    if (event.keyCode === 13) {
      this.enterUrl(credentials, isValid);
    }
  }

  /**
   * When user press enter key excecutes login function
   * @param event
   * @param credentials
   * @param isValid
   */
  onKeyToSignIn(event: any, credentials: any, isValid: boolean) {
    if (event.keyCode === 13) {
      this.logIn(credentials, isValid);
    }
  }
}
