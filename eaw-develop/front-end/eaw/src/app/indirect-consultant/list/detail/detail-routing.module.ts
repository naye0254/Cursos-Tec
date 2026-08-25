import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DetailComponent} from './detail.component';

const routes: Routes = [
  {
    path: '',
    component: DetailComponent,
    children: [
      {
        path: 'statistics',
        loadChildren: () =>
          import('./statistics/statistics.module').then(
            m => m.StatisticsModule,
          ),
      },
      {
        path: 'findings',
        loadChildren: () =>
          import('./findings/findings.module').then(m => m.FindingsModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then(m => m.ReportsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [DetailComponent],
})
export class DetailRoutingModule {}
