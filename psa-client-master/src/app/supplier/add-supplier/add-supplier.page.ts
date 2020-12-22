import { Component, OnInit } from '@angular/core';
import {Events} from '@ionic/angular';

@Component({
  selector: 'app-add-supplier-page',
  templateUrl: './add-supplier.page.html',
  styleUrls: ['./add-supplier.page.scss'],
})
export class AddSupplierPage implements OnInit {

  constructor(private events: Events) { 
    this.events.publish('updateMenuSelected');
  }

  ngOnInit() {
  }

}
