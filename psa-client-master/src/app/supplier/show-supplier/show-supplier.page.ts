import { Component, OnInit } from '@angular/core';
import {SupplierService} from '../../services/supplier.service';
import {Events} from '@ionic/angular';

@Component({
  selector: 'app-show-supplier-page',
  templateUrl: './show-supplier.page.html',
  styleUrls: ['./show-supplier.page.scss'],
})
export class ShowSupplierPage implements OnInit {

  constructor(private supplierService: SupplierService, private events: Events) {
    this.events.publish('updateMenuSelected');
   }

  ngOnInit() {
  }

  public updateSupplier() {
    this.supplierService.updateSupplierMobile();
  }

  public deleteSupplier() {
    this.supplierService.removeSupplierMobile();
  }

}
