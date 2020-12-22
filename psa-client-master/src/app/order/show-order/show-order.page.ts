import { Component, OnInit } from '@angular/core';
import {Events} from '@ionic/angular';

@Component({
  selector: 'app-show-order-page',
  templateUrl: './show-order.page.html',
  styleUrls: ['./show-order.page.scss'],
})
export class ShowOrderPage implements OnInit {

  constructor(private events: Events) { 
    this.events.publish('updateMenuSelected');
  }

  ngOnInit() {
  }

}
