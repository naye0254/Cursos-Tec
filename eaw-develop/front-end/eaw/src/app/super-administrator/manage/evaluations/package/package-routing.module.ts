import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListPackagesComponent} from './list-packages/list-packages.component';
import {ManagePackageComponent} from './manage-package/manage-package.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-packages',
  },
  {
    path: 'list-packages',
    component: ListPackagesComponent,
  },
  {
    path: 'new-package',
    component: ManagePackageComponent,
  },
  {
    path: 'edit-package',
    component: ManagePackageComponent,
  },
];
export const PackagesRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [ListPackagesComponent, ManagePackageComponent];
