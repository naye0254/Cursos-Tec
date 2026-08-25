import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NotResultComponent} from './not-result.component';

describe('NotResultComponent', () => {
  let component: NotResultComponent;
  let fixture: ComponentFixture<NotResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotResultComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
