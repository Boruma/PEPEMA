import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-edit-employee-page',
  templateUrl: './edit-employee.page.html',
  styleUrls: ['./edit-employee.page.scss'],
})
export class EditEmployeePage implements OnInit {

  constructor(private events: Events) {
    this.events.publish('updateMenuSelected');
   }

  ngOnInit() {
  }

}
