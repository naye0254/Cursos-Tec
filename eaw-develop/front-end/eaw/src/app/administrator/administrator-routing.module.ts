import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {PrincipalPageComponent} from './principal-page/principal-page.component';
import {ProfileComponent} from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {path: '', component: PrincipalPageComponent},
      {
        path: 'clients',
        loadChildren: () =>
          import('./clients/clients.module').then(m => m.ClientsModule),
      },
      {
        path: 'evaluations',
        loadChildren: () =>
          import('../shared/evaluations/evaluations.module').then(
            m => m.EvaluationsAdminModule,
          ),
      },
      {
        path: 'tracking',
        loadChildren: () =>
          import('../shared/tracking/tracking.module').then(m => m.TrackingModule),
      },
      {path: 'profile', component: ProfileComponent},
    ],
  },
];

export const AdministratorRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [
  PrincipalPageComponent,
  DashboardComponent,
  ProfileComponent,
];
