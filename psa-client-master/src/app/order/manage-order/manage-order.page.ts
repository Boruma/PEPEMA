import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.page.html',
  styleUrls: ['./manage-order.page.scss'],
})
export class ManageOrderPage implements OnInit {

  public show: boolean = false;

  constructor(private events: Events) {
    this.events.subscribe('showOrder', (order) => {
      this.show = true;
    });

    this.events.subscribe('deleteOrder', () => {
      this.show = false;
    });

    this.events.publish('updateMenuSelected');
  }

  public addOrder(){
    this.events.publish('addOrder');
  }

  ngOnInit() {
  }
}
