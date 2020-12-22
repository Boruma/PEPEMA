import { Component, OnInit } from '@angular/core';
import {Events} from '@ionic/angular';

@Component({
  selector: 'app-add-role-page',
  templateUrl: './add-role.page.html',
  styleUrls: ['./add-role.page.scss'],
})
export class AddRolePage implements OnInit {

  constructor(private events: Events) {
    this.events.publish('updateMenuSelected');
   }

  ngOnInit() {
  }

}
