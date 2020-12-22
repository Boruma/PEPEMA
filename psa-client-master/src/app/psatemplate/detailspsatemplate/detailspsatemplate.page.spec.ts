import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailspsatemplatePage } from './detailspsatemplate.page';

describe('DetailspsatemplatePage', () => {
  let component: DetailspsatemplatePage;
  let fixture: ComponentFixture<DetailspsatemplatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailspsatemplatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailspsatemplatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
