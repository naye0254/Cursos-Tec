import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ListRoutingModule} from './list-routing.module';
import {DetailModule} from './detail/detail.module';

@NgModule({
  imports: [CommonModule, ListRoutingModule, DetailModule],
})
export class ListModule {}
