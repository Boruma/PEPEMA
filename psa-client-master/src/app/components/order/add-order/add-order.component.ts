import {Component, OnInit} from '@angular/core';
import {Events, LoadingController} from '@ionic/angular';
import {Supplier} from 'src/app/models/supplier';
import {SupplierService} from '../../../services/supplier.service';
import {OrderService} from 'src/app/services/order.service';
import {PsaService} from '../../../services/psa.service';
import {ErrorhandlingService} from 'src/app/services/errorhandling.service';
import {AlertController} from '@ionic/angular';
import {PPE} from 'src/app/models/ppe';
import {Order} from 'src/app/models/order';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {ToastService} from 'src/app/services/toast.service';

@Component({
    selector: 'app-add-order',
    templateUrl: './add-order.component.html',
    styleUrls: ['./add-order.component.scss'],
})
export class AddOrderComponent implements OnInit {

    newOrder: Order = null;
    private orderNumber: number;
    private orderInProcess = false;

    supplier: Supplier[] = new Array();
    private suppListIsEmpty: boolean = true;
    supplIsSelected: boolean = false;
    public selectedSupplier: number;
    private lastSelectedSupplier: number = -1;

    newPpes: PPE[] = new Array<PPE>();
    newPpesIsEmpty: boolean = true;

    private addNewOrder: boolean = false;

    private createOrderIsValid: boolean = true;

    constructor(private route: ActivatedRoute,
                private errorService: ErrorhandlingService,
                private supplierService: SupplierService,
                private orderService: OrderService,
                private psaService: PsaService,
                public alertController: AlertController,
                public router: Router,
                private loadingController: LoadingController,
                private events: Events,
                private toastService: ToastService) {
        this.getRouterData();
    }

    ngOnInit() {
        this.getAllSuppliers();
        this.route.params.forEach(params => {
            // This will be triggered every time the params change
            // Add your code to reload here. i.e.
            this.getObserverData();
        });

    }

    private async getObserverData() {
        this.getNewOrderData().then(() => {
            this.getNewPpesData().then(() => {
                    if (!this.newPpesIsEmpty && this.addNewOrder) {
                        this.presentAlertConfirmNewOrder();
                    } else if (this.addNewOrder && this.newPpesIsEmpty) {
                        this.newOrder.supplier = null;
                        this.supplIsSelected = false;
                    }
                    this.addNewOrder = false;

                }
            );
        });
    }

    private getRouterData() {
        try {
            this.addNewOrder = this.router.getCurrentNavigation().extras.state.addNewOrder;
        } catch (Exception) {
            this.addNewOrder = false;
        }
    }

    //check if a tmp order is in process
    private async getNewOrderData() {
        this.orderService.orderDataUpdatet.subscribe(observerData => {
            this.newOrder = observerData;
            if (this.newOrder == null) {
                this.supplIsSelected = false;
                this.setNewOrder();
            } else {
                if (this.newOrder.supplier != null) {
                    this.supplIsSelected = true;
                } else {
                    this.supplIsSelected = false;
                }
            }
        }, err => {
        });
    }

    //sets the order if there is none
    private setNewOrder() {
        this.newOrder = new Order();
        this.orderService.setNewOrder(this.newOrder);
        this.orderInProcess = true;
    }

    //check if there are still any ppes in tmp Order
    async getNewPpesData() {
        this.orderService.ppesDataUpdatet
            .subscribe(observerData => {
                this.newPpes = observerData;
                if (this.newPpes == null || this.newPpes.length == 0) {
                    this.newPpesIsEmpty = true;
                } else if (this.newPpes) {
                    this.newPpesIsEmpty = false;
                }
            }, err => {
            });
    }

