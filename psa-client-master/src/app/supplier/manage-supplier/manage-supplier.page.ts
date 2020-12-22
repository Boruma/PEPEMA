import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../models/supplier';
import { Events } from '@ionic/angular';

@Component({
    selector: 'app-manage-supplier',
    templateUrl: './manage-supplier.page.html',
    styleUrls: ['./manage-supplier.page.scss'],
})
export class ManageSupplierPage implements OnInit {

    // saves supplier choice
    private supplier: Supplier;
    show: boolean = false;


    // controls component view - 0=nothing, 1=show, 2=add, 3=edit
    private componentID: number;

    constructor(private events: Events) {
        this.supplier = null;
        this.componentID = 0;
        this.events.subscribe('showSupplier', (ppe) => {
            this.show = true;
        });

        this.events.publish('updateMenuSelected');
    }

    public getSupplier() {
        return this.supplier;
    }

    public setSupplier(supplier) {

        this.supplier = supplier;
    }

    public getComponentID() {
        return this.componentID;
    }

    public setComponentID(id) {
        this.componentID = id;
    }

    public addSupplier() {
        this.events.publish('addSupplier');
    }

    ngOnInit() {
    }

}
