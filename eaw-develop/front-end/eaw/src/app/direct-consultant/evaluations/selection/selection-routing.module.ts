import {NgModule, ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TitleComponent} from './title/title.component';
import {StepComponent} from './step/step.component';
import {SelectionComponent} from './selection.component';

const routes: Routes = [
  {
    path: '',
    component: SelectionComponent,
  },
];

export const SelectionRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [
  SelectionComponent,
  TitleComponent,
  StepComponent,
];
