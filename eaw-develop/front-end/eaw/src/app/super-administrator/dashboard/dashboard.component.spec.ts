import {async, ComponentFixture, TestBed, inject} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Location, CommonModule} from '@angular/common';

import {DashboardComponent} from './dashboard.component';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';

import {LayoutModule} from '../../layout/layout.module';
import {SuperAdministratorConstants} from '../super-administrator.constants';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'statistics',
            loadChildren: () =>
              import('../statistics/statistics.module').then(c => c.StatisticsModule)
          },
          {
            path: 'manage',
            loadChildren: () => 
            import('../manage/manage.module').then(m => m.ManageModule),
          },
          {
            path: 'clients',
            loadChildren: () => 
            import('../clients/clients.module').then(m => m.ClientsModule),
          },
        ]),
        LayoutModule,
        BrowserAnimationsModule,
      ],
      providers: [SuperAdministratorConstants],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to /clients', async(
    inject([Router, Location], (router: Router, location: Location) => {
      fixture.detectChanges();

      const f = fixture.debugElement.queryAll(By.css('a'));
      f.forEach(element => {
        if (element.nativeElement.textContent === 'Clientes') {
          element.nativeElement.click();
        }
      });

      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/clients/list-clients');
      });
    })
  ));

  it('should go to /clients', async(
    inject([Router, Location], (router: Router, location: Location) => {
      fixture.detectChanges();

      const f = fixture.debugElement.queryAll(By.css('a'));
      f.forEach(element => {
        if (element.nativeElement.textContent === 'Gestión') {
          element.nativeElement.click();
        }
      });

      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/manage');
      });
    })
  ));
});
