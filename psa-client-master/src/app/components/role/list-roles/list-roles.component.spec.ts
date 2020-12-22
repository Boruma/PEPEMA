import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListRolesComponent} from './list-roles.component';

describe('ListRolesComponent', () => {
    let component: ListRolesComponent;
    let fixture: ComponentFixture<ListRolesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListRolesComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListRolesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
