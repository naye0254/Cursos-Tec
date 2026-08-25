import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FindingsComponent} from './findings.component';

const routes: Routes = [
  {
    path: '',
    component: FindingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [FindingsComponent],
})
export class FindingsRoutingModule {}
