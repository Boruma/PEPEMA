import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddRoleComponent} from './add-role.component';

describe('AddRoleComponent', () => {
    let component: AddRoleComponent;
    let fixture: ComponentFixture<AddRoleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddRoleComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddRoleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
