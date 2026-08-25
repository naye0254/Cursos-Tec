import {NgModule, ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ReportsComponent} from './reports.component';

const routes: Routes = [
  {
    path: 'reports',
    component: ReportsComponent,
  },
];

export const ReportsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [ReportsComponent];
