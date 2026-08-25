import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DetailEvaluationComponent} from './detail-evaluation/detail-evaluation.component';
import {ListEvaluationsComponent} from './list-evaluations/list-evaluations.component';

const routes: Routes = [
  {
    path: '',
    component: ListEvaluationsComponent,
  },
  {
    path: 'detail',
    loadChildren: () =>
      import(
        '../../../direct-consultant/evaluations/list/detail/detail.module'
      ).then(m => m.DetailModule),
  },
  {
    path: 'detail-evaluation/:id',
    component: DetailEvaluationComponent,
  },
];

export const ListEvaluationsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [
  DetailEvaluationComponent,
  ListEvaluationsComponent,
];
