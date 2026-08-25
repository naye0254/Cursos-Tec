import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListEvaluationsComponent} from './list-evaluations.component';
import {RouterTestingModule} from '@angular/router/testing';

import {LayoutModule} from '../../../layout/layout.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ListEvaluationsComponent', () => {
  let component: ListEvaluationsComponent;
  let fixture: ComponentFixture<ListEvaluationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListEvaluationsComponent],
      imports: [RouterTestingModule, LayoutModule, BrowserAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEvaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
