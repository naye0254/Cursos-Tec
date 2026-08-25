import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ClientsComponent} from './clients.component';
import {ModalAdvancedSearchComponent} from '../../shared/clients/modal-advanced-search/modal-advanced-search.component';
import {ListClientsComponent} from './list-clients/list-clients.component';

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list-clients',
      },
      {
        path: 'list-clients',
        component: ListClientsComponent,
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

export const routedComponents = [ClientsComponent, ListClientsComponent];
