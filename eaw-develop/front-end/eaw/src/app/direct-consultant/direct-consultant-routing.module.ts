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
      {path: 'profile', component: ProfileComponent},
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

export const DirectConsultantRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [
  DashboardComponent,
  PrincipalPageComponent,
  ProfileComponent,
];
