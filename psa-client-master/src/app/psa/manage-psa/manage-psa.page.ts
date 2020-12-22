import { Component, OnInit } from '@angular/core';

import { Events } from '@ionic/angular';


@Component({
  selector: 'app-manage-psa',
  templateUrl: './manage-psa.page.html',
  styleUrls: ['./manage-psa.page.scss'],
})
export class ManagePsaPage implements OnInit {

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

  public addPsa() {
    this.events.publish('addPsa');
  }

  public scanPsa() {
    this.events.publish('scanPsa');
  }

  ngOnInit() { }





}
