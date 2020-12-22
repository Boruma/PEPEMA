import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitSignupPage } from './init-signup.page';

describe('InitSignupPage', () => {
  let component: InitSignupPage;
  let fixture: ComponentFixture<InitSignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitSignupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitSignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
