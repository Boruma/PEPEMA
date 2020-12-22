import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { Order } from 'src/app/models/order';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Events, AlertController } from '@ionic/angular';
import { Supplier } from 'src/app/models/supplier';
import { ProviderService } from '../../../services/provider.service';
import { ModalController } from '@ionic/angular';
import { OrderFiltersComponent } from 'src/app/components/filter/order-filters/order-filters.component'

@Component({
    selector: 'app-list-orders',
    templateUrl: './list-orders.component.html',
    styleUrls: ['./list-orders.component.scss'],
})
export class ListOrdersComponent implements OnInit {

    private orders: Order[] = new Array<Order>();
    notOrderedOrders: Order[] = new Array<Order>();
    orderedOrders: Order[] = new Array<Order>();
    deliveredOrders: Order[] = new Array<Order>();
    searchTerm: string = '';
    showDeliveredOrders = false;

    //for filtering
    private deliveredOrdersALL: Order[] = new Array<Order>();
    private suppliers: Supplier[] = new Array<Supplier>();
    private startFilterDate = null;
    private endFilterDate = null;
    selectedCheckboxes: { name: string; id: number; selected: boolean; type: string }[];

    constructor(public formBuilder: FormBuilder,
        private orderService: OrderService,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private events: Events,
        private changeDetector: ChangeDetectorRef,
        private alertCtrl: AlertController,
        private router: Router,
        private route: ActivatedRoute,
        private provider: ProviderService,
        private modalController: ModalController) {

        this.events.subscribe('deleteOrder', (newOrder) => {
            this.getAllOrders();
        });

        this.events.subscribe('addOrder', () => {
            this.addOrder();
        });

        this.events.subscribe('orderUpdate', () => {
            this.getAllOrders();
        });
    }

    ngOnInit() {

        this.route.params.forEach(params => {
            // This will be triggered every time the params change
            this.getAllOrders();
        });
    }


    dataReturned: any;

