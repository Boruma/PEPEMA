import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
    selector: 'app-manage-employee-app-view',
    templateUrl: './manage-employee-app-view.page.html',
    styleUrls: ['./manage-employee-app-view.page.scss'],
})
export class ManageEmployeeAppViewPage implements OnInit {

    public show: boolean = false;

    constructor(private events: Events) {

        this.events.subscribe('showEmployee', (employee) => {
            this.show = true;
        });

        this.events.subscribe('deleteEmployee', (employee) => {
            this.show = false;
        });

        this.events.publish('updateMenuSelected');

    }

    public addEmployee() {
        this.events.publish('addEmployee');
    }

    ngOnInit() {
    }

}
