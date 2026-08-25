import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageBrowsersComponent} from './manage-browsers.component';

describe('ManageBrowsersComponent', () => {
  let component: ManageBrowsersComponent;
  let fixture: ComponentFixture<ManageBrowsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageBrowsersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBrowsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
