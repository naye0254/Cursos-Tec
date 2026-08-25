import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManualEvaluationComponent} from './manual-evaluation.component';

describe('ManualEvaluationComponent', () => {
  let component: ManualEvaluationComponent;
  let fixture: ComponentFixture<ManualEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManualEvaluationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
