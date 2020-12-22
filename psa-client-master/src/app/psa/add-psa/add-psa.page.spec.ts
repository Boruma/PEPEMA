import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPsaPage } from './add-psa.page';

describe('AddPsaPage', () => {
  let component: AddPsaPage;
  let fixture: ComponentFixture<AddPsaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPsaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPsaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
