import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListsDevicesComponent} from './lists-devices.component';

describe('ListsDevicesComponent', () => {
  let component: ListsDevicesComponent;
  let fixture: ComponentFixture<ListsDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListsDevicesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListsDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
