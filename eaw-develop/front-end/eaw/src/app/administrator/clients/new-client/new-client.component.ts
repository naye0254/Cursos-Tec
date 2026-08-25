import {Component, OnInit, OnDestroy} from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';

import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {Country} from '../../../models/country';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {SharedService} from '../../../shared/shared.service';
import {ManageClientsConstants} from '../clients.constants';
import {ClientsService} from '../clients.service';
import {Segments} from '../../../models/segments.model';
import {Clients} from '../../../models/clients.model';
import {GenericModal} from '../../../shared/abstract-classes/modals/generic-modal.abstract';
import {AlertService} from '../../../utils/alerts/alerts.service';
import {CommonConstants} from '../../../common/common.constants';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss'],
})
/**
 * Component class  to create a client
 */
export class NewClientComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public langIANA: string;
  public clientForm: FormGroup;
  public formOptions: any;
  public countries: Country[];
  public segmentsByCountry: Segments[];
  HTML_NEW_TITLE;
  /**
   * Constructor method
   * @param translate
   * @param formBuilder
   * @param alertService
   * @param translateCacheService
   * @param clientsService
   * @param sharedService
   */
  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private translateCacheService: TranslateCacheService,
    private clientsService: ClientsService,
    public sharedService: SharedService,
  ) {
    super();
    this.formOptions = ManageClientsConstants.FORM_MANAGE_CLIENTS_OPTIONS;
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.setHTMLTitle(this.langIANA);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
      this.setHTMLTitle(this.langIANA);
    });
    this.initForm();
    this.segmentsByCountry = [];
  }

  ngOnInit() {
    this.getCountries();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Init the clients form
   */
  private initForm() {
    this.clientForm = this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputName),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputEmail),
      ]),
      telephone: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputTelephone),
      ]),
      password: new FormControl({value: '12345', disabled: true}, [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputPassword),
      ]),
      countriesId: new FormControl('', [Validators.required]),
      segments: new FormControl([], [Validators.required]),
      city: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputCity),
      ]),
      countryRegion: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputCountryRegion),
      ]),
      postalCode: new FormControl('', [
        Validators.maxLength(this.formOptions.lengthInputPostalCode),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputAddress),
      ]),
    });
  }

  /**
   * Change the HTML title
   * @param language string language
   */
  private setHTMLTitle(language: string) {
    this.sharedService.setTitle(
      ManageClientsConstants.HTML_NEW_TITLE[language].title,
    );
  }

  /**
   * Get countries
   */
  private getCountries() {
    this.clientsService
      .getModelListByStatus<Country>('Countries', null)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.countries = data;
      });
  }

  /**
   * Get segments by country selected
   * @param event
   */
  public getSegmentsByCountry(event) {
    this.clientsService
      .getSegmensByCountry(event.value)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.segmentsByCountry = data;
      });
  }

  /**
   * Create a new client method
   */
  public createClient() {
    const client = this.clientForm.value as Clients;
    client.id = 0;
    client.lastName = '';
    client.username = client.email;
    client.password = '12345';
    client.sex = CommonConstants.SEX_ORIENTATIONS.undefined;
    client.isActive = true;
    client.languagesId = 1;
    client.realm = '';
    client.roleTypesId = CommonConstants.roles.DirectClient;
    client.emailVerified = false;
    client.isDeleted = false;
    client.verificationToken = '';
    client.createdAt = new Date();
    client.createdBy = this.sharedService.getUserInfoFromLocalStorage().id;
    this.createItemModel(
      'Clients/clients',
      {client},
      () => {
        this.success(
          'Cliente Creado',
          `El cliente ${client.firstName} fue creado con <b >éxito</b>`,
          this.alertService,
          () => {
            this.clientForm.reset();
          },
        );
      },
      () => {
        this.error(
          'Cliente no creado',
          `Ocurrió un error al crear el cliente ${client.firstName}`,
          this.alertService,
          () => {},
        );
      },
      this.sharedService,
    );
  }

  /**
   * Function to reset the button when the button is pressed
   */
  public resetButton() {
    this.clientForm.reset();
  }
}
