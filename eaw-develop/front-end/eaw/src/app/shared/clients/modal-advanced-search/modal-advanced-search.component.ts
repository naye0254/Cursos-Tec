import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';

import {ClientsPageConstants} from '../clients.constants';
import {Promoter} from '../../../models/promoter.model';
import {SharedService} from '../../shared.service';
import {CommonConstants} from '../../../common/common.constants';

@Component({
  selector: 'app-modal-advanced-search',
  templateUrl: './modal-advanced-search.component.html',
  styleUrls: ['./modal-advanced-search.component.scss'],
  providers: [SharedService],
})
/**
 * Class to component advance search
 */
export class ModalAdvancedSearchComponent implements OnInit {
  public advancedSearchForm: FormGroup;
  public formOptions: any;
  public promoterList: Promoter[];
  public presentDate: Date;
  public userRole: number;
  public administratorRole: number;
  public userId: number;

  /**
   * Constructor method
   * @param dialogRef
   * @param data
   * @param formBuilder
   * @param sharedService
   */
  constructor(
    public dialogRef: MatDialogRef<ModalAdvancedSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {
    this.userRole = this.sharedService.getUserInfoFromLocalStorage().roleTypesId;
    this.userId = +this.sharedService.getUserInfoFromLocalStorage().id;
    this.administratorRole = CommonConstants.roles.Promoter;

    this.formOptions = ClientsPageConstants.FORM_MANAGE_CLIENTS_OPTIONS;
    this.presentDate = new Date();
    this.advancedSearchForm = this.formBuilder.group({
      name: new FormControl(null, [
        Validators.maxLength(this.formOptions.lengthInputName),
      ]),
      email: new FormControl(null, [
        Validators.email,
        Validators.maxLength(this.formOptions.lengthInputEmail),
      ]),
      createdAt: new FormControl(null),
      createdBy: new FormControl({
        value: this.userRole === this.administratorRole ? this.userId : null,
        disabled: this.userRole === this.administratorRole ? true : false,
      }),
    });
    this.promoterList = [];
  }

  ngOnInit() {
    this.getPromoters(CommonConstants.MODEL_STATUS.ACTIVE);
  }

  /**
   * Take a list of promoters by the status
   * @param status if the promoter is active
   */
  private getPromoters(status) {
    this.sharedService.getAllPromoters<any>(status).subscribe(data => {
      this.promoterList = data.results;
    });
  }

  /**
   * Cancel event
   */
  public cancel(): void {
    this.data.cancelFn();
    this.dialogRef.close(null);
  }

  /**
   * Confirm advanced search
   */
  public confirmFunction(): void {
    this.data.cancelFn();
    this.dialogRef.close(this.advancedSearchForm.value);
  }
}
