import { Component, OnInit } from '@angular/core';
import { Events } from "@ionic/angular";

@Component({
  selector: 'app-add-psa-page',
  templateUrl: './add-psa.page.html',
  styleUrls: ['./add-psa.page.scss'],
})
export class AddPsaPage implements OnInit {

  constructor(private events: Events) {
    this.events.publish('updateMenuSelected');
  }

  ngOnInit() {
  }
  
  ionViewDidEnter() {
  }
}
