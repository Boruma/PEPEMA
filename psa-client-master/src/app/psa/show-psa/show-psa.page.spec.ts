import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPsaPage } from './show-psa.page';

describe('ShowPsaPage', () => {
  let component: ShowPsaPage;
  let fixture: ComponentFixture<ShowPsaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPsaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPsaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
