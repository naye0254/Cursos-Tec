import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModalAdvancedSearchComponent} from './modal-advanced-search.component';

describe('ModalAdvancedSearchComponent', () => {
  let component: ModalAdvancedSearchComponent;
  let fixture: ComponentFixture<ModalAdvancedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAdvancedSearchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
