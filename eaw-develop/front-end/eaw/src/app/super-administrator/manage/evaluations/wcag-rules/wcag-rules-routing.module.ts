import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ManageWcagRulesComponent} from './manage-wcag-rules/manage-wcag-rules.component';
import {ListWcagRulesComponent} from './list-wcag-rules/list-wcag-rules.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-wcag-rules',
  },
  {
    path: 'list-wcag-rules',
    component: ListWcagRulesComponent,
  },
  {
    path: 'new-wcag-rule',
    component: ManageWcagRulesComponent,
  },
  {
    path: 'edit-wcag-rule',
    component: ManageWcagRulesComponent,
  },
];

export const WcagRulesRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [
  ListWcagRulesComponent,
  ManageWcagRulesComponent,
];
