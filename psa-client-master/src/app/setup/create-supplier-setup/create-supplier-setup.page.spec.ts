import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSupplierSetupPage } from './create-supplier-setup.page';

describe('CreateSupplierSetupPage', () => {
  let component: CreateSupplierSetupPage;
  let fixture: ComponentFixture<CreateSupplierSetupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSupplierSetupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSupplierSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
