import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ManageSegmentComponent} from './manage-segment/manage-segment.component';
import {ListSegmentsComponent} from './list-segments/list-segments.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-segments',
  },
  {
    path: 'list-segments',
    component: ListSegmentsComponent,
  },
  {
    path: 'new-segment',
    component: ManageSegmentComponent,
  },
  {
    path: 'edit-segment',
    component: ManageSegmentComponent,
  },
];

export const SegmentsRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);

export const routedComponents = [ListSegmentsComponent, ManageSegmentComponent];
