import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { PsatemplateService } from '../../services/psatemplate.service';
import { Events } from '@ionic/angular';


import { PopoverController } from '@ionic/angular';
import { AddPropertyComponent } from '.././../components/psatemplate/add-property/add-property.component';
import { AddSizerangeComponent } from '.././../components/psatemplate/add-sizerange/add-sizerange.component';

import { LoadingController } from '@ionic/angular';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { Pe } from '../../models/pe';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/models/role';
import { SupplierService } from '../../services/supplier.service'
import { Supplier } from 'src/app/models/supplier';

@Component({
    selector: 'app-editapsatemplate',
    templateUrl: './editapsatemplate.page.html',
    styleUrls: ['./editapsatemplate.page.scss'],
})
export class EditapsatemplatePage implements OnInit {

    Pe = <Pe>{};
    public selectedSupplier: number;
    public psaForm: FormGroup;
    public psaFormProperties: FormArray;
    public sizeRangeForm: FormGroup;

    roles: Role[];
    rolestoTemplate: Role[];
    currentSupplier = <Supplier>{};
    alltemplateforSearch: Role[];
    private selectedsupplierID = null;

    //Array to fill the Dropdown List
    public dropdownOptions = [];
    //change this for the default value of the Dropdown
    public dropdownDefault = 1;

