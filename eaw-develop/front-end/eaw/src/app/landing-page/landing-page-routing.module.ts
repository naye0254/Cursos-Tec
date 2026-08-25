import {NgModule, ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home/home.component';
import {ContactComponent} from './contact/contact.component';
import {LoginComponent} from './login/login.component';
import {UserRestoreComponent} from './user-restore/user-restore.component';
import {VerifyEmailComponent} from './user-restore/verify-email/verify-email.component';
import {ChangePasswordComponent} from './user-restore/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'user-restore',
    component: UserRestoreComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export const LandingPageRoutingModule: ModuleWithProviders = RouterModule.forChild(
  routes,
);
export const routedComponents = [
  HomeComponent,
  ContactComponent,
  LoginComponent,
  UserRestoreComponent,
  VerifyEmailComponent,
  ChangePasswordComponent,
];
