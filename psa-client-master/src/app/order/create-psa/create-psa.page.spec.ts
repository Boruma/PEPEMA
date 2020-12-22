import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePsaPage } from './create-psa.page';

describe('CreatePsaPage', () => {
  let component: CreatePsaPage;
  let fixture: ComponentFixture<CreatePsaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePsaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePsaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
