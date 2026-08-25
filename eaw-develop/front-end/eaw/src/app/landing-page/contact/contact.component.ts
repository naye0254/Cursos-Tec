import {Component, OnInit} from '@angular/core';

import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ContactService} from './contact.service';
import {AlertService} from '../../utils/alerts/alerts.service';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  public contactForm: FormGroup;
  public translatePath = 'landingPage.contact';
  public translatePathForm = 'landingPage.contact.form';

  public successAlertObj: any;
  public errorAlertObj: any;
  /**
   * Constructor contact
   * @param formBuilder
   */
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private contactService: ContactService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.formConfiguration();
    this.getTranslationsAlerts();
    window.scrollTo(0, 0);
  }

  /**
   * To translate the alerts
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
   * Creates the form configuration.
   */
  formConfiguration() {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
      company: ['', [Validators.required, Validators.maxLength(60)]],
      phone: ['', [Validators.required]],
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/),
        ],
      ],
      message: ['', [Validators.maxLength(2000)]],
    });
  }

  /**
   * Sends an email for contact
   * @param credentials
   * @param isValid
   */
  sendContact(credentials: any, isValid: boolean) {
    if (isValid) {
      this.contactService
        .sendEmail(
          credentials.name,
          credentials.company,
          credentials.phone,
          credentials.email,
          credentials.message,
        )
        .subscribe(
          data => {
            this.alertService.openAlert(
              this.successAlertObj.title,
              this.successAlertObj.text,
              'éxito',
              () => {
                this.contactForm.reset();
              },
            );
          },
          error => {
            this.alertService.openAlert(
              this.errorAlertObj.title,
              this.errorAlertObj.text,
              'error',
              () => {},
            );
          },
        );
    }
  }

  /**
   * When user press enter key excecutes sendContact function
   * @param event
   * @param credentials
   * @param isValid
   */
  onKeyToSignIn(event: any, credentials: any, isValid: any) {
    if (event.keyCode === 13) {
      this.sendContact(credentials, isValid);
    }
  }
}
