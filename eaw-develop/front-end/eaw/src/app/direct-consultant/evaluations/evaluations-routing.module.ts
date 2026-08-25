import {NgModule, ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'list-evaluations',
      },
      {
        path: 'list-evaluations',
        loadChildren: () =>
          import('./list/list.module').then(m => m.ListModule),
      },
      {
        path: 'request-evaluation',
        loadChildren: () =>
          import('./request-evaluation/request-evaluation.module').then(
            m => m.RequestEvaluationModule,
          ),
      },
    ],
  },
];

export const EvaluationsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [DashboardComponent];
