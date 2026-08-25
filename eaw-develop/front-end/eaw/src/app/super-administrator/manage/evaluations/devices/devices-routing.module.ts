import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ManageDevicesComponent} from './manage-devices/manage-devices.component';
import {ListsDevicesComponent} from './lists-devices/lists-devices.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-devices',
  },
  {
    path: 'new-device',
    component: ManageDevicesComponent,
  },
  {
    path: 'list-devices',
    component: ListsDevicesComponent,
  },
  {
    path: 'edit-device',
    component: ManageDevicesComponent,
  },
];

export const DevicesRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [ListsDevicesComponent, ManageDevicesComponent];