    async presentModal() {
        const modal = await this.modalController.create({
            component: OrderFiltersComponent,
            componentProps: {
                "suppliers": this.checkboxes,
                "start": this.startFilterDate,
                "end": this.endFilterDate,
                "selected": this.selectedCheckboxes
            }
        });

        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned.data != undefined) {
                this.dataReturned = dataReturned.data;
                this.startFilterDate = dataReturned.data.start;
                this.endFilterDate = dataReturned.data.end;
                this.selectedCheckboxes = dataReturned.data.selected;
                if (dataReturned.data.start == null && dataReturned.data.end == null && (dataReturned.data.selected.length == 0 || dataReturned.data.selected == undefined)) {
                    this.deliveredOrders = this.deliveredOrdersALL;
                } else {
                    this.filterItems();

                }
            }
        });

        return await modal.present();
    }


    onSearchTerm(ev: CustomEvent) {
        this.deliveredOrders = this.deliveredOrdersALL;

        const val = ev.detail.value;
        if (val.trim() !== '') {
            this.deliveredOrders = this.deliveredOrders.filter(term => {
                return term.order_ID.toString().toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
        }
    }

    // Data Object to List Games
    checkboxes = []

    // Getting Selected Games and Count
    filterItems() {
        let final = [];
        let afterFilter = [];
        let filterdOrders = [];
        this.deliveredOrders = this.deliveredOrdersALL;

        if (this.startFilterDate != null && this.endFilterDate != null) {
            for (let order of this.deliveredOrders) {
                if ((order.commitedDeliveryDate >= this.startFilterDate) && (order.commitedDeliveryDate <= this.endFilterDate)) {
                    filterdOrders.push(order);
                }
            }
        }

        for (let order of this.deliveredOrders) {
            for (let selected of this.selectedCheckboxes) {
                if (selected.id == order.supplier.supplier_ID && selected.type == "supplier") {
                    afterFilter.push(order);
                }
            }
        }

        if (filterdOrders.length == 0) {
            final = afterFilter;
        }

        if (afterFilter.length == 0) {
            final = filterdOrders;
        }

        if (afterFilter.length != 0 && filterdOrders.length != 0) {
            for (let orderSuppl of afterFilter) {
                for (let orderDate of filterdOrders) {
                    if (orderSuppl.order_ID == orderDate.order_ID) {
                        final.push(orderDate);
                    }
                }
            }

        }
        this.deliveredOrders = final;
    }


    buildSupplierFilter() {
        for (let supplier of this.suppliers) {
            if (this.checkboxes.filter(function (e) { return e.id == supplier.supplier_ID; }).length > 0) {

            } else {
                this.checkboxes.push({ name: supplier.name, id: supplier.supplier_ID, selected: false, type: "supplier" });
            }
        }
    }

    //gets all orders of the company
    async getAllOrders() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();
            this.orderService.getOrders().then(resOrders => {
                if (resOrders.length !== 0) {
                    this.orders = resOrders;
                    this.sortOrders();
                } else {
                    this.resetOrderLists();
                }
                loading.dismiss();
            })
                .catch(error => {
                    this.errorService.error(error);
                    loading.dismiss();
                }).then(() => {
                    this.buildSupplierFilter();
                })
        });
    }

    //toggle showdeliveredorders
    public toggleShowDeliveredOrders() {
        if (this.showDeliveredOrders) {
            this.showDeliveredOrders = false;
        } else {
            this.showDeliveredOrders = true;
        }
    }

    //sort the orders
    private sortOrders() {
        let length = this.orders.length;
        if (this.orders != null && length !== 0) {
            this.notOrderedOrders.length = 0;
            this.orderedOrders.length = 0;
            this.deliveredOrders.length = 0;
            for (let order of this.orders) {
                if (order.state === 'ordered') {
                    this.suppliers.push(order.supplier);
                    this.orderedOrders.push(order);
                }
                if (order.state === 'delivered') {
                    this.deliveredOrders.push(order);
                    this.deliveredOrdersALL.push(order);
                    this.suppliers.push(order.supplier);
                } else if (order.state == null) {
                    this.notOrderedOrders.push(order);
                    this.suppliers.push(order.supplier);
                }
            }
            this.orders.length = 0;
        }
    }

    //reset the lists
    private resetOrderLists() {
        this.orders = new Array<Order>();
        this.notOrderedOrders = new Array<Order>();
        this.orderedOrders = new Array<Order>();
        this.deliveredOrders = new Array<Order>();
    }

    //delete a order
    public deleteOrder(order_ID, state) {
        // delete in server
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();
            this.orderService.deleteOrder(order_ID).then(() => {
                loading.dismiss();
                this.router.navigate(['users/orders']);
            }).catch(error => {
                this.errorService.error(error);
                loading.dismiss();
                this.router.navigate(['users/orders']);
            });
        })
            .catch(error => {
                this.errorService.error(error);
                loading.dismiss();
            });
    }

    //navigate to show order
    public showOrder(order) {
        let navigationExtras: NavigationExtras = {
            state: {
                order: order,
                url: this.router.url
            }
        };
        this.router.navigate([this.router.url + '/show'], navigationExtras);
    }

    public showOrderDesktop(order) {
        this.events.publish('showOrder', (order));
    }

    public addOrder() {
        let addOrder: boolean = true;

        let navigationExtras: NavigationExtras = {
            state: {
                addNewOrder: addOrder
            }
        };

        this.router.navigate([this.router.url + '/add'], navigationExtras);
    }


    public editOrder(order) {
        let navigationExtras: NavigationExtras = {
            state: {
                order: order,
                url: this.router.url
            }
        };
        this.router.navigate([this.router.url + '/edit'], navigationExtras);
    }

    //alert for deleting order
    async presentAlertConfirmDelete(order) {
        const alert = await this.alertCtrl.create({
            header: 'Bestellung löschen',
            message: 'Bestellung ' + order.order_ID + ' wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (cancel) => {
                        this.router.navigate(['users/orders']);
                    }
                }, {
                    text: 'Löschen',
                    handler: () => {
                        this.deleteOrder(order.order_ID, order.state);
                    }
                }
            ]
        });

        await alert.present();
        let result = await alert.onDidDismiss();
    }
}
