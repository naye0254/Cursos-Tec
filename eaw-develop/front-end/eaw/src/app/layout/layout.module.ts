import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {NavbarComponent} from './navbar/navbar.component';
import {NotificationsMenuComponent} from './navbar/notifications-menu/notifications-menu.component';
import {FooterComponent} from './footer/footer.component';
import {MainMenuComponent} from './main-menu/main-menu.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {MaterialModule} from '../material/material-module';
import {TranslateSharedModule} from '../shared/translateShared.module';
import {SharedService} from '../shared/shared.service';
import {NotResultComponent} from './not-result/not-result.component';
import {NotResultFilterComponent} from './not-result-filter/not-result-filter.component';

@NgModule({
  declarations: [
    NavbarComponent,
    NotificationsMenuComponent,
    FooterComponent,
    MainMenuComponent,
    SidebarComponent,
    NotResultComponent,
    NotResultFilterComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, TranslateSharedModule],
  exports: [
    NavbarComponent,
    NotificationsMenuComponent,
    FooterComponent,
    MainMenuComponent,
    SidebarComponent,
    NotResultComponent,
    NotResultFilterComponent,
  ],
  providers: [SharedService],
})
export class LayoutModule {}
