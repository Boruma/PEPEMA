import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../../models/supplier';
import { AlertController, Events } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { SupplierService } from '../../../services/supplier.service';
import { LoadingController } from '@ionic/angular';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';

@Component({
    selector: 'app-show-supplier',
    templateUrl: './show-supplier.component.html',
    styleUrls: ['./show-supplier.component.scss'],
})
export class ShowSupplierComponent implements OnInit {

    supplier: Supplier;
    private url: String;


    constructor(private events: Events,
        private alertCtrl: AlertController,
        private router: Router,
        private supplierService: SupplierService,
        private loadingController: LoadingController,
        private errorService: ErrorhandlingService) {
        // sets  initial supplier choice
        //this.supplier = this.manageSupplier.getSupplier(); // Muss drin bleiben, damit erste Auswahl gesetzt wird

        if (this.router.getCurrentNavigation().extras.state != null) {
            this.supplier = this.router.getCurrentNavigation().extras.state.supplier;
            this.url = this.router.getCurrentNavigation().extras.state.url;
        }

        // shows different supplier
        this.events.subscribe('showSupplier', (newSupplier) => {
            this.supplier = newSupplier;
        });

        this.supplierService._updateSupplierMobile.subscribe(() => {
            this.editSupplier(this.supplier);
        });


        this.supplierService._removeSupplierMobile.subscribe(() => {
            this.presentAlertConfirm(this.supplier);
        });
    }

    ngOnInit() {
    }

    public editSupplier(supplier) {
        let navigationExtras: NavigationExtras = {
            state: {
                supplier: supplier
            }
        };
        this.router.navigate(['users/supplier/edit'], navigationExtras);
    }

    async normalDeleteAlert(supplier) {
        const alert = await this.alertCtrl.create({
            header: 'Liefersnt löschen',
            message: supplier.name + ' wirklich löschen?',
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
                        this.deleteSupplier(supplier);
                    }
                }
            ]
        });

        await alert.present();
        const result = await alert.onDidDismiss();
    }

    async PeAttachedDeleteAlert(supplier) {
        const alert = await this.alertCtrl.create({
            header: 'Lieferant löschen',
            message: 'Dieser Lieferant ist noch für mindestens eine PSA Schablone eingetragen.<br> Beim Löschen dieses Lieferanten werden die PSA Schablonen ebenfalls gelöscht.<br> <strong>' + supplier.name + '</strong> wirklich löschen?',
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
                        this.deleteSupplier(supplier);
                    }
                }
            ]
        });

        await alert.present();
        const result = await alert.onDidDismiss();
    }

    async presentAlertConfirm(supplier) {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
        }).then(res => {
            loading = res;
            loading.present();
            this.supplierService.getAllPEBySupplier(supplier.supplier_ID).then(list => {
                if (list.length === 0) {
                    this.normalDeleteAlert(supplier);
                } else {
                    this.PeAttachedDeleteAlert(supplier);
                }
            });
            loading.dismiss();
        });
    }

    public deleteSupplier(supplier) {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
        }).then(res => {
            loading = res;
            loading.present();
            this.supplierService.deleteSupplier(supplier.supplier_ID).then(res => {
                this.events.publish('reloadSuppliers');
                this.router.navigate(['users/supplier']);
            }).catch(error => {

                this.errorService.error(error);
            });
            loading.dismiss();
        });
    }
}
