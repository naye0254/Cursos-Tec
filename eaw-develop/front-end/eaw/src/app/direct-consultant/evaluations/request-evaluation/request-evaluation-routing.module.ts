import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RequestEvaluationComponent} from './request-evaluation.component';

const routes: Routes = [
  {
    path: '',
    component: RequestEvaluationComponent,
  },
];

export const RequestEvaluationRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [RequestEvaluationComponent];
