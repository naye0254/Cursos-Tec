import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GraphEvaluationsComponent} from './graph-evaluations.component';

describe('GraphEvaluationsComponent', () => {
  let component: GraphEvaluationsComponent;
  let fixture: ComponentFixture<GraphEvaluationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GraphEvaluationsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
