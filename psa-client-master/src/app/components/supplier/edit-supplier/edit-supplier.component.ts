import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier } from '../../../models/supplier';
import { AlertController, Events, LoadingController } from '@ionic/angular';
import { ErrorhandlingService } from '../../../services/errorhandling.service';
import { SupplierService } from '../../../services/supplier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.scss'],
})
export class EditSupplierComponent implements OnInit {
  createForm: FormGroup;

  supplier: Supplier = {} as Supplier;
  id: number;

  constructor(public formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private errorService: ErrorhandlingService,
    private loadingController: LoadingController,
    private events: Events,
    private alertCtrl: AlertController,
    private router: Router) {

    if (this.router.getCurrentNavigation() != null && this.router.getCurrentNavigation().extras.state != null) {
      this.supplier = this.router.getCurrentNavigation().extras.state.supplier;
    } else {
      this.router.navigate(['users/supplier']);
    }
    this.createForm = this.formBuilder.group({
      id: ['',],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.email, Validators.minLength(5), Validators.maxLength(40),
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      street: ['', [Validators.minLength(2), Validators.maxLength(20)]],
      housenumber: ['', [Validators.minLength(1), Validators.maxLength(10)]],
      postcode: ['', [Validators.minLength(2), Validators.maxLength(10)]],
      place: ['', [Validators.minLength(2), Validators.maxLength(30)]],
      address_additional: ['', [Validators.minLength(2), Validators.maxLength(30)]]
    });

    this.events.subscribe('editSupplier', (supplier) => {
      this.supplier = supplier;
    });
  }


  // Error Messages
  validation_messages = {
    name: [
      { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
      { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Name darf maximal aus 50 Zeichen bestehen.' }
    ],
    email: [
      { type: 'required', message: 'Bitte eine gültige Email eintragen.' },
      { type: 'email', message: 'Die Email Adresse muss gültig sein.' },
      { type: 'pattern', message: 'Die Email Adresse muss folgendes Format haben: xxxx@xx.xx' },
      { type: 'maxlength', message: 'Die Email darf maximal aus 40 Zeichen bestehen.' }
    ],
    street: [
      { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Name darf maximal aus 20 Zeichen bestehen.' }
    ],
    housenumber: [
      { type: 'minlength', message: 'Der Name muss mindesten aus 1 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Name darf maximal aus 10 Zeichen bestehen.' }
    ],
    postcode: [
      { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Name darf maximal aus 10 Zeichen bestehen.' }
    ],
    place: [
      { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Name darf maximal aus 30 Zeichen bestehen.' }
    ],
    address_additional: [
      { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Name darf maximal aus 30 Zeichen bestehen.' }
    ]

  };

  ngOnInit() {
  }

  //alert for changing supplier
  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Lieferant ändern',
      message: this.supplier.name + ' wirklich ändern?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Ändern',
          handler: () => {
            this.editSupplier();
          }
        }
      ]
    });
    await alert.present();
    const result = await alert.onDidDismiss();
  }

  // edits the values of a supplier
  editSupplier() {

    let loading: HTMLIonLoadingElement;
    this.loadingController.create({

    }).then(res => {
      loading = res;
      loading.present();
      this.supplierService.editSupplier(this.supplier).then(supplier => {
        loading.dismiss();

        this.events.publish('reloadSuppliers');
        this.router.navigate(['users/supplier']);
      })
        .catch(error => {
          // Errorhandling
          this.errorService.error(error);
          loading.dismiss();
        });
    });
  }

  private showSupplier() {
    this.events.publish('showSupplier', (this.supplier));

  }

  // gets the information for a supplier
  getSupplier($id) {
    let loading: HTMLIonLoadingElement;
    this.loadingController.create({

    }).then(res => {
      loading = res;
      loading.present();
      this.supplierService.getSupplier($id).then(supplier => {

        loading.dismiss();
      })
        .catch(error => {
          // Errorhandling
          this.errorService.error(error);
          loading.dismiss();
        });
    });
  }

}
