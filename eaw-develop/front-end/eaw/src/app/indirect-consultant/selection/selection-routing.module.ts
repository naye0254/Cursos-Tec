import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SelectionComponent} from './selection.component';

const routes: Routes = [
  {
    path: '',
    component: SelectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [SelectionComponent],
})
export class SelectionRoutingModule {}
