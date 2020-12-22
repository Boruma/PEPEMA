import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowRoleComponent} from './show-role.component';

describe('ShowRoleComponent', () => {
    let component: ShowRoleComponent;
    let fixture: ComponentFixture<ShowRoleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShowRoleComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShowRoleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
