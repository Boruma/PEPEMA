import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { ActivatedRoute } from "@angular/router";
import { PsaService } from "../../services/psa.service";
import { PPE } from 'src/app/models/ppe';
import { Property } from 'src/app/models/property';
import { size } from 'src/app/models/size';
import { size_range } from 'src/app/models/size_range';
import { AlertController } from '@ionic/angular';
import { Router } from "@angular/router";
import { LoadingController, Events } from "@ionic/angular";

@Component({
    selector: 'app-edit-psa-page',
    templateUrl: './edit-psa.page.html',
    styleUrls: ['./edit-psa.page.scss'],
})
export class EditPsaPage implements OnInit {
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
        private events: Events) {

        this.ppe.properties = Array<Property>();
        this.ppe.size_ranges = Array<size_range>();
        this.psaForm = this.formBuilder.group({

            sn: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(2)
            ])),
            comment: new FormControl('', Validators.compose([])),
            commissiondate: new FormControl('', Validators.compose([])),
            state: new FormControl('', Validators.compose([])),

            properties: new FormArray([]),
        });
        // this.getTemplates();
        this.edit_id = this.route.snapshot.paramMap.get('id'); // erzeugt vermutlich viele Aufrufe 


        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
            spinner: "circles"
        }).then(res => {
            loading = res;
            loading.present();
            loading.dismiss();
        });

        this.events.publish('updateMenuSelected');
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

    addProperty(property: Property) {
        if (property != null)
            this.properties.push(this.createProperty(property));
    }


    addTemplateToPsa(template) {
        this.ppe.pe = template;
    }


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
        ppe_range.sizes[0].name = $event.detail.value;
    }

    updatePsa() {
        this.ppe.stock_ID = 1;
        this.ppe.order_ID = null;

        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
            spinner: "circles"
        }).then(res => {
            loading = res;
            loading.present();

            this.psaService.updatePsa(this.ppe).then(res => {
            })
                .catch(error => {
                    //Errorhandling here
                    this.errorService.error(error);
                });

            loading.dismiss();
        });
    }
}
