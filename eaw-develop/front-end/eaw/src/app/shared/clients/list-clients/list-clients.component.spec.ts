import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListClientsComponent} from './list-clients.component';
import {RouterTestingModule} from '@angular/router/testing';

import {LayoutModule} from '../../../layout/layout.module';
import {MaterialModule} from '../../../material/material-module';
import {SuperAdministratorConstants} from '../../super-administrator.constants';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ListClientsComponent', () => {
  let component: ListClientsComponent;
  let fixture: ComponentFixture<ListClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListClientsComponent],
      imports: [
        RouterTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
        LayoutModule,
      ],
      providers: [SuperAdministratorConstants],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
import {from} from 'rxjs';
