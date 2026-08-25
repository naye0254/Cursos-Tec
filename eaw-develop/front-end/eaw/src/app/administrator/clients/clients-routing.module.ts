import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListClientsComponent} from './list-clients/list-clients.component';
import {ViewClientComponent} from './view-client/view-client.component';
import {NewClientComponent} from './new-client/new-client.component';
import {DashboardComponent} from './dashboard/dashboard.component';

import {ModalAdvancedSearchComponent} from '../../shared/clients/modal-advanced-search/modal-advanced-search.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'view-client',
      },
      {
        path: 'list-clients/:segmentId',
        component: ListClientsComponent,
      },
      {
        path: 'new-client',
        component: NewClientComponent,
      },
      {
        path: 'view-client',
        component: ViewClientComponent,
      },
      {
        path: 'advanced-search',
        component: ModalAdvancedSearchComponent,
      },
    ],
  },
];

export const ClientsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [
  ListClientsComponent,
  NewClientComponent,
  ViewClientComponent,
  DashboardComponent,
];
