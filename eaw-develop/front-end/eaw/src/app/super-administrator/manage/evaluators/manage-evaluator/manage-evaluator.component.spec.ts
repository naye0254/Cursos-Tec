import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageEvaluatorComponent} from './manage-evaluator.component';

describe('ManageEvaluatorComponent', () => {
  let component: ManageEvaluatorComponent;
  let fixture: ComponentFixture<ManageEvaluatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageEvaluatorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEvaluatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
