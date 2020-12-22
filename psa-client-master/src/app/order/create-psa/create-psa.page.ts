import { Component, OnInit } from '@angular/core';
import {Events} from '@ionic/angular';

@Component({
  selector: 'app-create-psa-page',
  templateUrl: './create-psa.page.html',
  styleUrls: ['./create-psa.page.scss'],
})
export class CreatePsaPage implements OnInit {

  constructor(private events: Events) {
    this.events.publish('updateMenuSelected');
   }

  ngOnInit() {
  }

}
