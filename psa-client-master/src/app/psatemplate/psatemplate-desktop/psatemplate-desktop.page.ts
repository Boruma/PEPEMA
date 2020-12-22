import { Component, OnInit } from '@angular/core';
import {Events} from '@ionic/angular';
@Component({
  selector: 'app-psatemplate-desktop',
  templateUrl: './psatemplate-desktop.page.html',
  styleUrls: ['./psatemplate-desktop.page.scss'],
})
export class PsatemplateDesktopPage implements OnInit {

  constructor(private events: Events) { 
    this.events.publish('updateMenuSelected');
  }

  ngOnInit() {
  }

}
