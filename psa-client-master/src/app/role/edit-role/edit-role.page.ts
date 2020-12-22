import { Component, OnInit } from '@angular/core';
import {Events} from '@ionic/angular';

@Component({
  selector: 'app-edit-role-page',
  templateUrl: './edit-role.page.html',
  styleUrls: ['./edit-role.page.scss'],
})
export class EditRolePage implements OnInit {

  constructor(private events: Events) {
    this.events.publish('updateMenuSelected');
   }

  ngOnInit() {
  }

}
