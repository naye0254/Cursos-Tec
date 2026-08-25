import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageWcagRulesComponent} from './manage-wcag-rules.component';

describe('ManageWcagRulesComponent', () => {
  let component: ManageWcagRulesComponent;
  let fixture: ComponentFixture<ManageWcagRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageWcagRulesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWcagRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
