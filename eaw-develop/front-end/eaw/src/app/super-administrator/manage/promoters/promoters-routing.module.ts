import {NgModule} from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListPromotersComponent} from './list-promoters/list-promoters.component';
import {ManagePromoterComponent} from './manage-promoter/manage-promoter.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-promoter',
  },
  {
    path: 'list-promoter',
    component: ListPromotersComponent,
  },
  {
    path: 'edit-promoter',
    component: ManagePromoterComponent,
  },
  {
    path: 'new-promoter',
    component: ManagePromoterComponent,
  },
];

export const PromotersRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [
  ListPromotersComponent,
  ManagePromoterComponent,
];