    //Function that is called when the value of the dropDown changes
    public dropdownFunction($event) {
        this.selectedsupplierID = $event.detail.value;
    }
    profileForm;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private fb2: FormBuilder,
        private psatemplateService: PsatemplateService,
        private loadingController: LoadingController,
        private errorService: ErrorhandlingService,
        private events: Events,
        public popoverController: PopoverController,
        private roleService: RoleService,
        private supplierService: SupplierService,
    ) {
        this.alltemplateforSearch = this.roles;

        //Get Parameters of Routing
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation() != null && this.router.getCurrentNavigation().extras.state != null) {
                this.Pe = this.router.getCurrentNavigation().extras.state.template;
                this.profileForm = new FormGroup({
                    psaName: new FormControl(this.Pe.name, [
                        Validators.required,
                        Validators.minLength(2),
                        Validators.maxLength(30),
                    ]),
                    supplier_itemID: new FormControl(this.Pe.supplItemID, [
                        Validators.required,
                        Validators.minLength(2),
                        Validators.maxLength(50),
                    ])
                });
            } else {
                this.router.navigate(['users/pe']);
            }
        })


        this.psaForm = this.fb.group({
            psaFormElements: this.fb.array([]),
        });
        this.sizeRangeForm = this.fb2.group({
            sizeRanges: this.fb2.array([])
        });
        this.roles = [];
        this.alltemplateforSearch = [];
        this.rolestoTemplate = [];

        this.roleService.getRoles().then(data => {
            for (let role of data) {
                this.roles.push(role);
            }
        }).then(() => {
            let indexes = [];
            for (let role of this.roles) {
                for (let role2 of this.rolestoTemplate) {
                    if (role.role_ID == role2.role_ID) {
                        indexes.push(this.roles.indexOf(role));
                    }
                }
            }
            for (let i = indexes.length; i >= 0; i--) {
                if (indexes[i] != undefined) {
                    this.roles.splice(indexes[i], 1);
                }
            }
            this.alltemplateforSearch = this.roles;
        })

        this.events.subscribe('addPropertyToPe', (pe) => {

            this.psaFormProperties = this.psaForm.get('psaFormElements') as FormArray;
            this.psaFormProperties.push(pe);


        });
        this.events.subscribe('updateProperty', (obj) => {
            this.psaFormProperties[obj.index] = obj.psaForm;

        });
        this.events.subscribe('removeProperty', (index) => {
            this.removeProperty(index);
        });
        this.events.subscribe('addSizerangeToPe', (pe) => {

            (this.sizeRangeForm.get('sizeRanges') as FormArray).push(pe);
        });
        this.events.subscribe('deleteSizerange', (index) => {
            this.deletesizeRange(index);

        });


        this.events.publish('updateMenuSelected');
    }

    get psaFormControls() {
        return this.psaForm.get('psaFormElements')['controls'];
    }

    get formData() { return <FormArray>this.sizeRangeForm.get('sizeRanges'); }

    //Adds Property to FromBuilder Array
    addProperty(): void {

        this.psaFormProperties = this.psaForm.get('psaFormElements') as FormArray;
        if (this.Pe.properties == undefined) {
        }

        if (this.Pe.properties[0] != null) {
            for (let prop of this.Pe.properties) {
                this.psaFormProperties.push(this.createProperty(prop));
            }
        } else {
            this.Pe.properties = [];
        }
        if (this.Pe.size_ranges != null) {
            for (let sizeRange of this.Pe.size_ranges) {
                let t = this.addsizeRange2(sizeRange.name);
                for (let sizeRange2 of this.sizeRangeForm.get('sizeRanges')['controls']) {
                    if (sizeRange2.value.name === sizeRange.name) {
                        for (let size of sizeRange.sizes) {
                            this.addSizeinEdit(sizeRange2, size.name);
                        }
                    }
                }
            }
        } else {
            this.Pe.size_ranges = [];
        }
        if (this.Pe.roles.length != 0) {
            for (let role of this.Pe.roles) {
                this.rolestoTemplate.push(role);
            }
        }
    }

    addemptyProperty(): void {
        this.psaFormProperties = this.psaForm.get('psaFormElements') as FormArray;
        this.psaFormProperties.push(this.createnewEmptyProperty());
        this.Pe.properties = this.psaFormProperties.value;
    }

    async addSizeRangeMobile(show: boolean, data: any, index: any) {
        const popover = await this.popoverController.create({
            component: AddSizerangeComponent,

            translucent: true,
            cssClass: 'custom_popover',
            componentProps: { 'data': data, 'show': show, 'index': index },
        });
        this.events.subscribe('addSizerangeToPe', (pe) => {
            popover.dismiss();
        });
        this.events.subscribe('updateSizerange', (pe) => {
            popover.dismiss();
        });
        this.events.subscribe('deleteSizerange', (index) => {
            popover.dismiss();
        });
        return await popover.present();
    }

    //Removes Property to FromBuilder Array
    removeProperty(i: number) {
        this.psaFormProperties.removeAt(i);
        this.Pe.properties = this.psaFormProperties.value;
    }


    //From for Property
    createProperty(prop): FormGroup {
        return this.fb.group({
            name: { value: prop.name, disabled: false },
            text: { value: prop.text, disabled: true },
            minValue: { value: prop.minValue, disabled: true },
            maxValue: { value: prop.maxValue, disabled: true },
            date: { value: prop.date, disabled: true },
            intervall: { value: prop.intervall, disabled: true },
            type: { value: prop.type, disabled: false },
        });
    }

    async addPropertyMobile(show: boolean, data: any, index: any) {
        const popover = await this.popoverController.create({
            component: AddPropertyComponent,

            translucent: true,
            cssClass: 'custom_popover',
            componentProps: { 'data': data, 'show': show, 'index': index },
        });
        this.events.subscribe('addPropertyToPe', (pe) => {
            popover.dismiss();
        });
        this.events.subscribe('updateProperty', (pe) => {
            popover.dismiss();
        });
        this.events.subscribe('removeProperty', (index) => {
            popover.dismiss();
        });
        return await popover.present();
    }

    createnewEmptyProperty(): FormGroup {
        return this.fb.group({
            name: { value: '', disabled: false },
            text: { value: '', disabled: true },
            minValue: { value: '', disabled: true },
            maxValue: { value: '', disabled: true },
            date: { value: '', disabled: true },
            intervall: { value: '', disabled: true },
            type: { value: '', disabled: true },
        });
    }

    public showFormArray($event) {
        let value = $event.detail.value.split(' ');

        switch (value[0]) {
            case 'intervall':
                this.showIntervallFormArray(value[1]);
                break;
            case 'date':
                this.showDateFormArray(value[1]);
                break;
            case 'counterAsc':
                this.showCounterAscFormArray(value[1]);
                break;
            case 'counterDesc':
                this.showCounterDescFormArray(value[1]);
                break;
            case 'value':
                this.showValueFormArray(value[1]);
                break;
            case 'text':
                this.showTextFormArray(value[1]);
                break;
        }

    }

    editpsatemplate() {
        this.psaForm.markAllAsTouched();
        this.profileForm.markAllAsTouched();
        if (this.psaForm.valid && this.profileForm.valid) {

            this.Pe.name = this.profileForm.value.psaName;
            if (this.Pe.properties[0] != null) {
                this.Pe.properties = this.psaFormProperties.value;
            } else {
                this.Pe.properties = [];
            }

            if (this.Pe.size_ranges === undefined) {
            } else {
                this.Pe.size_ranges = this.sizeRangeForm.value.sizeRanges;
            }
            this.Pe.roles = this.rolestoTemplate;

            if ((this.selectedsupplierID != this.Pe.supplier_ID) && (this.selectedsupplierID != "default") && (this.selectedsupplierID != null)) {
                this.Pe.supplier_ID = this.selectedsupplierID;
            }

            this.Pe.supplItemID = this.profileForm.value.supplier_itemID;
            let loading: HTMLIonLoadingElement;
            this.loadingController.create({

            }).then(res => {
                loading = res;
                loading.present();
                this.psatemplateService.editPsaTemplate(this.Pe).then(Pe => {
                    this.Pe = Pe;
                    loading.dismiss();
                    this.router.navigate(['users/pe']);
                })
                    .catch(error => {
                        //Errorhandling
                        this.errorService.error(error);
                        loading.dismiss();
                    });
                loading.dismiss();
            });
        }
    }

    onSearchTerm(ev: CustomEvent) {
        this.roles = this.alltemplateforSearch;

        const val = ev.detail.value;
        if (val.trim() !== '') {
            this.roles = this.roles.filter(term => {
                return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
        }
    }

    showIntervallFormArray(i) {
        this.psaFormProperties.controls[i]['controls'].type.value = 'intervall';

        this.psaFormProperties.controls[i]['controls'].name.enable();
        this.psaFormProperties.controls[i]['controls'].intervall.disable();
        this.psaFormProperties.controls[i]['controls'].date.disable();
        this.psaFormProperties.controls[i]['controls'].maxValue.disable();
        this.psaFormProperties.controls[i]['controls'].minValue.disable();
        this.psaFormProperties.controls[i]['controls'].text.disable();
        this.psaFormProperties.controls[i]['controls'].type.enable();

    }

    showDateFormArray(i) {
        this.psaFormProperties.controls[i]['controls'].type.value = 'date';
        this.psaFormProperties.controls[i]['controls'].name.enable();
        this.psaFormProperties.controls[i]['controls'].intervall.disable();
        this.psaFormProperties.controls[i]['controls'].date.disable();
        this.psaFormProperties.controls[i]['controls'].maxValue.disable();
        this.psaFormProperties.controls[i]['controls'].minValue.disable();
        this.psaFormProperties.controls[i]['controls'].text.disable();
        this.psaFormProperties.controls[i]['controls'].type.enable();
    }

    showCounterDescFormArray(i) {
        this.psaFormProperties.controls[i]['controls'].type.value = 'downValueRange';
        this.psaFormProperties.controls[i]['controls'].name.enable();
        this.psaFormProperties.controls[i]['controls'].intervall.disable();
        this.psaFormProperties.controls[i]['controls'].date.disable();
        this.psaFormProperties.controls[i]['controls'].maxValue.disable();
        this.psaFormProperties.controls[i]['controls'].minValue.disable();
        this.psaFormProperties.controls[i]['controls'].text.disable();
        this.psaFormProperties.controls[i]['controls'].type.enable();

    }

    showCounterAscFormArray(i) {
        this.psaFormProperties.controls[i]['controls'].type.value = 'upValueRange';
        this.psaFormProperties.controls[i]['controls'].name.enable();
        this.psaFormProperties.controls[i]['controls'].intervall.disable();
        this.psaFormProperties.controls[i]['controls'].date.disable();
        this.psaFormProperties.controls[i]['controls'].maxValue.disable();
        this.psaFormProperties.controls[i]['controls'].minValue.disable();
        this.psaFormProperties.controls[i]['controls'].text.disable();
        this.psaFormProperties.controls[i]['controls'].type.enable();

    }

    showValueFormArray(i) {
        this.psaFormProperties.controls[i]['controls'].type.value = 'value';
        this.psaFormProperties.controls[i]['controls'].name.enable();
        this.psaFormProperties.controls[i]['controls'].intervall.disable();
        this.psaFormProperties.controls[i]['controls'].date.disable();
        this.psaFormProperties.controls[i]['controls'].maxValue.disable();
        this.psaFormProperties.controls[i]['controls'].minValue.disable();
        this.psaFormProperties.controls[i]['controls'].text.disable();
        this.psaFormProperties.controls[i]['controls'].type.enable();

    }

    showTextFormArray(i) {
        this.psaFormProperties.controls[i]['controls'].type.value = 'text';
        this.psaFormProperties.controls[i]['controls'].name.enable();
        this.psaFormProperties.controls[i]['controls'].intervall.disable();
        this.psaFormProperties.controls[i]['controls'].date.disable();
        this.psaFormProperties.controls[i]['controls'].maxValue.disable();
        this.psaFormProperties.controls[i]['controls'].minValue.disable();
        this.psaFormProperties.controls[i]['controls'].text.disable();
        this.psaFormProperties.controls[i]['controls'].type.enable();
    }

    ngOnInit() {
        this.addProperty();
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
            spinner: "circles"
        }).then(res => {
            loading = res;
            loading.present();
            this.supplierService.getSuppliers().then(data => {
                this.dropdownOptions.push({
                    id: "default",
                    val: "Lieferant ändern"
                })
                for (let supp of data) {
                    this.dropdownOptions.push({
                        id: supp.supplier_ID,
                        val: supp.name
                    })
                }
            }).catch(error => {
                this.errorService.error(error);
                loading.dismiss();
            }).then(() =>
                this.supplierService.getSupplier(this.Pe['supplier_ID']).then(data => {
                    this.currentSupplier = data;
                })
            )
            loading.dismiss();
        });

    }

    removeRoleFromTemplate(role) {
        if (this.rolestoTemplate.includes(role) === true) {
            let index = this.rolestoTemplate.indexOf(role);
            this.rolestoTemplate.splice(index, 1);
            this.roles.push(role);
        }
    }

    addRoleToTemplate(role) {
        if (this.roles.includes(role) === true) {
            let index = this.roles.indexOf(role);
            this.roles.splice(index, 1);
            this.rolestoTemplate.push(role);
        }

        if (this.alltemplateforSearch.includes(role) === true) {
            let index = this.alltemplateforSearch.indexOf(role);
            this.alltemplateforSearch.splice(index, 1);
        }
    }

    validation_messages = {
        'name': [
            { type: 'required', message: 'Bitte einen gültigen Wert eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 30 Zeichen bestehen.' }
        ]
    }

    createSize(size) {
        return this.fb2.group({
            name: size
        });
    }
    addSizeinEdit(sizeRange, sizecontent) {
        sizeRange.get("sizes").push(this.createSize(sizecontent));
    }

    createSizeRange(name) {
        return this.fb2.group({
            name: name,
            sizes: this.fb2.array([])
        });
    }

    addsizeRange2(name) {
        (this.sizeRangeForm.get("sizeRanges") as FormArray).push(this.createSizeRange(name));
        return this.sizeRangeForm.get("sizeRanges") as FormArray;
    }

    get sizeRanges(): FormGroup {
        return this.fb2.group({
            name: "",
            sizes: this.fb2.array([this.sizes])
        });
    }

    get sizes(): FormGroup {
        return this.fb2.group({
            name: ''
        });
    }

    addsizeRange() {
        (this.sizeRangeForm.get('sizeRanges') as FormArray).push(this.sizeRanges);
    }

    deletesizeRange(index) {
        (this.sizeRangeForm.get('sizeRanges') as FormArray).removeAt(index);
    }

    addSize(sizeRange) {
        sizeRange.get('sizes').push(this.sizes);
    }

    deleteSize(sizeRange, index) {
        sizeRange.get('sizes').removeAt(index);
    }
}