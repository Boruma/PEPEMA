import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpsatemplatePage } from './addpsatemplate.page';

describe('AddpsatemplatePage', () => {
  let component: AddpsatemplatePage;
  let fixture: ComponentFixture<AddpsatemplatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpsatemplatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpsatemplatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
