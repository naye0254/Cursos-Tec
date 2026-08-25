import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {MultiSelectComponent} from './ng-multiselect-dropdown/multiselect.component';
import {ClickOutsideDirective} from './ng-multiselect-dropdown/click-outside.directive';
import {ListFilterPipe} from './ng-multiselect-dropdown/list-filter.pipe';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [MultiSelectComponent, ClickOutsideDirective, ListFilterPipe],
  exports: [MultiSelectComponent],
})
export class DirectivesModule {}
