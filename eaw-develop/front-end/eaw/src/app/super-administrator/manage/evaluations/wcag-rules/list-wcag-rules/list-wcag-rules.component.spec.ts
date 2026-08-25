import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListWcagRulesComponent} from './list-wcag-rules.component';

describe('ListWcagRulesComponent', () => {
  let component: ListWcagRulesComponent;
  let fixture: ComponentFixture<ListWcagRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListWcagRulesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWcagRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
