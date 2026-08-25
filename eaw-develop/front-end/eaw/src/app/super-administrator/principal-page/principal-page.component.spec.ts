import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SuperAdminPrincipalPageComponent} from './principal-page.component';

import {NgModule} from '@angular/core';

import {SuperAdministratorConstants} from '../super-administrator.constants';

import {SharedTestingTranslateModule} from '../../shared/test/modules/testing-traslate.module';

describe('Super admin PrincipalPageComponent', () => {
  let component: SuperAdminPrincipalPageComponent;
  let fixture: ComponentFixture<SuperAdminPrincipalPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuperAdminPrincipalPageTestModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminPrincipalPageComponent);
    component = fixture.componentInstance;
    component.principalMenuSuperAdministratorOptions =
      SuperAdministratorConstants.PRINCIPAL_MENU_SUPER_ADMINISTRATOR_OPTIONS.es;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain template in spanish', () => {
    component.principalMenuSuperAdministratorOptions =
      SuperAdministratorConstants.PRINCIPAL_MENU_SUPER_ADMINISTRATOR_OPTIONS.es;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').innerText.trim()).toEqual(
      SuperAdministratorConstants.PRINCIPAL_MENU_SUPER_ADMINISTRATOR_OPTIONS.es
        .title,
    );
  });

  it('should contain template in english', () => {
    component.principalMenuSuperAdministratorOptions =
      SuperAdministratorConstants.PRINCIPAL_MENU_SUPER_ADMINISTRATOR_OPTIONS.en;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').innerText.trim()).toEqual(
      SuperAdministratorConstants.PRINCIPAL_MENU_SUPER_ADMINISTRATOR_OPTIONS.en
        .title,
    );
  });
});

@NgModule({
  imports: [SharedTestingTranslateModule],
  exports: [SuperAdminPrincipalPageComponent],
  declarations: [SuperAdminPrincipalPageComponent],
  providers: [SuperAdministratorConstants],
})
class SuperAdminPrincipalPageTestModule {}
