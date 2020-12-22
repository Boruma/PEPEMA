import { Component, OnInit } from '@angular/core';
import { PsaService } from '../../../services/psa.service';
import { PPE } from 'src/app/models/ppe';
import { Events } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { LoadingController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { ProviderService } from '../../../services/provider.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PpeFilterComponent } from 'src/app/components/filter/ppe-filter/ppe-filter.component';
import { ToastService } from 'src/app/services/toast.service';
import { CompanyService } from '../../../services/company.service';

import {
    BarcodeScannerOptions,
    BarcodeScanner
} from '@ionic-native/barcode-scanner/ngx';
import { createNgModule } from '@angular/compiler/src/core';


@Component({
    selector: 'app-list-psa',
    templateUrl: './list-psa.component.html',
    styleUrls: ['./list-psa.component.scss'],
})
export class ListPsaComponent implements OnInit {

    ppes: PPE[];
    allppes: PPE[];
    active_ppe: PPE = <PPE>{};
    barcodeScannerOptions: BarcodeScannerOptions;
    listIndex: any;
    searchTerm: string = '';

    name: string;
    searchText: string = "";
    selected_count: number = 0;
    selected_games: { name: string; id: number; selected: boolean; type: string }[];
    selected_Properties: { name: string; id: number; selected: boolean; type: string }[];

    ppesAfterFilteringFroTemplates: PPE[];
    ppesAfterFilteringFroProperties: PPE[];
    intersection: PPE[];

    constructor(private psaService: PsaService,
        private barcodeScanner: BarcodeScanner,
        public router: Router,
        private events: Events,
        private ts: ToastService,
        public alertController: AlertController,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private provider: ProviderService,
        private fb: FormBuilder,
        private modalController: ModalController,
        private companyService: CompanyService) {
        this.active_ppe = new PPE();
        this.events.subscribe('deletePsa', (id) => {
            this.deletePsa(id);
        });

        this.events.subscribe('updatePsas', () => {

            this.getPsas();
        });

        this.events.subscribe('addPsa', () => {

            this.addPsa();
        });

        this.events.subscribe('scanPsa', () => {

            this.scanPsa();
        });
        this.barcodeScannerOptions = {
            showTorchButton: true,
            showFlipCameraButton: true
        };
        this.ppesAfterFilteringFroTemplates = [];
        this.ppesAfterFilteringFroProperties = [];
        this.intersection = [];
    }

    onSearchTerm(ev: CustomEvent) {
        this.ppes = this.allppes;
        const val = ev.detail.value;
        if (val.trim() !== '') {
            this.ppes = this.ppes.filter(term => {
                return term.pe.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
        }
    }

    //Array to fill the Dropdown List
    public dropdownOptions = [
        { id: 0, val: 'Artikel sortieren' },
        { id: 1, val: 'A-Z' },
        { id: 2, val: 'Z-A' },
        { id: 3, val: 'Änderung aufsteigend' },
        { id: 4, val: 'Änderung absteigend' },
        { id: 5, val: 'Erstellung aufsteigend' },
        { id: 6, val: 'Erstellung absteigend' },
        { id: 7, val: 'Kommissionierungsdatum aufsteigend' },
        { id: 8, val: 'Kommissionierungsdatum absteigend' }
    ];

    //change this for the default value of the Dropdown
    public dropdownDefault = 0;

    //Function that is called when the value of the dropDown changes
    public dropdownFunction($event) {
        switch ($event.detail.value) {
            case '1':
                this.sortasc();
                break;
            case '2':
                this.sortdesc();
                break;
            case '3':
                this.sortupdateasc();
                break;
            case '4':
                this.sortupdatedesc();
                break;
            case '5':
                this.sortdateasc();
                break;
            case '6':
                this.sortdatedesc();
                break;
            case '7':
                this.sortcommasc();
                break;
            case '8':
                this.sortcommdesc();
                break;
            default:
                break;
        }

    }

    sortasc() {
        this.ppes.sort((a, b) => (a.pe.name > b.pe.name) ? 1 : -1);
    }

    sortdesc() {
        this.ppes.sort((a, b) => (a.pe.name < b.pe.name) ? 1 : -1);
    }

    sortupdateasc() {
        this.ppes.sort((a, b) => (a['updated_at'] > b['updated_at']) ? 1 : -1);
    }

    sortupdatedesc() {
        this.ppes.sort((a, b) => (a['updated_at'] < b['updated_at']) ? 1 : -1);
    }

    sortdateasc() {
        this.ppes.sort((a, b) => (a['created_at'] > b['created_at']) ? 1 : -1);
    }

    sortdatedesc() {
        this.ppes.sort((a, b) => (a['created_at'] < b['created_at']) ? 1 : -1);
    }

    sortcommasc() {
        this.ppes.sort((a, b) => (a.commissioningdate > b.commissioningdate) ? 1 : -1);
    }

    sortcommdesc() {
        this.ppes.sort((a, b) => (a.commissioningdate < b.commissioningdate) ? 1 : -1);

    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: PpeFilterComponent,
            componentProps: {
                "templates": this.games,
                "properties": this.PropertyFilter,
                "selected": this.selected_games,
                "selectedProperties": this.selected_Properties

            }
        });

        modal.onDidDismiss().then((dataReturned) => {
            if (dataReturned.data != undefined) {

                if (dataReturned.data.selected == undefined) {
                    this.selected_games = [];
                } else {
                    this.selected_games = dataReturned.data.selected;
                }

                if (dataReturned.data.selectedProperties == undefined) {
                    this.selected_Properties = [];
                } else {
                    this.selected_Properties = dataReturned.data.selectedProperties;
                }

                this.filterItems();
            }
        });

        return await modal.present();
    }

    // Data Object to List Games
    games = []
    PropertyFilter = []

    // Getting Selected Games and Count
    filterItems() {
        this.ppes = [];
        this.ppesAfterFilteringFroTemplates = [];
        this.ppesAfterFilteringFroTemplates = [];
        this.intersection = [];
        if (this.selected_games.length == 0 && this.selected_Properties.length == 0) {
            this.intersection = this.allppes;
        }
        if (this.selected_games.length == 0 && this.selected_Properties.length != 0) {
            for (let ppe of this.allppes) {
                for (let selected of this.selected_Properties) {
                    for (let prop of ppe.properties) {
                        if (selected.id == prop.property_ID && selected.type == "property") {
                            if (this.ppesAfterFilteringFroProperties.filter(function (e) { return (e.sn == ppe.sn) }).length > 0) {

                            } else {
                                this.ppesAfterFilteringFroProperties.push(ppe);
                            }
                        }
                    }
                }
            }
            this.intersection = this.ppesAfterFilteringFroProperties;
        }

        if (this.selected_games.length != 0 && this.selected_Properties.length == 0) {
            for (let ppe of this.allppes) {
                for (let selected of this.selected_games) {
                    if (selected.id == ppe.pe_ID && selected.type == "template") {
                        if (this.ppesAfterFilteringFroTemplates.filter(function (e) { return (e.sn == ppe.sn) }).length > 0) {

                        } else {
                            this.ppesAfterFilteringFroTemplates.push(ppe);
                        }
                    }
                }
            }
            this.intersection = this.ppesAfterFilteringFroTemplates;
        }

        if (this.selected_games.length != 0 && this.selected_Properties.length != 0) {
            for (let ppe of this.allppes) {
                for (let selected of this.selected_Properties) {
                    for (let prop of ppe.properties) {
                        if (selected.id == prop.property_ID && selected.type == "property") {
                            if (this.ppesAfterFilteringFroProperties.filter(function (e) { return (e.sn == ppe.sn) }).length > 0) {

                            } else {
                                this.ppesAfterFilteringFroProperties.push(ppe);
                            }
                        }
                    }
                }
            }

            for (let ppe of this.allppes) {
                for (let selected of this.selected_games) {
                    if (selected.id == ppe.pe_ID && selected.type == "template") {
                        if (this.ppesAfterFilteringFroTemplates.filter(function (e) { return (e.sn == ppe.sn) }).length > 0) {

                        } else {
                            this.ppesAfterFilteringFroTemplates.push(ppe);
                        }
                    }
                }
            }

            this.intersection = this.ppesAfterFilteringFroTemplates.filter(x => this.ppesAfterFilteringFroProperties.includes(x));
        }
        this.ppes = this.intersection;
    }

    ngOnInit() {
        this.getPsas();
    }

    //get all psas
    async getPsas() {
      
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
        }).then(res => {
            loading = res;
            loading.present();
            this.companyService.getStock().then(stock => {
                this.psaService.getPsas(stock['stock_ID']).then(data => {
                    this.ppes = data['ppes'];
                    this.allppes = data['ppes'];
                    loading.dismiss();
                }).catch(error => {
                    loading.dismiss();
                    this.errorService.error(error);
                }).then(() => {
                    if (this.ppes != undefined && this.ppes.length != 0) {
                        for (let ppe of this.ppes) {
                            for (let prop of ppe.properties) {
                                if (this.PropertyFilter.filter(function (e) { return (e.id == prop.property_ID && e.type == "property"); }).length > 0) {

                                } else {
                                    this.PropertyFilter.push({ name: prop.name, id: prop.property_ID, selected: false, type: "property" });
                                }
                            }
                        }

                        for (let ppe of this.ppes) {
                            if (this.games.filter(function (e) { return e.id == ppe.pe.pe_ID && e.type == "template"; }).length > 0) {
                            } else {
                                this.games.push({ name: ppe.pe.name, id: ppe.pe_ID, selected: false, type: "template" });
                            }
                        }
                    }

                })
                this.companyService.getStock().then(stock => {
                    this.psaService.getPsas(stock['stock_ID']).then(data => {
                        this.ppes = data['ppes'];
                        loading.dismiss();
                    }).catch(error => {
                        loading.dismiss();
                        this.errorService.error(error);
                    });
                });
            }).catch(error => {
                loading.dismiss();
                this.errorService.error(error);
            });
        });
    }

    public returnPsa(): PPE {
        return this.active_ppe;
    }

    public setActivePsa(psa: PPE) {
        this.active_ppe = psa;
    }

    showPpeDetails(index) {
        let navigationExtras: NavigationExtras = {
            state: {
                ppe: this.ppes[index],
                url: this.router.url
            }
        };
        this.router.navigate([this.router.url + '/show'], navigationExtras);
    }

    showPpeDetailsDesktop(index) {
        this.listIndex = index;
        this.events.publish('showPpe', (this.ppes[index]));
    }

    updatePsa(ppe) {
        let navigationExtras: NavigationExtras = {
            state: {
                ppe: ppe
            }
        };
        this.router.navigate(['/users/ppe/edit', ppe]);
    }

    addPsa() {
        this.router.navigate(['/users/ppe/add']);
    }

    //scan a psa
    scanPsa() {
        this.barcodeScanner.scan().then(barcodeData => {
            // Get the Psa with the same pn
            if (barcodeData.text == null) {
                return;
            }
            const isSameSn = (element) => element.sn == barcodeData.text;
            let index = this.ppes.findIndex(isSameSn);
            if (index >= 0) {
                this.ts.presentToast('Seriennummer eingescannt');
                this.showPpeDetails(index);
            } else {
                this.ts.presentToast('Die Seriennummer ist unbekannt');
            }
        }).catch(err => {
        });
    }

    //delete a psa
    deletePsa(id) {
        let ppe: PPE;

        this.ppes.forEach(p => {
            if (p.sn === id) {
                ppe = p;
            }
        });
        if (ppe.state === 'Ausgemustert') {
        } else {
            ppe.state = 'Ausgemustert';

            this.psaService.updatePsa(ppe).then(res => {
            });
        }
    }
}
