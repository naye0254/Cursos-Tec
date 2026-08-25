import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ManageBrowsersComponent} from './manage-browsers/manage-browsers.component';
import {ListBrowsersComponent} from './list-browsers/list-browsers.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-browsers',
  },
  {
    path: 'list-browsers',
    component: ListBrowsersComponent,
  },
  {
    path: 'new-browser',
    component: ManageBrowsersComponent,
  },
  {
    path: 'edit-browser',
    component: ManageBrowsersComponent,
  },
];

export const BrowsersRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [
  ListBrowsersComponent,
  ManageBrowsersComponent,
];
