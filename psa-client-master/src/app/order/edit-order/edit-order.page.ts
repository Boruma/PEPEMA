import { Component, OnInit } from '@angular/core';
import {Events} from '@ionic/angular';

@Component({
  selector: 'app-edit-order-page',
  templateUrl: './edit-order.page.html',
  styleUrls: ['./edit-order.page.scss'],
})
export class EditOrderPage implements OnInit {

  constructor(private events: Events) {
    this.events.publish('updateMenuSelected');
   }

  ngOnInit() {
  }

}
