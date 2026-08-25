import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {UserRestoreService} from '../user-restore.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['../user-restore.component.scss'],
})
class VerifyEmailComponent implements OnInit {
  public emailForm: FormGroup;
  public isRejected: boolean;
  public isVerified: boolean;

  public translatePath = 'landingPage.userRestore.verifyEmail';

  /**
   * Constructor verify-email
   * @param formBuilder
   * @param userRestoreService
   */
  constructor(
    private formBuilder: FormBuilder,
    private userRestoreService: UserRestoreService,
  ) {}

  ngOnInit() {
    this.formConfiguration();
  }

  /**
   * Creates the form configuration.
   */
  formConfiguration() {
    this.emailForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/),
        ],
      ],
    });
  }

  /**
   * Send the email to change the password.
   * @param credentials
   * @param isValid
   */
  sendVerificationEmail(credentials: any, isValid: boolean) {
    credentials.email = credentials.email.replace(/\s/g, '');
    if (isValid) {
      this.userRestoreService
        .sendChangePasswordEmail(credentials.email)
        .subscribe(
          data => {
            this.handleVerificationEmail();
          },
          error => {
            this.rejectVerificationEmail(error);
          },
        );
    }
  }

  /**
   * When user press enter key excecutes sendVerificationEmail function
   * @param event
   * @param credentials
   * @param isValid
   */
  onKeyToSignIn(event: any, credentials: any, isValid: boolean) {
    if (event.keyCode === 13) {
      this.sendVerificationEmail(credentials, isValid);
    }
  }

  /**
   * To handle verification emai.
   */
  handleVerificationEmail() {
    this.isRejected = false;
    this.isVerified = true;
  }

  /**
   * To handle rejected verification email.
   * @param err
   */
  rejectVerificationEmail(err: Error) {
    this.isRejected = true;
    this.isVerified = false;
  }
}
export {VerifyEmailComponent};
