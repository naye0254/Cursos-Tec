import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuardService} from './utils/can-activate/auth-guard.service';
import {CommonConstants} from './common/common.constants';

import {SessionExpiredComponent} from './utils/session-expired/session-expired.component';
import {AddManuallyPageComponent} from './utils/add-manually-page/add-manually-page.component';

const routes: Routes = [
  {
    path: 'landing-page',
    loadChildren: () =>
      import('./landing-page/landing-page.module').then(
        m => m.LandingPageModule,
      ),
  },
  {
    path: 'direct-consultant',
    loadChildren: () =>
      import('./direct-consultant/direct-consultant.module').then(
        m => m.DirectConsultantModule,
      ),
    canActivate: [AuthGuardService],
    data: {roles: [CommonConstants.roles.DirectClient]},
  },
  {
    path: 'indirect-consultant',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('./indirect-consultant/indirect-consultant.module').then(
        m => m.IndirectConsultantModule,
      ),
  },
  {
    path: 'super-administrator',
    loadChildren: () =>
      import('./super-administrator/super-administrator.module').then(
        m => m.SuperAdministratorModule,
      ),
    canActivate: [AuthGuardService],
    data: {roles: [CommonConstants.roles.SuperAdministrator]},
  },
  {
    path: 'administrator',
    loadChildren: () =>
      import('./administrator/administrator.module').then(
        m => m.AdministratorModule,
      ),
    canActivate: [AuthGuardService],
    data: {roles: [CommonConstants.roles.Promoter]},
  },
  {
    path: 'evaluator',
    loadChildren: () =>
      import('./evaluator/evaluator.module').then(m => m.EvaluatorModule),
    canActivate: [AuthGuardService],
    data: {roles: [CommonConstants.roles.Evaluator]},
  },
  {
    path: 'session-expired',
    component: SessionExpiredComponent,
  },
  {
    path: 'develop-add-manually-page',
    component: AddManuallyPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
