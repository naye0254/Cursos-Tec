import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListEvaluatorsComponent} from './list-evaluators/list-evaluators.component';
import {ManageEvaluatorComponent} from './manage-evaluator/manage-evaluator.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-evaluators',
  },
  {
    path: 'list-evaluators',
    component: ListEvaluatorsComponent,
  },
  {
    path: 'new-evaluator',
    component: ManageEvaluatorComponent,
  },
  {
    path: 'edit-evaluator',
    component: ManageEvaluatorComponent,
  },
];

export const EvaluatorsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [
  ListEvaluatorsComponent,
  ManageEvaluatorComponent,
];
