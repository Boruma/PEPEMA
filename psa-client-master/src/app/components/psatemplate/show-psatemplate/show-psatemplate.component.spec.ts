import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowPsatemplateComponent} from './show-psatemplate.component';

describe('ShowPsatemplateComponent', () => {
    let component: ShowPsatemplateComponent;
    let fixture: ComponentFixture<ShowPsatemplateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShowPsatemplateComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShowPsatemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
