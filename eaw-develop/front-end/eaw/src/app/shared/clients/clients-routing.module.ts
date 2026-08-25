import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListClientsComponent} from './list-clients/list-clients.component';
import {ModalAdvancedSearchComponent} from './modal-advanced-search/modal-advanced-search.component';

const routes: Routes = [];

export const ClientsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [
  ListClientsComponent,
  ModalAdvancedSearchComponent,
];
