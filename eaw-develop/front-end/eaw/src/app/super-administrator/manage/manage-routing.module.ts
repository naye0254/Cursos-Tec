import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {ManageComponent} from './manage.component';

const routes: Routes = [
  {
    path: '',
    component: ManageComponent,
    children: [
      {
        path: '',
        redirectTo: 'promoters',
      },
      {
        path: 'promoters',
        loadChildren: () =>
          import('./promoters/promoters.module').then(m => m.PromotersModule),
      },
      {
        path: 'evaluators',
        loadChildren: () =>
          import('./evaluators/evaluators.module').then(
            m => m.EvaluatorsModule,
          ),
      },
      {
        path: 'segments',
        loadChildren: () =>
          import('./segments/segments.module').then(m => m.SegmentsModule),
      },
      {
        path: 'disability',
        loadChildren: () =>
          import('./disability/disability.module').then(
            m => m.DisabilityModule,
          ),
      },
      {
        path: 'evaluations',
        loadChildren: () =>
          import('./evaluations/evaluations.module').then(
            m => m.EvaluationsModule,
          ),
      },
    ],
  },
];

export const ManageRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [ManageComponent];
