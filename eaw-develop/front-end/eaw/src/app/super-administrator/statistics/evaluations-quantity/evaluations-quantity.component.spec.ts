import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsQuantityComponent } from './evaluations-quantity.component';

describe('EvaluationsQuantityComponent', () => {
  let component: EvaluationsQuantityComponent;
  let fixture: ComponentFixture<EvaluationsQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationsQuantityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
