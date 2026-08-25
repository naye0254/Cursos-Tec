import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'package',
  },
  {
    path: 'package',
    loadChildren: () =>
      import('./package/package.module').then(m => m.PackageModule),
  },
  {
    path: 'browsers',
    loadChildren: () =>
      import('./browsers/browsers.module').then(m => m.BrowsersModule),
  },
  {
    path: 'devices',
    loadChildren: () =>
      import('./devices/devices.module').then(m => m.DevicesModule),
  },
  {
    path: 'wcag-rules',
    loadChildren: () =>
      import('./wcag-rules/wcag-rules.module').then(m => m.WcagRulesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EvaluationsRoutingModule {}
