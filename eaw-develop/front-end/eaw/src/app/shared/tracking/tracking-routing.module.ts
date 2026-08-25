import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {GraphEvaluationsComponent} from './graph-evaluations/graph-evaluations.component';
import {ListEvaluationsComponent} from './list-evaluations/list-evaluations.component';
import {ListEvaluatorsComponent} from './list-evaluators/list-evaluators.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'list-evaluators',
      },
      {
        path: 'graph-evaluation/:evaluationId/:evaluatorId',
        component: GraphEvaluationsComponent,
      },
      {
        path: 'list-evaluations/:evaluatorId',
        component: ListEvaluationsComponent,
      },
      {
        path: 'list-evaluators',
        component: ListEvaluatorsComponent,
      },
    ],
  },
];

export const TrackingRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [
  DashboardComponent,
  GraphEvaluationsComponent,
  ListEvaluationsComponent,
  ListEvaluatorsComponent,
];
