import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {ListEvaluationsComponent} from './list-evaluations/list-evaluations.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListEvaluationsComponent,
  },
];

export const EvaluationsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [ListEvaluationsComponent];
