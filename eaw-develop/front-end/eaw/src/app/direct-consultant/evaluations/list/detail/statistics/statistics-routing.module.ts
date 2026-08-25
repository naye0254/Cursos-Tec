import {NgModule, ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StatisticsComponent} from './statistics.component';

const routes: Routes = [
  {
    path: 'stats',
    component: StatisticsComponent,
  },
];

export const StatisticsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [StatisticsComponent];
