import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AlertsComponent} from './alerts/alerts.component';
import {ConfirmationModalComponent} from './confirmation-modal/confirmation-modal.component';
import {LanguageConfigComponent} from './language-config/language-config.component';
import {TranslateSharedModule} from '../shared/translateShared.module';
import {SessionExpiredComponent} from './session-expired/session-expired.component';
import {MaterialModule} from '../material/material-module';
import {PaginationCustomComponent} from './pagination-custom/pagination-custom.component';
import {AddManuallyPageComponent} from './add-manually-page/add-manually-page.component';
import { InputModalComponent } from './input-modal/input-modal/input-modal.component';

@NgModule({
  declarations: [
    AlertsComponent,
    ConfirmationModalComponent,
    LanguageConfigComponent,
    SessionExpiredComponent,
    PaginationCustomComponent,
    AddManuallyPageComponent,
    InputModalComponent,
  ],
  imports: [
    CommonModule,
    TranslateSharedModule,
    MaterialModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AlertsComponent,
    ConfirmationModalComponent,
    LanguageConfigComponent,
    SessionExpiredComponent,
    PaginationCustomComponent,
    AddManuallyPageComponent,
    InputModalComponent,
  ],
  entryComponents: [
    ConfirmationModalComponent,
    AlertsComponent,
    LanguageConfigComponent,
    SessionExpiredComponent,
    AddManuallyPageComponent,
    InputModalComponent,
  ],
})
export class UtilsModule {}
