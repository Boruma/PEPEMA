import { Component, OnInit } from '@angular/core';

import { Events } from '@ionic/angular';


@Component({
  selector: 'app-manage-allpsa',
  templateUrl: './manage-allpsa.page.html',
  styleUrls: ['./manage-allpsa.page.scss'],
})
export class ManageAllPsaPage implements OnInit {

  show: boolean = false;

  constructor(

    private events: Events,

  ) {
    this.events.subscribe('showPpe', (ppe) => {
      this.show = true;
    });

    this.events.subscribe('hidePpe', (ppe) => {
      this.show = false;
    });

    this.events.publish('updateMenuSelected');
  }

  public scanPsa() {
    this.events.publish('scanPsa');
  }

  ngOnInit() { }
}
