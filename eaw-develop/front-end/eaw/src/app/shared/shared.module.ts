import {ChartModule} from 'angular-highcharts';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

import {GeneralStatisticsComponent} from './general-statistics/general-statistics.component';
import {ProfileComponent} from './profile/profile.component';
import {ChangePasswordComponent} from './profile/change-password/change-password.component';
import {SelectionListComponent} from './selection-list/selection-list.component';
import {PrincipalPageComponent} from './principal-page/principal-page.component';
import {MaterialModule} from '../material/material-module';
import {SharedService} from './shared.service';
import {ClientsModule} from './clients/clients.module';
import {TranslateSharedModule} from '../shared/translateShared.module';
import {CriteriaInfoComponent} from '../evaluator/manual-evaluation/modals/criteria-info/criteria-info.component';
import {DirectivesModule} from '../directives/directives.module';

@NgModule({
  declarations: [
    SelectionListComponent,
    PrincipalPageComponent,
    ProfileComponent,
    GeneralStatisticsComponent,
    ChangePasswordComponent,
    CriteriaInfoComponent
  ],
  imports: [
    CommonModule,
    ChartModule,
    MaterialModule,
    FormsModule,
    DirectivesModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateSharedModule,
    ClientsModule
  ],
  exports: [
    SelectionListComponent,
    PrincipalPageComponent,
    ProfileComponent,
    GeneralStatisticsComponent,
    ClientsModule,
    CriteriaInfoComponent
  ],
  entryComponents: [ChangePasswordComponent, CriteriaInfoComponent],
  providers: [SharedService]
})
export class SharedModule {}
