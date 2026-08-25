import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrincipalPageComponent} from './principal-page.component';

import {RouterTestingModule} from '@angular/router/testing';

import {SharedService} from '../../shared/shared.service';
import {HttpClientModule} from '@angular/common/http';
import {NgModule, Component, ViewChild} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {APP_CONFIG, AppConfig} from '../../../app.config';
import {BrowserModule} from '@angular/platform-browser';

describe('PrincipalPageComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let optionsForOneButton: any;
  let optionsForTwoButtons: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, BrowserModule, PrincipalPageTestModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    optionsForOneButton = {
      title: '¡Bienvenido (a)!',
      menu: [
        {
          imageUrl: './assets/img/principal-page/clientes.png',
          imageAlt: 'Ícono de clientes',
          title: 'Clientes',
          firstButtonLabel: 'Ver Clientes',
          firstButtonRedirectTo: 'clients/list-clients',
          secondButtonLabel: null,
          secondButtonRedirectTo: null,
        },
      ],
    };
    optionsForTwoButtons = {
      title: '¡Bienvenido (a)!',
      menu: [
        {
          imageUrl: './assets/img/principal-page/clientes.png',
          imageAlt: 'Ícono de clientes',
          title: 'Clientes',
          firstButtonLabel: 'Ver Clientes',
          firstButtonRedirectTo: 'clients/list-clients',
          secondButtonLabel: 'Ver Clientes',
          secondButtonRedirectTo: 'clients/list-clients',
        },
      ],
    };
  });

  it('should create principal page ', () => {
    component.appPrincipalPag.principalMenuOptions = optionsForOneButton;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Principal Page render information', () => {
    it('Should render the title', () => {
      component.appPrincipalPag.principalMenuOptions = optionsForOneButton;
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('h1').innerText.trim(),
      ).toEqual(optionsForOneButton.title);
    });

    it('Should render one item of the list when have only one button', () => {
      component.appPrincipalPag.principalMenuOptions = optionsForOneButton;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('img').src).toContain(
        optionsForOneButton.menu[0].imageUrl.slice(
          1,
          optionsForOneButton.menu[0].imageUrl.length,
        ),
      );
      expect(fixture.nativeElement.querySelector('img').alt).toEqual(
        optionsForOneButton.menu[0].imageAlt,
      );
      expect(
        fixture.nativeElement.querySelector('h2').innerText.trim(),
      ).toEqual(optionsForOneButton.menu[0].title);
      expect(
        fixture.nativeElement.querySelector('#firstButton').innerText.trim(),
      ).toEqual(optionsForOneButton.menu[0].firstButtonLabel);

      expect(fixture.nativeElement.querySelector('#secondButton')).toEqual(
        null,
      );
    });

    it('Should render one item of the list when have two buttons', () => {
      component.appPrincipalPag.principalMenuOptions = optionsForTwoButtons;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('img').src).toContain(
        optionsForTwoButtons.menu[0].imageUrl.slice(
          1,
          optionsForTwoButtons.menu[0].imageUrl.length,
        ),
      );
      expect(fixture.nativeElement.querySelector('img').alt).toEqual(
        optionsForTwoButtons.menu[0].imageAlt,
      );
      expect(
        fixture.nativeElement.querySelector('h2').innerText.trim(),
      ).toEqual(optionsForTwoButtons.menu[0].title);
      expect(
        fixture.nativeElement.querySelector('#firstButton').innerText.trim(),
      ).toEqual(optionsForTwoButtons.menu[0].firstButtonLabel);

      expect(
        fixture.nativeElement.querySelector('#secondButton').innerText.trim(),
      ).toEqual(optionsForTwoButtons.menu[0].secondButtonLabel);
    });
  });

  describe('Should redirect to path', () => {
    it('Redirect to path when  when have only one button ', () => {
      component.appPrincipalPag.principalMenuOptions = optionsForOneButton;
      fixture.detectChanges();
      spyOn(component.appPrincipalPag, 'redirectTo');
      const button = fixture.debugElement.nativeElement.querySelector(
        '#firstButton',
      );

      button.click();
      expect(component.appPrincipalPag.redirectTo).toHaveBeenCalledTimes(1);
      expect(component.appPrincipalPag.redirectTo).toHaveBeenCalledWith(
        optionsForOneButton.menu[0].firstButtonRedirectTo,
      );
    });

    it('Redirect to path when  when have two buttons ', () => {
      component.appPrincipalPag.principalMenuOptions = optionsForTwoButtons;
      fixture.detectChanges();
      spyOn(component.appPrincipalPag, 'redirectTo');
      const button = fixture.debugElement.nativeElement.querySelector(
        '#secondButton',
      );

      button.click();
      expect(component.appPrincipalPag.redirectTo).toHaveBeenCalledTimes(1);
      expect(component.appPrincipalPag.redirectTo).toHaveBeenCalledWith(
        optionsForTwoButtons.menu[0].secondButtonRedirectTo,
      );
    });
  });
});

@Component({
  selector: `app-host-component`,
  template: `
    <app-principal-page></app-principal-page>
  `,
})
class TestHostComponent {
  @ViewChild(PrincipalPageComponent, {static: true})
  public appPrincipalPag: PrincipalPageComponent;
}

@NgModule({
  imports: [NoopAnimationsModule, HttpClientModule],
  exports: [PrincipalPageComponent, TestHostComponent],
  declarations: [PrincipalPageComponent, TestHostComponent],
  providers: [
    {
      provide: APP_CONFIG,
      useValue: AppConfig,
    },
    SharedService,
  ],
})
class PrincipalPageTestModule {}
