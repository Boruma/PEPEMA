import { Component, OnInit } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { forkJoin } from 'rxjs';
import {Events} from '@ionic/angular';

@Component({
  selector: 'app-add-order-page',
  templateUrl: './add-order.page.html',
  styleUrls: ['./add-order.page.scss'],
})
export class AddOrderPage implements OnInit {

  constructor(private events: Events) { 
    this.events.publish('updateMenuSelected');
  }

  ngOnInit() {
  }

}
