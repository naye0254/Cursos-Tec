import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {TranslateSharedModule} from '../../shared/translateShared.module';
import {LayoutService} from './layout.service';
import {MaterialModule} from '../../material.module';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateSharedModule,
    MaterialModule,
  ],
  exports: [NavbarComponent, FooterComponent],
  providers: [LayoutService],
})
export class LayoutModule {}
