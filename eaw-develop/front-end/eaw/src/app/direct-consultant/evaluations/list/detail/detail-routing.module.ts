import {NgModule, ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DetailComponent} from './detail.component';
import { EvaluationErrorComponent } from './error/evaluationerror.component';

const routes: Routes = [
  {
    path: 'results/:id',
    component: DetailComponent,
    children: [
      {
        path: 'statistics',
        loadChildren: () =>
          import('./statistics/statistics.module').then(
            m => m.StatisticsModule,
          ),
      },
      {
        path: 'findings',
        loadChildren: () =>
          import('./findings/findings.module').then(m => m.FindingsModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then(m => m.ReportsModule),
      },
    ], 
  },
  // nueva ruta para los errores de evaluaciones
  {
    path: 'error/:id',
    component: EvaluationErrorComponent,
  }
];

export const DetailRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [DetailComponent];
