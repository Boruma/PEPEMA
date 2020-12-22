import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderPage } from './add-order.page';

describe('AddOrderPage', () => {
  let component: AddOrderPage;
  let fixture: ComponentFixture<AddOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
