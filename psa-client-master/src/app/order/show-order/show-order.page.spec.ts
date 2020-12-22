import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOrderPage } from './show-order.page';

describe('ShowOrderPage', () => {
  let component: ShowOrderPage;
  let fixture: ComponentFixture<ShowOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowOrderPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
