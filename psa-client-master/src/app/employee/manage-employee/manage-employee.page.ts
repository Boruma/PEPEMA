import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee';
import { Events } from '@ionic/angular';

@Component({
    selector: 'app-manage-employee',
    templateUrl: './manage-employee.page.html',
    styleUrls: ['./manage-employee.page.scss'],
})
export class ManageEmployeePage implements OnInit {

    // saves employee choice
    private employee: Employee;
    // controls component view - 0=nothing, 1=show, 2=add, 3=edit
    private componentID: number;

    constructor(private events: Events) {
        this.employee = null;
        this.componentID = 0;

        this.events.publish('updateMenuSelected');
    }

    public getEmployee() {
        return this.employee;
    }

    public setEmployee(employee) {
        this.employee = employee;
    }

    public getComponentID() {
        return this.componentID;
    }

    public setComponentID(id) {
        this.componentID = id;
    }

    ngOnInit() {
    }

}
