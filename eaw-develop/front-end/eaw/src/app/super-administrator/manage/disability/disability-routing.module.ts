import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'type-disability',
  },
  {
    path: 'support-tools',
    loadChildren: () =>
      import('./support-tools/support-tools.module').then(
        m => m.SupportToolsModuleModule,
      ),
  },
  {
    path: 'type-disability',
    loadChildren: () =>
      import('./type-disability/type-disability.module').then(
        m => m.TypeDisabilityModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisabilityRoutingModule {}
