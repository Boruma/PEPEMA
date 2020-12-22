import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { PsaService } from '../../../services/psa.service';
import { PPE } from 'src/app/models/ppe';
import { Property } from 'src/app/models/property';
import { size } from 'src/app/models/size';
import { size_range } from 'src/app/models/size_range';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { CompanyService } from 'src/app/services/company.service';
import { PopoverController } from '@ionic/angular';
import { AddPropertyComponent } from '../../psatemplate/add-property/add-property.component';
import { ToastService } from 'src/app/services/toast.service';

import {
    BarcodeScannerOptions,
    BarcodeScanner
} from '@ionic-native/barcode-scanner/ngx';

@Component({
    selector: 'app-add-psa',
    templateUrl: './add-psa.component.html',
    styleUrls: ['./add-psa.component.scss'],
})
export class AddPsaComponent implements OnInit {

    public psaForm: FormGroup;
    templates: any;
    template: any;
    size: size;
    sn: any;
    barcodeScannerOptions: BarcodeScannerOptions;
    ppe: PPE = <PPE>{};
    template_error: boolean = false;
    snError: boolean = false;

    constructor(public formBuilder: FormBuilder,
        private psaService: PsaService,
        private errorService: ErrorhandlingService,
        public alertController: AlertController,
        private barcodeScanner: BarcodeScanner,
        public router: Router,
        private events: Events,
        private ts: ToastService,
        private loadingController: LoadingController,
        private companyService: CompanyService,
        public popoverController: PopoverController) {

        this.ppe.properties = Array<Property>();
        this.ppe.size_ranges = Array<size_range>();
        this.psaForm = this.formBuilder.group({

            sn: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(2)
            ])),
            comment: new FormControl('', Validators.compose([
                Validators.maxLength(150),
            ])),
            commissioningdate: new FormControl('', Validators.compose([])),
            state: new FormControl('', Validators.compose([
                Validators.maxLength(30),
            ])),

