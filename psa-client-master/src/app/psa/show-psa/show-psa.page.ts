import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
@Component({
  selector: 'app-show-psa-page',
  templateUrl: './show-psa.page.html',
  styleUrls: ['./show-psa.page.scss'],
})
export class ShowPsaPage implements OnInit {

  constructor(private events: Events,) { }

  ngOnInit() {
    this.events.publish('updateMenuSelected');
  }

  public updatePsa(){
    this.events.publish('updatePsaMobile');
  }

  public deletePsa(){
    this.events.publish('deletePsaMobile');
  }

}
