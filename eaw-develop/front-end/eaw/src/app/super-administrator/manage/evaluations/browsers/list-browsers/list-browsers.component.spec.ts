import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListBrowsersComponent} from './list-browsers.component';

describe('ListBrowsersComponent', () => {
  let component: ListBrowsersComponent;
  let fixture: ComponentFixture<ListBrowsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListBrowsersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBrowsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
