import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NotResultFilterComponent} from './not-result-filter.component';

describe('NotResultFilterComponent', () => {
  let component: NotResultFilterComponent;
  let fixture: ComponentFixture<NotResultFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotResultFilterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotResultFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
