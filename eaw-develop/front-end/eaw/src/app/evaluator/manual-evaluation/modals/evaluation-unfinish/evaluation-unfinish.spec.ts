import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EvaluationUnfinishComponent} from './evaluation-unfinish.component';

describe('EvaluationUnfinishComponent', () => {
  let component: EvaluationUnfinishComponent;
  let fixture: ComponentFixture<EvaluationUnfinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationUnfinishComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationUnfinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
