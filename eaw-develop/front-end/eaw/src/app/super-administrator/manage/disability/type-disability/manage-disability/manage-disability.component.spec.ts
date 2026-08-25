import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageDisabilityComponent} from './manage-disability.component';

describe('ManageDisabilityComponent', () => {
  let component: ManageDisabilityComponent;
  let fixture: ComponentFixture<ManageDisabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageDisabilityComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDisabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
