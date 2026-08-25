import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageSegmentComponent} from './manage-segment.component';

describe('ManageSegmentComponent', () => {
  let component: ManageSegmentComponent;
  let fixture: ComponentFixture<ManageSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageSegmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
