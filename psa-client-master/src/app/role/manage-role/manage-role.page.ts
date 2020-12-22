import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee';
import { Role } from '../../models/role';
import { Events } from '@ionic/angular';

@Component({
    selector: 'app-manage-role',
    templateUrl: './manage-role.page.html',
    styleUrls: ['./manage-role.page.scss'],
})
export class ManageRolePage implements OnInit {

    // saves role choice
    private role: Role;
    show: boolean = false;

    // controls component view - 0=nothing, 1=show, 2=add, 3=edit
    private componentID: number;

    constructor(private events: Events) {
        this.role = null;
        this.componentID = 0;
        this.events.subscribe('showRole', (ppe) => {
            this.show = true;
        });
        this.events.subscribe('deleteRole', (ppe) => {
            this.show = false;
        });
        this.events.publish('updateMenuSelected');
    }

    public getRole() {
        return this.role;
    }

    public setRole(role) {
        this.role = role;
    }

    public getComponentID() {
        return this.componentID;
    }

    public setComponentID(id) {
        this.componentID = id;
    }

    public addRole() {
        this.events.publish('addRoleMobile');
    }

    ngOnInit() {
    }

}
