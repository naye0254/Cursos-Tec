import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluationReportsComponent } from './evaluation-reports/evaluation-reports.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluationReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationsReportsRoutingModule { }
