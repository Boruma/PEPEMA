import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPsaPage } from './edit-psa.page';

describe('EditPsaPage', () => {
  let component: EditPsaPage;
  let fixture: ComponentFixture<EditPsaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPsaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPsaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
