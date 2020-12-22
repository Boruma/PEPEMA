import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../../models/supplier';
import { AlertController, Events, LoadingController } from '@ionic/angular';
import { ErrorhandlingService } from '../../../services/errorhandling.service';
import { FormBuilder } from '@angular/forms';
import { SupplierService } from '../../../services/supplier.service';
import { ManageSupplierPage } from '../../../supplier/manage-supplier/manage-supplier.page';
import { Router, NavigationExtras } from '@angular/router';

@Component({
    selector: 'app-list-supplier',
    templateUrl: './list-supplier.component.html',
    styleUrls: ['./list-supplier.component.scss'],
})

export class ListSupplierComponent implements OnInit {

    // list of all suppliers
    suppliers: Supplier[];

    private suppliersForSearch :Supplier[];
    // index of current supplier
    public listIndex: number;
    public setup: boolean = false;

    constructor(public formBuilder: FormBuilder,
        private alertCtrl: AlertController,
        private supplierService: SupplierService,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private manageSupplier: ManageSupplierPage,
        private events: Events,
        private router: Router) {


        this.events.subscribe('reloadSuppliers', () => {
            this.getAllSuppliers();
        });

        this.events.subscribe('addSupplier', () => {
          
            this.addSupplier();
        });

        if (this.router.getCurrentNavigation().extras.state != null && this.router.getCurrentNavigation().extras.state.setup != null) {
            this.setup = this.router.getCurrentNavigation().extras.state.setup;
        }
    }

    ngOnInit() {
        this.getAllSuppliers();
    }
    onSearchTerm(ev: CustomEvent) {
        this.suppliers = this.suppliersForSearch;

        const val = ev.detail.value;
        if (val.trim() !== '') {
            this.suppliers = this.suppliers.filter(term => {
                return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
        }
    }

    public finishSetup(){
        this.router.navigate(['users/setup/supplier']);
    }

    public editSupplier(supplier) {
        let navigationExtras: NavigationExtras = {
            state: {
                supplier: supplier
            }
        };
        this.router.navigate([this.router.url + '/edit'], navigationExtras);
    }

    //alert for deleting a supplier
    async normalDeleteAlert(supplier) {
        const alert = await this.alertCtrl.create({
            header: 'Lieferanten löschen',
            message: '<strong>' + supplier.name + '</strong> wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {

                    }
                }, {
                    text: 'Okay',
                    handler: () => {
                        this.deleteSupplier(supplier);
                    }
                }
            ]
        });

        await alert.present();
        const result = await alert.onDidDismiss();
    }

    //alert for deleting a supplier
    async PeAttachedDeleteAlert(supplier) {
        const alert = await this.alertCtrl.create({
            header: 'Löschen',
            message: 'Dieser Lieferant ist noch für mindestens eine PSA Schablone eingetragen.<br> Beim löschen dieses Lieferanten werden die PSA Schablonen ebenfalls gelöscht.<br> <strong>' + supplier.name + '</strong> wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {

                    }
                }, {
                    text: 'Okay',
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
                if (list['pes'].length === 0) {
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

    // returns array index of supplier
    private getIndex(supplier: Supplier) {
        for (const index in this.suppliers) {
            if (this.suppliers[index].supplier_ID === supplier.supplier_ID) {
                return this.suppliers.indexOf(this.suppliers[index]);
            }
        }
        return -1;
    }

    // reads in all supplier and saves them to array
    async getAllSuppliers() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
        }).then(res => {
            loading = res;
            loading.present();
            this.supplierService.getSuppliers().then(result => {
                loading.dismiss();
                this.suppliers = result;
                this.suppliersForSearch = result;
                const tmpSupplier: Supplier = this.manageSupplier.getSupplier();
                if (tmpSupplier == null) {
                    this.listIndex = -1;
                } else {
                    this.listIndex = this.getIndex(tmpSupplier);
                }
            })
                .catch(error => {
                    loading.dismiss();
                    this.errorService.error(error);
                });
        });
    }

    // sets the component
    public showSupplier(supplier) {
        let navigationExtras: NavigationExtras = {
            state: {
                supplier: supplier,
                url: this.router.url
            }
        };
        this.router.navigate([this.router.url + '/show'], navigationExtras);
    }

    public showSupplierDesktop(supplier) {
        this.events.publish('showSupplier', (supplier));
    }

    public addSupplier() {
        this.router.navigate([this.router.url + '/add']);
    }

    setListIndex(id: number): void {
        this.listIndex = id;
    }
}
