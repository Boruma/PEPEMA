import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ProviderService } from '../services/provider.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title = '';
  @Input() showHeader = true;
  @Input() showBackButton = false;
  @Input() savedMessage = true;

  public saved: boolean = false;

  constructor(private location: Location, private router: Router, private alertCtrl: AlertController, private provider: ProviderService) {
    this.savedMessage;
  }

  ngOnInit() {
  }

  async navigate_back() {
    if (this.savedMessage) {
      const alert = await this.alertCtrl.create({
        header: 'Nicht gespeichert',
        message: 'Deine Änderungen wurden nicht gespeichert.<br>Diese Seite trotzdem verlassen?',
        buttons: [
          {
            text: 'Abbrechen',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {

            }
          }, {
            text: 'Verlassen',
            handler: () => {
              for (let i = 0; i < this.provider.goBackBy; i++) {
                this.location.back();
              }
            }
          }
        ]
      });

      await alert.present();
      let result = await alert.onDidDismiss();
    }
    else {
      for (let i = 0; i < this.provider.goBackBy; i++) {
        this.location.back();
      }
    }
    this.provider.goBackBy = 1;
  }

}
