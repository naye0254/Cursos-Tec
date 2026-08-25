import {NgModule, ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListComponent} from './list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'selection',
  },
  {
    path: 'selection',
    loadChildren: () =>
      import('../selection/selection.module').then(m => m.SelectionModule),
  },
  {
    path: 'list/:client-id/:year/:segment-id/:indirect-client',
    component: ListComponent,
  },
  {
    path: 'detail',
    loadChildren: () =>
      import('./detail/detail.module').then(m => m.DetailModule),
  },
];

export const ListRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [ListComponent];
