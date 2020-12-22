import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsatemplateDesktopPage } from './psatemplate-desktop.page';

describe('PsatemplateDesktopPage', () => {
  let component: PsatemplateDesktopPage;
  let fixture: ComponentFixture<PsatemplateDesktopPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsatemplateDesktopPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsatemplateDesktopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
