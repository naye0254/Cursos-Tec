import {ModuleWithProviders} from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { EvaluationReportComponent } from './evaluation-report/evaluation-report.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluationReportComponent,
  }
];

export const EvaluationReportRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [EvaluationReportComponent];

