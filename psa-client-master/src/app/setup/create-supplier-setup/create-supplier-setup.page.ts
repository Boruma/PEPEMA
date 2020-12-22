import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../models/supplier';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-create-supplier-setup',
  templateUrl: './create-supplier-setup.page.html',
  styleUrls: ['./create-supplier-setup.page.scss'],
})
export class CreateSupplierSetupPage implements OnInit {

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
    })
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
