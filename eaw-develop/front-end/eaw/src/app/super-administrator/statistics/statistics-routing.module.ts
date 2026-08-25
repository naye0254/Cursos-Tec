import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {StatisticsComponent} from './statistics.component';
import {EvaluationsQuantityComponent} from './evaluations-quantity/evaluations-quantity.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
    children: [
      {
        path: '',
        redirectTo: 'evaluations-quantity'
      },
      {
        path: 'evaluations-quantity',
        component: EvaluationsQuantityComponent
      }
    ]
  }
];

export const StatisticsRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [StatisticsComponent];
