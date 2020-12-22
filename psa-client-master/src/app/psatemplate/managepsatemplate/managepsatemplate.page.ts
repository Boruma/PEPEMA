import { Component, OnInit } from '@angular/core';

import { Events } from '@ionic/angular';


@Component({
  selector: 'app-managepsatemplate',
  templateUrl: './managepsatemplate.page.html',
  styleUrls: ['./managepsatemplate.page.scss'],
})
export class ManagepsatemplatePage implements OnInit {
  show: boolean = false;

  constructor(
    private events: Events,
  ) {
    this.events.subscribe('showPsa', (ppe) => {
      this.show = true;
    });
    this.events.publish('updateMenuSelected');
  }

  ngOnInit() {

  }

  public addTemplate(){
    this.events.publish('addTemplate');
  }


}
