import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ErrorhandlingService } from '../../../services/errorhandling.service';
import { Events, AlertController } from '@ionic/angular';
import { OrderService } from '../../../services/order.service';
import { FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { PsaService } from 'src/app/services/psa.service';
import { PPE } from 'src/app/models/ppe';


import {
    BarcodeScannerOptions,
    BarcodeScanner
} from '@ionic-native/barcode-scanner/ngx';


@Component({
    selector: 'app-show-order',
    templateUrl: './show-order.component.html',
    styleUrls: ['./show-order.component.scss'],
})
export class ShowOrderComponent implements OnInit {

    private incomingUrl: string;
    order: Order = new Order();
    private barcodeScannerOptions: BarcodeScannerOptions;

    private toDeliverPPEs: PPE[] = new Array<PPE>();
    private toDeliverPPEsNewSN: string[] = new Array<string>();

    showSetOrderData = false;
    private orderDateForm: FormGroup;
    orderDate: Date;

    constructor(private alertCtrl: AlertController,
        private loadingController: LoadingController,
        private barcodeScanner: BarcodeScanner,
        private orderService: OrderService,
        private errorService: ErrorhandlingService,
        private router: Router,
        private route: ActivatedRoute,
        private ts: ToastService,
        private psaService: PsaService,
        private events: Events) {

        this.events.subscribe('showOrder', (newOrder) => {
            this.order = newOrder;
        });
    }

    ngOnInit() {
        this.route.params.forEach(params => {
            // This will be triggered every time the params change
            this.getRouterData();
        });
    }

    private getRouterData() {
        if (this.router.getCurrentNavigation().extras.state != null) {
            this.order = this.router.getCurrentNavigation().extras.state.order;
            this.incomingUrl = this.router.getCurrentNavigation().extras.state.url;
        }
    }

    changeShowSetOrderData() {
        if (this.showSetOrderData) {
            this.showSetOrderData = false;
        } else {
            this.showSetOrderData = true;
        }
    }

    setOrderData() {
        let orderDateString: string = this.orderDate.toString();
        this.orderCommit(orderDateString);
        this.showSetOrderData = false;
        this.showOrders();
    }

    //alert for order mailed
    async presentAlertConfirmOrdered() {
        const alert = await this.alertCtrl.create({
            header: 'Bestellung abgeschickt',
            message: 'Bestellung ' + this.order.order_ID + ' wurde bestellt.',
            buttons: [
                {
                    text: 'Okay',
                    handler: () => {
                        this.showOrders();
                    }
                }
            ]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    private showOrders() {
        this.router.navigate(['users/orders']);
    }

    //alert for deleting the order
    async presentAlertConfirmDelete() {
        const alert = await this.alertCtrl.create({
            header: 'Bestellung löschen',
            message: 'Bestellung ' + this.order.order_ID + ' wirklich löschen?',
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
                        this.deleteOrder();
                    }
                }
            ]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    //delete the order
    private deleteOrder() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();

            this.orderService.deleteOrder(this.order.order_ID).then(() => {
                loading.dismiss();
                this.router.navigate(['users/orders']);
                this.events.publish('deleteOrder');
            }).catch(error => {
                this.errorService.error(error);
                loading.dismiss();
            });
        });
    }

    //if the order still not delivered should the user create new ppes
    openCreatePsa() {
        if (this.order.state !== 'delivered') {
            let navigationExtras: NavigationExtras = {
                state: {
                    stockType: 1,
                    supplier: this.order.supplier,
                    order_ID: this.order.order_ID,
                    url: this.router.url,
                }
            };
            if (this.router.url.includes("show")) { this.router.navigate([this.router.url + '/createPsa'], navigationExtras); }
            else {
                this.router.navigate([this.router.url + '/show/createPsa'], navigationExtras);
            }

        }
    }

    //delete ppe from order
    public deletePPEFromOrder(index: number) {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();

            this.psaService.deletePsa(this.order.ppes[index].sn).then((value) => {
                this.orderService.getOrder(this.order.order_ID).then(order => {
                    this.order = order;
                    loading.dismiss();
                    this.events.publish('orderUpdate', this.order);
                }).catch(error => {
                    this.errorService.error(error);
                    loading.dismiss();
                });
            }).catch(error => {
                this.errorService.error(error);
                loading.dismiss();
            });
        });

    }

    //alert for deleting article
    async presentAlertConfirmDeletePPE(index: number) {
        const alert = await this.alertCtrl.create({
            header: 'Artikel löschen',
            message: 'Artikel ' + this.order.ppes[index].pe.name + ' ' + this.order.ppes[index].pe.supplItemID + ' wirklich löschen?',
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
                        if (this.order.ppes.length > 1) {
                            this.deletePPEFromOrder(index);
                        } else {
                            this.presentAlertConfirmDeletePPEWithOrder();
                        }
                    }
                }
            ]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    //alert for deleting order
    async presentAlertConfirmDeletePPEWithOrder() {
        const alert = await this.alertCtrl.create({
            header: 'Bestellung löschen',
            message: 'Das ist der letzte Artikel in dieser Bestellung.\nMöchten Sie die ganze Bestellung löschen oder den Vorgang abbrechen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (cancel) => {
                    }
                }, {
                    text: 'Bestellung löschen',
                    handler: () => {
                        this.deleteOrder();
                    }
                },
            ]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    //order commited at given date
    private orderCommit(orderDate: string) {
        this.orderService.orderCommited(this.order.order_ID, orderDate).then(() => {
            this.orderService.getOrder(this.order.order_ID).then(order => {
                this.order = order;
            }).catch(error => {
                this.errorService.error(error);
            });
            this.events.publish('orderUpdate');
        }).catch(error => {
            this.errorService.error(error);
        });
    }

    //deliver ppe
    public deliveredPPE($event, ppe: PPE) {
        if (!ppe.delivered) {
            return;
        }
        this.presentAlertConfirmdeliverPPEWithNewSN(ppe);
    }

    //sets the order as delivered
    private putToDeliveredPPEs(ppe: PPE, newSN: string) {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();
            this.psaService.deliveredPPE(ppe, newSN).then((value) => {
                this.orderService.getOrder(this.order.order_ID).then(order => {
                    this.order = order;
                    loading.dismiss();
                }).catch(error => {
                    this.errorService.error(error);
                    loading.dismiss();
                });
            }).catch(error => {
                this.errorService.error(error);
                ppe.delivered = false;
                loading.dismiss();
            });
        });
    }

    //scan a psa
    scanPsa() {
        this.barcodeScanner.scan().then(barcodeData => {

            // Get the Psa with the same pn
            if (barcodeData.text == null) {
                this.ts.presentToast('Die Seriennummer ist ungültig');
                return 0;
            }
            this.ts.presentToast('Seriennummer eingescannt');
            return barcodeData.text;

        }).catch(err => {
            return 0;
        });
    }

    //alert for set a order as delivered with a given sn
    async presentAlertConfirmdeliverPPEWithNewSN(ppe: PPE) {
        const alert = await this.alertCtrl.create({
            header: 'Bestätigen',
            message: 'Seriennummer eingeben oder scannen:',
            inputs: [
                {
                    name: 'sn',
                    type: 'text',
                    placeholder: 'Seriennummer'
                }
            ],
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (cancel) => {
                        ppe.delivered = false;
                    }
                },

                {
                    text: 'Scannen',
                    cssClass: 'secondary',
                    handler: () => {
                        this.barcodeScanner.scan().then(barcodeData => {
                            // Get the Psa with the same pn
                            if (barcodeData.text.length > 2 && barcodeData.text.length < 100) {
                                this.putToDeliveredPPEs(ppe, barcodeData.text);
                                this.events.publish('orderUpdate');
                                this.ts.presentToast('Bestellung bestätigt');
                            } else {
                                this.ts.presentToast('Die Seriennummer ist ungültig');
                                ppe.delivered = false;
                            }

                        }).catch(err => {
                            this.ts.presentToast("Das Scannen ist leider nicht möglich.");
                            ppe.delivered = false;
                            return 0;
                        });
                    }
                },

                {
                    text: 'Bestätigen',
                    handler: (data) => {
                        if (data.sn.length > 2 && data.sn.length < 100) {
                            this.putToDeliveredPPEs(ppe, data.sn);
                            this.events.publish('orderUpdate');
                        } else {
                            ppe.delivered = false;
                            this.ts.presentToast('Die Seriennummer ist nicht gültig!');
                        }
                    }
                }
            ]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    //creates a mail with the order
    startOrderMail() {
        //just possible if supplier has got a mail-address
        if (this.order.supplier.email && this.order.supplier.email.length !== 0) {
            //generate mail text. %0D%0A is a line break
            let mail_text: string = '';
            //add each ppe in order
            this.order.ppes.forEach(value => {
                //add sizes
                let ordertext: string = '---------------------------------%0D%0A'
                ordertext += value.pe.supplItemID + ' ' + value.pe.name + ':%0D%0AGrößenangabe(n): ';
                value.size_ranges.forEach(one_size => {
                    ordertext += one_size.name + ' ';
                    one_size.sizes.forEach(size_name => {
                        ordertext += size_name.name + ' ';
                    });
                });
                mail_text += ordertext + '%0D%0A';
            });
            mail_text += '---------------------------------%0D%0A';
            //open mail with adress, subject and body in client email program
            window.location.href = `mailto:${this.order.supplier.email}?subject=Bestellung ${this.order.order_ID}&body=${mail_text}`;
            this.orderCommit("");
            this.showOrders();
        } else {
            this.ts.presentToast('Der Lieferant hat keine Email-Adresse. Bitte erst eine Email-Adresse bei dem Lieferanten angeben.');
        }
    }

}
