import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { Company } from '../models/company';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private companyService: CompanyService, private router: Router, private alertCtrl: AlertController,private events: Events,) {
    this.events.publish('updateMenuSelected');
   }

  ngOnInit() {
  }

  async presentAlertConfirm(company: Company) {

    const alert = await this.alertCtrl.create({
      header: 'Unternehmen löschen',
      message: '<b>' + company.name + '</b> wirklich löschen?<br><br>Es werden dadurch die gesamten Daten dieses Unternehmens dauerhaft gelöscht und können nicht wiederhergestellt werden.<br><br>Trotzdem fortfahren?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Löschen',
          handler: () => {
            this.companyService.deleteEntity(company.company_ID).then(res => {
              this.router.navigate(['users/logout']);
            }).catch(res => {
            });
          }
        }
      ]
    });

    await alert.present();
  }

  deleteCompany() {
    this.companyService.getUserCompany().then(company => {
      this.presentAlertConfirm(company);
    });

  }
}
