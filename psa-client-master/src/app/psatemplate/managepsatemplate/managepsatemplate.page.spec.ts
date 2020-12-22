import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagepsatemplatePage } from './managepsatemplate.page';

describe('ManagepsatemplatePage', () => {
  let component: ManagepsatemplatePage;
  let fixture: ComponentFixture<ManagepsatemplatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagepsatemplatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagepsatemplatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
