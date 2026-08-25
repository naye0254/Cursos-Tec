import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagePackageComponent} from './manage-package.component';

describe('ManagePackageComponent', () => {
  let component: ManagePackageComponent;
  let fixture: ComponentFixture<ManagePackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePackageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
