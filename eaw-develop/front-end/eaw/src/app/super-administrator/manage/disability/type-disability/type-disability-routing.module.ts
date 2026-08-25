import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListTypeDisabilitysComponent} from './list-type-disabilities/list-type-disabilities.component';
import {ManageDisabilityComponent} from './manage-disability/manage-disability.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-type-disabilities',
  },
  {
    path: 'list-type-disabilities',
    component: ListTypeDisabilitysComponent,
  },
  {
    path: 'edit-type-disability',
    component: ManageDisabilityComponent,
  },
  {
    path: 'new-type-disability',
    component: ManageDisabilityComponent,
  },
];

export const TypeDisabilityRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [
  ListTypeDisabilitysComponent,
  ManageDisabilityComponent,
];
