import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ProfileComponent} from './profile/profile.component';
import {PrincipalPageComponent} from './principal-page/principal-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {path: '', component: PrincipalPageComponent},
      {path: 'profile', component: ProfileComponent},
      {
        path: 'selection',
        loadChildren: () =>
          import('./selection/selection.module').then(m => m.SelectionModule),
      },
      {
        path: 'detail',
        loadChildren: () =>
          import(
            '../direct-consultant/evaluations/list/detail/detail.module'
          ).then(m => m.DetailModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export const IndirectConsultantRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [
  DashboardComponent,
  ProfileComponent,
  PrincipalPageComponent,
];
