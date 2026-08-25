import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {Step1Component} from './step1/step1.component';
import {Step2Component} from './step2/step2.component';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: ''
      },
      {
        path: 'step-1/:evaluationId',
        component: Step1Component
      },
      {
        path: 'step-2/:evaluationId',
        component: Step2Component
      }
    ]
  }
];

export const NewEvaluationRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [Step1Component, Step2Component, DashboardComponent];
