import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ManualEvaluationComponent} from './manual-evaluation/manual-evaluation.component';
import {EvaluatorComponent} from './evaluator.component';
import {PrincipalPageComponent} from './principal-page/principal-page.component';
import {ProfileComponent} from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: EvaluatorComponent,
    children: [
      {path: '', component: PrincipalPageComponent},
      {
        path:
          'manual-evaluation/:evaluationId/:specificationId/:pageId/:manualPageId',
        component: ManualEvaluationComponent,
      },
      {
        path: 'evaluations',
        loadChildren: () =>
          import('./evaluations/evaluations.module').then(
            m => m.EvaluatorEvaluationsModule,
          ),
      },
      {path: 'profile', component: ProfileComponent},
    ],
  },
];

export const EvaluatorRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [
  EvaluatorComponent,
  ManualEvaluationComponent,
  PrincipalPageComponent,
  ProfileComponent,
];
