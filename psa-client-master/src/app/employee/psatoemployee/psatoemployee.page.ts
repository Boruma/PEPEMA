import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { LoadingController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Employee } from 'src/app/models/employee';
import { PPE } from 'src/app/models/ppe';
import { PsaService } from '../../services/psa.service';
import { EmployeeService } from '../../services/employee.service';
import { CompanyService } from '../../services/company.service';
import { ToastService } from 'src/app/services/toast.service';

import {
    BarcodeScannerOptions,
    BarcodeScanner
} from '@ionic-native/barcode-scanner/ngx';
import { Pe } from 'src/app/models/pe';
import { ProviderService } from '../../services/provider.service';

@Component({
    selector: 'app-psatoemployee',
    templateUrl: './psatoemployee.page.html',
    styleUrls: ['./psatoemployee.page.scss'],
})
export class PsatoemployeePage implements OnInit {
    psas: PPE[];
    showDetail: boolean[];
    employee = <Employee>{};
    pe = <Pe>{};
    private psasForSearch: PPE[];
    barcodeScannerOptions: BarcodeScannerOptions;

    constructor(public formBuilder: FormBuilder,
        private employeeService: EmployeeService,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private barcodeScanner: BarcodeScanner,
        private psaService: PsaService,
        private ts: ToastService,
        private route: ActivatedRoute,
        private router: Router,
        private companyService: CompanyService,
        private events: Events,
        public global: ProviderService) {

        //Get Parameters of Routing
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.employee = this.router.getCurrentNavigation().extras.state.employee;
                this.pe = this.router.getCurrentNavigation().extras.state.pe;
            }
        });
        this.psas = [];
        this.showDetail = [];
        this.events.publish('updateMenuSelected');

    }

    onSearchTerm(ev: CustomEvent) {
        this.psasForSearch = this.employee.avippes;
        const val = ev.detail.value;
        if (val.trim() !== '') {
            this.employee.avippes = this.employee.avippes.filter(term => {
                return term.sn.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
        }
    }

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.getPsastoEmployee();
    }

    //get psas of employee
    getPsastoEmployee() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
            spinner: 'circles'
        }).then(res => {
            loading = res;
            loading.present();
            this.companyService.getStock().then(stock => {
                this.psaService.getPsas(stock['stock_ID']).then(data => {
                    for (let ppe of data['ppes']) {
                        if (ppe.pe.pe_ID === this.pe.pe_ID) {
                            this.psas.push(ppe);
                            this.showDetail.push(false);
                        }
                    }
                    loading.dismiss();
                }).catch(error => {
                    //Errorhandling
                    loading.dismiss();
                });
            });
        });
    }

    //assign a ppe to an employee
    assignone(ppe: PPE) {
        if (this.employee.ppes === undefined) {
            this.employee.ppes = [];
        }

        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
            spinner: 'circles'
        }).then(res => {
            loading = res;
            loading.present();
            this.employeeService.assignOne(this.employee, ppe)
                .then(data => {
                    this.employee.ppes.push(ppe);
                    let index = this.psas.findIndex(order => order.sn === ppe.sn);
                    this.psas.splice(index, 1);
                    this.showDetail.splice(index, 1);
                    loading.dismiss();

                    let navigationExtras: NavigationExtras = {
                        state: {
                            employee: this.employee,
                            url: this.router.url
                        }
                    };
                    this.events.publish('showEmployee', this.employee);
                    this.router.navigate(['users/employees'], navigationExtras);
                })
                .catch(error => {
                    loading.dismiss();
                });
        });
    }

    //unassign a ppe from a employee
    unassignone(stock, ppe: PPE) {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
            spinner: 'circles'
        }).then(res => {
            loading = res;
            loading.present();
            this.employeeService.unassignOne(stock, ppe)
                .then(data => {
                    let index = this.employee.ppes.findIndex(search => search.sn === ppe.sn);
                    this.employee.ppes.splice(index, 1);
                    this.employee.avippes.push(<PPE>data);
                    loading.dismiss();
                })
                .catch(error => {
                    //Errorhandling
                    loading.dismiss();
                })
        });
    }

    //scan psa
    scanPsa() {
        this.barcodeScanner.scan().then(barcodeData => {
            // Read in sn
            if (barcodeData.text == null) {
                return;
            }
            const isSameSn = (element) => element.sn === barcodeData.text;
            let index = this.psas.findIndex(isSameSn);
            if (index >= 0) {
                this.ts.presentToast('Seriennummer eingescannt');
                this.assignone(this.psas[index]);
            } else {
                this.ts.presentToast('Die Seriennummer ist unbekannt');
            }
        }).catch(err => {
        });
    }
    changeShowDetails(index: number) {
        this.showDetail[index] = (!this.showDetail[index]);
    }
}