import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {DashboardComponent} from './dashboard/dashboard.component';
/* import {ListEvaluationsComponent} from './list-evaluations/list-evaluations/list-evaluations.component'; */

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'list-evaluations'
      },
      {
        path: 'list-evaluations',
        loadChildren: () =>
          import('./list-evaluations/list-evaluations.module').then(m => m.ListEvaluationsModule)
      },
      {
        path: 'new-evaluation',
        loadChildren: () =>
          import('./new-evaluation/new-evaluation.module').then(m => m.NewEvaluationModule)
      },
      {
        path: 'evaluations-reports',
        loadChildren: () =>
          import('./evaluations-reports/evaluations-reports.module').then(m => m.EvaluationsReportsModule)
      },
      {
        path: 'edit-evaluation',
        loadChildren: () =>
          import('./edit-evaluation/edit-evaluation.module').then(m => m.EditEvaluationModule)
      }
    ]
  }
];

export const EvaluationsRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [DashboardComponent];
