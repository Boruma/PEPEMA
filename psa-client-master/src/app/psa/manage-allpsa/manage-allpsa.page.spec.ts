import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAllPsaPage } from './manage-allpsa.page';

describe('ManagePsaPage', () => {
  let component: ManageAllPsaPage;
  let fixture: ComponentFixture<ManageAllPsaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAllPsaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAllPsaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
