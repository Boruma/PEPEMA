import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsatoemployeePage } from './psatoemployee.page';

describe('PsatoemployeePage', () => {
  let component: PsatoemployeePage;
  let fixture: ComponentFixture<PsatoemployeePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsatoemployeePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsatoemployeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
