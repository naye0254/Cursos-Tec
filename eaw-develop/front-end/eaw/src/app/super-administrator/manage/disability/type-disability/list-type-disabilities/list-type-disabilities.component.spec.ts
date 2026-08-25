import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListTypeDisabilitysComponent} from './list-type-disabilities.component';

describe('ListTypeDisabilitysComponent', () => {
  let component: ListTypeDisabilitysComponent;
  let fixture: ComponentFixture<ListTypeDisabilitysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListTypeDisabilitysComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTypeDisabilitysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
