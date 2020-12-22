import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSetupPage } from './select-setup.page';

describe('SelectSetupPage', () => {
  let component: SelectSetupPage;
  let fixture: ComponentFixture<SelectSetupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectSetupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
