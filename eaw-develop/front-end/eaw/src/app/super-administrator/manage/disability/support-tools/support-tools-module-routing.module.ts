import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {ListSupportToolsComponent} from './list-support-tools/list-support-tools.component';
import {ManageSupportToolsComponent} from './manage-support-tools/manage-support-tools.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-support-tools',
  },
  {
    path: 'list-support-tools',
    component: ListSupportToolsComponent,
  },
  {
    path: 'new-support-tool',
    component: ManageSupportToolsComponent,
  },
  {
    path: 'edit-support-tool',
    component: ManageSupportToolsComponent,
  },
];

export const SupportToolsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [
  ListSupportToolsComponent,
  ManageSupportToolsComponent,
];
