import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {SharedService} from '../../shared.service';
import {Subject} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {TranslateCacheService} from 'ngx-translate-cache';
import {takeUntil} from 'rxjs/operators';

import {Country} from '../../../models/country';
import {Segments} from '../../../models/segments.model';
import {GenericModal} from '../../abstract-classes/modals/generic-modal.abstract';
import {AlertService} from '../../../utils/alerts/alerts.service';
import {ClientsService} from '../clients.service';
import {ClientsPageConstants} from '../clients.constants';
import {Clients} from '../../../models/clients.model';
import { ConfirmationModalService } from 'src/app/utils/confirmation-modal/confirmation-modal.service';
import { InputModalService } from 'src/app/utils/input-modal/input-modal/input-modal.service';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss'],
  providers: [SharedService, ClientsService, InputModalService],
})
/**
 * Class component to Edit a client
 */
export class EditClientComponent extends GenericModal
  implements OnInit, OnDestroy {
  protected onDestroy = new Subject<void>();

  public langIANA: string;
  public clientForm: FormGroup;
  public formOptions: any;
  public countries: Country[];
  public segmentsByCountry: Segments[];

  /**
   * Constructor method
   * @param dialogRef
   * @param data
   * @param translate
   * @param formBuilder
   * @param alertService
   * @param translateCacheService
   * @param clientsService
   * @param sharedService
   */
  constructor(
    public dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private translateCacheService: TranslateCacheService,
    private clientsService: ClientsService,
    public sharedService: SharedService,
    private confirmationModalService: ConfirmationModalService,
    private inputModalService: InputModalService
  ) {
    super();
    this.formOptions = ClientsPageConstants.FORM_EDIT_CLIENTS_OPTIONS;
    this.langIANA = this.translateCacheService.getCachedLanguage();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langIANA = event.lang;
    });
    this.initForm();
    this.segmentsByCountry = [];
    this.loadForm();
  }

  ngOnInit() {
    this.getCountries();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  /**
   * Set form values
   */
  loadForm() {
    this.clientForm.patchValue(this.data.client);
    this.clientForm.controls.password.setValue('12345');
    this.getSegmentsByCountry(this.data.client.countriesId);
    this.loadRadioButtons();
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
      password: new FormControl({value: '', disabled: true}, [
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
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputPostalCode),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.formOptions.lengthInputAddress),
      ]),
      isActive: new FormControl('1', [Validators.required]),
    });
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
   * Load radio button in the form
   */
     private loadRadioButtons() {
      this.clientForm.controls.isActive.setValue(
        this.data.client.isActive.toString(),
      );
    }

  /**
   * Get segments by country selected
   * @param event
   */
  public getSegmentsByCountry(countryId) {
    this.clientsService
      .getSegmensByCountry(countryId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.segmentsByCountry = data;
      });
  }

  /**
   * Cancel event
   */
  public cancel(): void {
    this.data.cancelFn();
    this.dialogRef.close(null);
  }

  public confirmFunction() {
    const client = this.clientForm.value as Clients;
    client.id = this.data.client.id;
    client.updatedAt = new Date();
    client.updatedBy = this.sharedService.getUserInfoFromLocalStorage().id;
    client.createdAt = this.data.client.createdAt;
    client.createdBy = this.data.client.createdBy;
    this.createItemModel(
      'Clients/update-clients',
      {client},
      () => {
        this.success(
          'Cliente Actualizado',
          `El cliente ${client.firstName} fue actualizado con <b >éxito</b>`,
          this.alertService,
          () => {
            this.data.confirmFn();
            this.dialogRef.close();
          },
        );
      },
      () => {
        this.error(
          'Cliente no actualizado',
          `Ocurrió un error al actualizar el cliente ${client.firstName}`,
          this.alertService,
          () => {},
        );
      },
      this.sharedService,
    );
  }


  /**
   * Sets the isDeleted attribute of the client to true and updates it in the DB.
   * Shows a confirmation dialog to the user.
   */
  public deleteFunction() {
    this.inputModalService.openConfirmDialog(
      'Eliminar el cliente',
      'Al eliminar este cliente quedara deshabilitado y no aparecerá en ninguna lista.',
      'Borrar',
      'Cancelar',
      () => {
        const client = this.clientForm.value as Clients;
        client.deletionJustification = this.inputModalService.getDeleteJustification();
        client.id = this.data.client.id;
        client.updatedAt = new Date();
        client.updatedBy = this.sharedService.getUserInfoFromLocalStorage().id;
        client.createdAt = this.data.client.createdAt;
        client.createdBy = this.data.client.createdBy;
        client.isDeleted = true;

        this.createItemModel(
          'Clients/update-clients',
          {client},
          () => {
            this.success(
              'Cliente Eliminado',
              `El cliente ${client.firstName} ha sido eliminado con <b >éxito</b>`,
              this.alertService,
              () => {
                this.data.confirmFn();
                this.dialogRef.close();
              },
            );
          },
          () => {
            this.error(
              'Cliente no eliminado',
              `Ocurrió un error al eliminar el cliente ${client.firstName}`,
              this.alertService,
              () => {},
            );
          },
          this.sharedService,
        );
      },
      () => { 
        // do nothing 
      }
    );
  }
}
