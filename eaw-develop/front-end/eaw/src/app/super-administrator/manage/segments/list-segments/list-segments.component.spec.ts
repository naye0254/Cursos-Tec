import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSegmentsComponent} from './list-segments.component';

describe('ListSegmentsComponent', () => {
  let component: ListSegmentsComponent;
  let fixture: ComponentFixture<ListSegmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListSegmentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSegmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
