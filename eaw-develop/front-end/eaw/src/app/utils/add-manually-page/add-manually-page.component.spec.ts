import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddManuallyPageComponent} from './add-manually-page.component';

describe('AddManuallyPageComponent', () => {
  let component: AddManuallyPageComponent;
  let fixture: ComponentFixture<AddManuallyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddManuallyPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddManuallyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
