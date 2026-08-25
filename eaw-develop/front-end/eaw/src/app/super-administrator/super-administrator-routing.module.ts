import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {DashboardComponent} from './dashboard/dashboard.component';
import {SuperAdminPrincipalPageComponent} from './principal-page/principal-page.component';
import {ProfileComponent} from './profile/profile.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {path: '', component: SuperAdminPrincipalPageComponent},
      {
        path: 'evaluations',
        loadChildren: () =>
          import('../shared/evaluations/evaluations.module').then(m => m.EvaluationsAdminModule)
      },
      {
        path: 'manage',
        loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule)
      },
      {
        path: 'clients',
        loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
      },
      {
        path: 'statistics',
        loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsModule)
      },
      {
        path: 'tracking',
        loadChildren: () => import('../shared/tracking/tracking.module').then(m => m.TrackingModule)
      },
      {path: 'profile', component: ProfileComponent}
    ]
  }
];

export const SuperAdministratorRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
export const routedComponents = [
  DashboardComponent,
  SuperAdminPrincipalPageComponent,
  ProfileComponent
];
