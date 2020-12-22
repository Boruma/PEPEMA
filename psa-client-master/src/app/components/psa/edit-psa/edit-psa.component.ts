import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { ActivatedRoute } from '@angular/router';
import { PsaService } from '../../../services/psa.service';
import { PPE } from 'src/app/models/ppe';
import { Property } from 'src/app/models/property';
import { size } from 'src/app/models/size';
import { size_range } from 'src/app/models/size_range';
import { Events, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { PopoverController } from '@ionic/angular';
import { AddPropertyComponent } from '../../psatemplate/add-property/add-property.component';

@Component({
    selector: 'app-edit-psa',
    templateUrl: './edit-psa.component.html',
    styleUrls: ['./edit-psa.component.scss'],
})
export class EditPsaComponent implements OnInit {
    private url: String;
    public psaForm: FormGroup;
    templates: any;
    sizes: size[];
    sn: any;
    ppe: PPE = <PPE>{};
    edit_id: any;
    dropdownDefaults: any[];

    constructor(public formBuilder: FormBuilder,
        private psaService: PsaService,
        private errorService: ErrorhandlingService,
        private route: ActivatedRoute,
        public router: Router,
        public alertController: AlertController,
        private loadingController: LoadingController,
        private events: Events,
        private companyService: CompanyService,
        public popoverController: PopoverController) {

        this.ppe.properties = Array<Property>();
        this.ppe.size_ranges = Array<size_range>();

        this.psaForm = this.formBuilder.group({
            comment: new FormControl('', Validators.compose([])),
            commissiondate: new FormControl('', Validators.compose([])),
            state: new FormControl('', Validators.compose([])),

            properties: new FormArray([]),
        });

        if (this.router.getCurrentNavigation() != null && this.router.getCurrentNavigation().extras.state != null) {
            this.ppe = this.router.getCurrentNavigation().extras.state.ppe;
            this.psaService.getPe(this.ppe.pe_ID).then(pe => {
                this.ppe.pe = pe;
            });
        } else {
            this.router.navigate(['users/ppe']);
        }

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
                    this.ppe.properties[obj.index].intervall = obj.psaForm.value.minValue;
                }
            }
        });
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
        if (properties.text != null && properties.text != "") {
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

    ngOnInit() {
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

    //add a property to a psa
    addProperty(property: Property) {
        if (property != null)
            this.properties.push(this.createProperty(property));
    }

    //add a template to a psa
    addTemplateToPsa(template) {
        this.ppe.pe = template;
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
            if (sr.name == range.name) {
                ppe_range = sr;
            }
        });
        ppe_range.sizes[0].name = $event.detail.value;
    }

    //Function that is called when the value of the dropDown changes
    updatePsa() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
        }).then(res => {
            loading = res;
            loading.present();
            this.companyService.getStock().then(res => {
                this.ppe.stock_ID = res['stock_ID'];
                this.ppe.order_ID = null;
                this.ppe.properties.forEach(prop => {
                    if (prop.type == "intervall") {
                        prop.intervall = prop.minValue;
                    }
                });
                this.psaService.updatePsa(this.ppe).then(res => {
                    this.events.publish('updatePsas');
                    this.router.navigate(['users/ppe']);
                    loading.dismiss();
                })
                    .catch(error => {
                        //Errorhandling here
                        this.errorService.error(error);
                        loading.dismiss();
                    });
            }).catch(res => {
            })
        });
    }

    //alert for changing psa
    async presentAlertConfirm() {
        this.psaForm.markAllAsTouched();
        if (this.psaForm.valid) {
            const alert = await this.alertController.create({
                header: 'PSA ändern',
                message: this.ppe.pe.name + ' wirklich ändern?',
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
                            this.updatePsa();
                        }
                    }
                ]
            });
            await alert.present();
        }
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

    };
}
