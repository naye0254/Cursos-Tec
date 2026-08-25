import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {DashboardComponent} from './dashboard/dashboard.component';
import {ListEvaluationsComponent} from './list-evaluations/list-evaluations.component';
import {CommonConstants} from '../../common/common.constants';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: `evaluations-list/${CommonConstants.EVALUATIONS_STATES.PENDING}`,
        pathMatch: 'full',
      },
      {
        path: 'evaluations-list/:state',
        component: ListEvaluationsComponent,
      },
    ],
  },
];

export const EvaluationsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [DashboardComponent, ListEvaluationsComponent];
