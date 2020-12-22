import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-add-employee-page',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {

  constructor(private events: Events) {
    this.events.publish('updateMenuSelected');
  }

  ngOnInit() {
  }

}