    //gets all supplier
    private getAllSuppliers() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();
            this.supplierService.getSuppliers().then(resSupplier => {
                if (resSupplier.length !== 0) {
                    this.supplier = resSupplier;
                    this.suppListIsEmpty = false;
                }
                loading.dismiss();
            })
                .catch(error => {
                    this.errorService.error(error);
                    loading.dismiss();
                });
        });
    }

    //changes the active supplier
    changeSupplier($event) {
        if (this.lastSelectedSupplier === this.selectedSupplier) {
            return;
        } else if (this.lastSelectedSupplier === -1) {
            this.lastSelectedSupplier = this.selectedSupplier;
        }

        let suppl = this.getSupplier($event);

        if (suppl != null) {
            //set first Supplier
            if (this.newOrder.supplier == null) {
                this.newOrder.supplier = suppl;
                this.newOrder.supplier_ID = suppl.supplier_ID;
                this.orderService.setNewOrder(this.newOrder);
                this.supplIsSelected = true;
            }

            //Ask if supplier should be changed
            else {
                this.presentAlertChangeSupplier(suppl);
            }
        }
    }

    //sets the new active supplier
    private setNewSupplier(supplier) {
        this.lastSelectedSupplier = this.selectedSupplier;
        this.newOrder.supplier = supplier;
        this.newOrder.supplier_ID = supplier.supplier_ID;
        this.orderService.setNewOrder(this.newOrder);
        this.supplIsSelected = true;
        this.orderService.clearNewPpes();
    }

    //alert for changing the supplier
    async presentAlertChangeSupplier(supplier) {
        const alert = await this.alertController.create({
            header: 'Lieferanten ändern',
            message: 'Lieferanten wirklich auf ' + supplier.name + ' ändern? Alle Artikel werden gelöscht.',
            buttons: [
                {
                    text: 'Abbrechen',
                    handler: () => {
                        this.selectedSupplier = this.lastSelectedSupplier;
                    }
                }, {
                    text: 'Ändern',
                    handler: () => {
                        this.setNewSupplier(supplier);
                    }
                }
            ]
        });

        await alert.present();
        let result = await alert.onDidDismiss();
    }

    //gets the supplier
    private getSupplier<Supplier>($event) {
        for (var suppl of this.supplier) {
            if (suppl.supplier_ID == $event.detail.value) {
                return suppl;
            }
        }
        return null;
    }

    //navigate to createPSA
    openCreatePsa() {
        if (this.newOrder != null) {
            let navigationExtras: NavigationExtras = {
                state: {
                    stockType: 1,
                    supplier: this.newOrder.supplier,
                    order_ID: this.newOrder.order_ID,
                    url: this.router.url,
                }
            };
            this.router.navigate([this.router.url + '/createPsa'], navigationExtras);
        }
    }

    //starts creating order and ppes in db
    createFinalOrder() {
        if (this.newOrder != null && this.newOrder.supplier_ID != null &&
            this.newPpes != null && this.newPpes.length !== 0) {
            let loading: HTMLIonLoadingElement;
            this.loadingController.create({}).then(res => {
                loading = res;
                loading.present();
                this.orderService.createOrder(this.newOrder).then(res => {
                    this.orderNumber = res.order_ID;
                    this.createFinalPpes();
                    this.events.publish('orderUpdate',);
                    loading.dismiss();
                })
                    .catch(error => {
                        this.errorService.error(error);
                        loading.dismiss();
                    });
            });
        } else {
            this.toastService.presentToast('Es ist ein Fehler beim Erstellen der Bestellung aufgetreten!');
            this.cancelOrder();
        }
    }

    //creates the Ppes
    private createFinalPpes() {
        if (this.newPpes != null && this.newPpes.length != 0) {
            if (this.orderNumber != null) {
                for (let ppe of this.newPpes) {
                    ppe.order_ID = this.orderNumber;
                    this.psaService.createPsa(ppe).then(res => {

                        this.deleteFromNewPpes(ppe.pe_ID);
                    })
                        .catch(error => {
                            this.createOrderIsValid = false;
                            this.errorService.error(error);
                        });
                }
                this.finishCreateOrder();
            }
        } else {
            this.toastService.presentToast('Es ist ein Fehler beim Erstellen der Artikel aufgetreten!');
            this.cancelOrder();
        }
    }

    //deletes a Ppe from the ppes list
    public deleteFromNewPpes(id) {
        if (this.newPpes != null) {
            this.newPpes.splice(this.newPpes.findIndex(ppe => ppe.pe_ID === id), 1);
        }
        if (this.newPpes.length === 0) {
            this.newPpesIsEmpty = true;
        }
    }

    //finish creating the order
    private finishCreateOrder() {
        if (this.createOrderIsValid) {
            this.orderService.setNewOrder(null);
            this.orderService.clearNewPpes();
            this.psaService.resetPpeCount();
            this.presentAlertConfirmCreate();
        } else {
            this.orderService.deleteOrder(this.orderNumber).then(() => {
                this.toastService.presentToast('Es ist ein Fehler beim Erstellen der Bestellung aufgetreten!');
                this.cancelOrder();
            }).catch(error => {
                this.errorService.error(error);
            });
        }
    }

    //alert for created order
    async presentAlertConfirmCreate() {
        const alert = await this.alertController.create({
            header: 'Bestellung erstellt',
            message: 'Bestellliste ' + this.orderNumber + ' wurde erstellt.',
            buttons: [
                {
                    text: 'Jetzt Bestellen',
                    handler: () => {
                        this.showNewOrder();
                    }
                }, {
                    text: 'Zur Übersicht',
                    handler: () => {
                        this.showOrders();
                    }
                }
            ]
        });

        await alert.present();
        let result = await alert.onDidDismiss();
    }

    //cancel the creation of the order
    private cancelOrder() {
        this.orderService.setNewOrder(null);
        this.orderService.clearNewPpes();
        this.psaService.resetPpeCount();
        this.newPpesIsEmpty = true;
        this.orderInProcess = false;
        this.selectedSupplier = null;
        this.lastSelectedSupplier = -1;
        this.router.navigate(['users/orders']);
    }

    //alert for cancel order
    async presentAlertConfirmCancel() {
        const alert = await this.alertController.create({
            header: 'Bestellung abbrechen',
            message: 'Wirklich abbrechen und alle Artikel löschen?',
            buttons: [
                {
                    text: 'Zurück',
                    handler: () => {
                    }
                }, {
                    text: 'Bestellung löschen',
                    handler: () => {
                        this.cancelOrder();
                    }
                }
            ]
        });

        await alert.present();
        let result = await alert.onDidDismiss();
    }


    //for start ordermail or set orderdata
    private showNewOrder() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();
            this.orderService.getOrder(this.orderNumber).then(res => {
                loading.dismiss();
                let navigationExtras: NavigationExtras = {
                    state: {
                        order: res,
                        url: this.router.url
                    }
                };
                this.router.navigate(['users/orders/show'], navigationExtras);
            })
                .catch(error => {
                    this.errorService.error(error);
                    loading.dismiss();
                });
        });

    }

    private showOrders() {
        this.router.navigate(['users/orders']);
    }

    //reset all variables for a new order
    private resetAll() {
        this.supplIsSelected = false;
        this.newOrder = new Order();
        this.orderService.setNewOrder(this.newOrder);
        this.orderInProcess = true;
        this.orderService.clearNewPpes();
        this.newPpesIsEmpty = true;
        this.getAllSuppliers();
    }

    //alert for continue order
    async presentAlertConfirmNewOrder() {
        const alert = await this.alertController.create({
            header: 'Bestellung fortsetzen?',
            message: 'Möchten Sie die alte Bestellung fortsetzen oder eine neue erstellen?',
            buttons: [
                {
                    text: 'Neue Bestellung',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (cancel) => {
                        this.resetAll();
                    }
                }, {
                    text: 'Fortsetzen',
                    handler: () => {

                    }
                }
            ]
        });

        await alert.present();
        let result = await alert.onDidDismiss();
    }

    //order for deleting article
    async presentAlertConfirmDeletePPE(index: number) {
        const alert = await this.alertController.create({
            header: 'Artikel löschen',
            message: 'Artikel ' + this.newPpes[index].pe.name + ' ' + this.newPpes[index].pe.supplItemID + ' wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (cancel) => {
                    }
                }, {
                    text: 'Löschen',
                    handler: () => {
                        this.deleteFromNewPpes(index);
                    }
                }
            ]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

}
