import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRolePage } from './show-role.page';

describe('ShowRolePage', () => {
  let component: ShowRolePage;
  let fixture: ComponentFixture<ShowRolePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowRolePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRolePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