            properties: new FormArray([]),
        });
        this.getTemplates();

        this.events.subscribe('updateProperty', (obj) => {
            let properties = this.ppe.properties[obj.index];
            if (properties != null) {
                if (properties.text != null && properties.text != "") {
                    this.ppe.properties[obj.index].text = obj.psaForm.value.text;
                }
                if (properties.minValue != null) {
                    this.ppe.properties[obj.index].minValue = obj.psaForm.value.minValue;
                }
                if (properties.maxValue != null) {
                    this.ppe.properties[obj.index].maxValue = obj.psaForm.value.maxValue;
                }
                if (properties.date != null) {
                    this.ppe.properties[obj.index].date = obj.psaForm.value.date;
                }
                if (properties.intervall != null) {
                    this.ppe.properties[obj.index].intervall = obj.psaForm.value.intervall;

                }
            }
        });
    }

    ngOnInit() {
    }

    async addPropertyMobile(show: boolean, data: any, index: any) {
        let properties = this.ppe.properties[index];
        let name, text, minValue, maxValue, date, intervall, type;
        let namedisabled, textdisabled, minvaluedisabled, maxvaluedisabled, datedisable, intervalldisabled, typedisabled;
        if (properties.name != null && properties.name != "") {
            name = properties.name;
            namedisabled = false;
        }
        else {
            name = '';
            namedisabled = true;
        }
        if (properties.text != null) {
            text = properties.text;
            textdisabled = false;
        }
        else {
            text = '';
            textdisabled = true;
        }
        if (properties.minValue != null) {
            minValue = properties.minValue;
            minvaluedisabled = false;
        }
        else {
            minValue = '';
            minvaluedisabled = true;
        }

        if (properties.maxValue != null) {
            maxValue = properties.maxValue;
            maxvaluedisabled = false;
        }
        else {
            maxValue = '';
            maxvaluedisabled = true;
        }
        if (properties.date != null) {
            date = properties.date;
            datedisable = false;
        }
        else {
            date = '';
            datedisable = true;
        }
        if (properties.intervall != null) {
            intervall = properties.intervall;
            intervalldisabled = false;
        }
        else {
            intervall = '';
            intervalldisabled = true;
        }
        if (properties.type != null && properties.type != "") {
            type = properties.type;
            typedisabled = false;
        }
        else {
            type = '';
            typedisabled = true;
        }
        let prop: FormGroup = this.formBuilder.group({
            name: [{ value: name, disabled: namedisabled }, [Validators.required, Validators.min(2), Validators.max(50)]],
            text: [{ value: text, disabled: textdisabled }, [Validators.required, Validators.min(2), Validators.max(50)]],
            minValue: [{ value: minValue, disabled: minvaluedisabled }, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
            maxValue: [{ value: maxValue, disabled: maxvaluedisabled }, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
            date: { value: date, disabled: datedisable },
            intervall: { value: intervall, disabled: intervalldisabled },
            type: { value: type, disabled: typedisabled },
        });
        const popover = await this.popoverController.create({
            component: AddPropertyComponent,

            translucent: true,
            cssClass: 'custom_popover',
            componentProps: { 'data': prop, 'show': show, 'index': index, 'ppe': true },
        });
        this.events.subscribe('addPropertyToPe', (pe) => {
            popover.dismiss();
        });
        this.events.subscribe('updateProperty', (pe) => {
            popover.dismiss();
        });
        return await popover.present();
    }

    get properties(): FormArray {
        return this.psaForm.get('properties') as FormArray;
    }

    createProperty(property: Property): FormControl {
        switch (property.type) {
            case 'upValueRange':
                return new FormControl('', Validators.compose([
                    Validators.min(0)
                ]));
                break;
            case 'downValueRange':
                return new FormControl('', Validators.compose([
                    Validators.min(0)
                ]));
                break;
            case 'value':
                return new FormControl('', Validators.compose([
                    Validators.min(0)
                ]));
                break;
            case 'date':
                return new FormControl('', Validators.compose([]));
                break;
            case 'text':
                return new FormControl('', Validators.compose([
                    Validators.minLength(2)
                ]));
                break;
            case 'intervall':
                return new FormControl('', Validators.compose([
                    Validators.min(1)
                ]));
                break;
        }
    }

    //add a property
    addProperty(property: Property) {
        if (property != null) {
            this.properties.push(this.createProperty(property));
        }
        if (property != null) {
            this.ppe.properties.push(new Property(property));
        }
    }

    //gets the templates
    async getTemplates() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({

        }).then(res => {
            loading = res;
            loading.present();
            this.psaService.getPes().then(data => {
                this.templates = data;
            }).catch(error => {
                //Errorhandling here
                this.errorService.error(error);
            });
            loading.dismiss();
        });
    }

    //add a template to a psa
    addTemplateToPsa($event) {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
        }).then(res => {
            loading = res;
            loading.present();
            this.psaService.getPe($event.detail.value).then(template => {
                for (var t of this.templates) {
                    if (t.pe_ID == $event.detail.value) {
                        this.ppe.pe = t;
                    }
                }
                this.template_error = false;
                this.ppe.pe_ID = $event.detail.value;
                this.ppe.order_ID = 1;
                if (this.properties != null) {
                    this.properties.clear();
                }
                this.ppe.pe.properties.forEach(property => {
                    this.addProperty(property);
                });

                this.ppe.size_ranges.length = 0;

                this.ppe.pe.size_ranges.forEach(sr => {
                    this.ppe.size_ranges.push(new size_range(sr.sizes[0], sr.sizer_ID, sr.name));
                });
                loading.dismiss();
            }).catch(error => {
                this.errorService.error(error);
                loading.dismiss();
            });
        });
    }

    //add a size to a psa
    addSizeToPsa($event) {
        let range_id = $event.srcElement.id;
        let ppe_range: size_range;
        let range: size_range;

        this.ppe.pe.size_ranges.forEach(sr => {
            if (sr.sizer_ID == range_id) {
                range = sr;
            }
        });

        this.ppe.size_ranges.forEach(sr => {
            if (sr.sizer_ID == range_id) {
                ppe_range = sr;
            }
        });

        for (var s of range.sizes) {
            if (s.size_ID == $event.detail.value) {

                if (ppe_range != null) {
                    ppe_range.sizes[0] = s;
                }
                else {
                    this.ppe.size_ranges.push(new size_range(s, range.sizer_ID, range.name));
                }
            }
        }
    }

    //add a psa
    addPsa() {
        if (this.ppe.pe_ID == null) {
            this.template_error = true;
        }
        else {
            this.template_error = false;
        }
        this.psaForm.markAllAsTouched();
        if (this.psaForm.valid) {
            let loading: HTMLIonLoadingElement;
            this.loadingController.create({
            }).then(res => {
                loading = res;
                loading.present();
                this.companyService.getStock().then(res => {
                    this.ppe.stock_ID = res['stock_ID'];
                    this.ppe.order_ID = null;
                    this.psaService.createPsa(this.ppe).then(res => {
                        this.router.navigate(['/users/ppe']);
                        this.events.publish('updatePsas'); //reset psa-List in list-employee
                    })
                        .catch(error => {
                            //Errorhandling here
                            if (error.error.error == "Could not create Ppe (sn is already used)") {
                                this.snError = true;
                            }
                            else {
                                // Errorhandling
                                this.errorService.error(error);
                                
                            }
                            loading.dismiss();
                        });

                        })
                
                    .catch(res => {
                    });
                loading.dismiss();
           }).catch(res => {
            });
        }
    }
// }

    scanPsa() {
        this.barcodeScanner.scan().then(barcodeData => {
            // Read in sn 
            if (barcodeData.text == null) {
                return;
            }
            this.ppe.sn = barcodeData.text;
            this.ts.presentToast('Seriennummer eingescannt');
        }).catch(err => {
        });
    }

    validation_messages = {
        'sn': [
            { type: 'required', message: 'Bitte eine gültige SN eintragen.' },
            { type: 'minlength', message: 'Die SN muss mindesten aus 2 Zeichen bestehen.' }
        ],

        'comment': [
            { type: 'maxlength', message: 'Der Kommentar darf maximal aus 150 Zeichen bestehen.' }
        ],
        'commissioningdate': [],
        'state': [
            { type: 'maxlength', message: 'Der Status darf maximal aus 30 Zeichen bestehen.' }
        ],
    }
}
