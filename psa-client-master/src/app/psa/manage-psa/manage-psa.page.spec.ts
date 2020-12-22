import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePsaPage } from './manage-psa.page';

describe('ManagePsaPage', () => {
  let component: ManagePsaPage;
  let fixture: ComponentFixture<ManagePsaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePsaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePsaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
