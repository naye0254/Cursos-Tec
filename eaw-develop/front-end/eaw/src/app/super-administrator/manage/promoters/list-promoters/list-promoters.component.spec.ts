import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialModule} from '../../../../material.module';
import {ListPromotersComponent} from './list-promoters.component';

describe('ListPromotersComponent', () => {
  let component: ListPromotersComponent;
  let fixture: ComponentFixture<ListPromotersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListPromotersComponent],
      imports: [MaterialModule, NoopAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPromotersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
