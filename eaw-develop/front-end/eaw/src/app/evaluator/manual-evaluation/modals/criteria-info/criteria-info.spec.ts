import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CriteriaInfoComponent} from './criteria-info.component';

describe('CriteriaInfoComponent', () => {
  let component: CriteriaInfoComponent;
  let fixture: ComponentFixture<CriteriaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriaInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
