import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageRolePage} from './manage-role.page';

describe('ManageRolePage', () => {
    let component: ManageRolePage;
    let fixture: ComponentFixture<ManageRolePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ManageRolePage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageRolePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
