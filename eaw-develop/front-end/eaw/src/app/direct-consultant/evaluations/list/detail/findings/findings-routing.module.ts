import {NgModule, ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FindingsComponent} from './findings.component';

const routes: Routes = [
  {
    path: 'findings',
    component: FindingsComponent,
  },
];

export const FindingsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [FindingsComponent];
