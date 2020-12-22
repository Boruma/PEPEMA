import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { PsatemplateService } from '../../services/psatemplate.service';
import { SupplierService } from '../../services/supplier.service'
import { Events, LoadingController } from '@ionic/angular';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { Pe } from '../../models/pe';
import { size_range } from '../../models/size_range';
import { Role } from 'src/app/models/role';
import { Supplier } from 'src/app/models/supplier';
import { RoleService } from 'src/app/services/role.service';
import { templateJitUrl } from '@angular/compiler';
import { Router} from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AddPropertyComponent } from '.././../components/psatemplate/add-property/add-property.component';
import { AddSizerangeComponent } from '.././../components/psatemplate/add-sizerange/add-sizerange.component';

@Component({
    selector: 'app-addpsatemplate',
    templateUrl: './addpsatemplate.page.html',
    styleUrls: ['./addpsatemplate.page.scss'],
})

export class AddpsatemplatePage implements OnInit {
    //Array of PSA Properties
    public psaFormProperties: FormArray;
    public psaForm: FormGroup;
    public sizeRangeForm: FormGroup;
    private validProperties: boolean = false;
    validSizeRanges: boolean = false;
    selectedsupplierID = null;
    roles = [];
    rolestoTemplate = [];
    public alltemplateforSearch = [];
    public alltemplateforSearch2 = [];
    showError: boolean = false;

    //Array to fill the Dropdown List
    public dropdownOptions = [];
    //change this for the default value of the Dropdown
    public dropdownDefault = 1;

    //Function that is called when the value of the dropDown changes
    public dropdownFunction($event) {
        this.selectedsupplierID = $event.detail.value;
    }

    constructor(private fb: FormBuilder,
        private fb2: FormBuilder,
        private psatemplateService: PsatemplateService,
        private loadingController: LoadingController,
        private errorService: ErrorhandlingService,
        private supplierService: SupplierService,
        private roleService: RoleService,
        private router: Router,
        private events: Events,
        public popoverController: PopoverController) {
        this.psaForm = this.fb.group({
            psaFormElements: this.fb.array([])
        });
        this.sizeRangeForm = this.fb2.group({
            sizeRanges: this.fb2.array([])
        });
        this.alltemplateforSearch = this.roles;
        this.alltemplateforSearch2 = this.rolestoTemplate;

        this.events.subscribe('addPropertyToPe', (pe) => {

            this.psaFormProperties = this.psaForm.get('psaFormElements') as FormArray;
            this.psaFormProperties.push(pe);

            if (this.psaFormProperties.length > 0) {
                this.validProperties = true;
            }
        });
        this.events.subscribe('updateProperty', (obj) => {
            this.psaFormProperties[obj.index] = obj.psaForm;

        });
        this.events.subscribe('removeProperty', (index) => {
            this.removeProperty(index);
        });
        this.events.subscribe('addSizerangeToPe', (pe) => {
            (this.sizeRangeForm.get('sizeRanges') as FormArray).push(pe);
            this.validSizeRanges = true;
        });
        this.events.subscribe('deleteSizerange', (index) => {
            this.deletesizeRange(index);

        });


        this.events.publish('updateMenuSelected');
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

    onSearchTermRoles(ev: CustomEvent) {
        this.rolestoTemplate = this.alltemplateforSearch2;

        const val = ev.detail.value;
        if (val.trim() !== '') {
            this.rolestoTemplate = this.roles.filter(term => {
                return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
        }
    }

    addRoletoTemplate(role) {
        this.rolestoTemplate.push(role);
        let roleToChange;
        this.roles.forEach((item, index) => {
            if (item.role_ID === role.role_ID) {
                roleToChange = index;
            }
        });
        this.roles.splice(roleToChange, 1);
    }

    removeRoleFromTemplate(role) {
        this.roles.push(role);
        let roleToChange;
        this.rolestoTemplate.forEach((item, index) => {
            if (item.role_ID === role.role_ID) {
                roleToChange = index;
            }
        });
        this.rolestoTemplate.splice(roleToChange, 1);
    }

    get sizeRanges(): FormGroup {
        return this.fb2.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
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
        this.validSizeRanges = true;
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

    deletesizeRange(index) {

        let tem = this.sizeRangeForm.get('sizeRanges') as FormArray;
        (this.sizeRangeForm.get('sizeRanges') as FormArray).removeAt(index);
        if (templateJitUrl.length === 0) {
            this.validSizeRanges = false;
        } else {
            this.validSizeRanges = false;
        }
    }

    addSize(sizeRange) {
        sizeRange.get('sizes').push(this.sizes);

    }

    deleteSize(sizeRange, index) {
        if (sizeRange.get('sizes').length > 1) {
            sizeRange.get('sizes').removeAt(index);
        }
    }

    get sizeRangeFormData() {
        return <FormArray>this.sizeRangeForm.get('sizeRanges');
    }

    profileForm = new FormGroup({
        psaName: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
        ]),
        supplier_itemID: new FormControl('', [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
        ])
    });


    ngOnInit() {
        //Get Suppliers for Dropdown via Supplier Service
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();
            this.supplierService.getSuppliers().then(data => {
                for (let supp of data) {
                    this.dropdownOptions.push({
                        id: supp.supplier_ID,
                        val: supp.name
                    });
                }
                this.roleService.getRoles().then(data => {
                    for (let role of data) {
                        this.roles.push(role);
                    }
                });
                this.selectedsupplierID = this.dropdownOptions[0];
                this.dropdownDefault = this.dropdownOptions[0].id;
            })
                .catch(error => {
                    //Errorhandling
                    this.errorService.error(error);
                    loading.dismiss();
                });
            loading.dismiss();
        });


    }

    get psaFormControls() {

        return this.psaForm.get('psaFormElements')['controls'];
    }

    //Adds Property to FromBuilder Array
    addProperty(): void {
        this.psaFormProperties = this.psaForm.get('psaFormElements') as FormArray;
        this.psaFormProperties.push(this.createProperty());
        if (this.psaFormProperties.length > 0) {
            this.validProperties = true;
        }
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


    //Removes Property to FromBuilder Array
    removeProperty(i: number) {
        this.psaFormProperties.removeAt(i);
        if (this.psaFormProperties.length == 0) {
            this.validProperties = false;
        }
    }

    //From for Property
    createProperty(): FormGroup {

        return this.fb.group({
            name: [{ value: '', disabled: false }, [Validators.required, Validators.min(2), Validators.max(50)]],
            text: [{ value: '', disabled: false }, [Validators.required, Validators.min(2), Validators.max(50)]],
            minValue: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
            maxValue: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
            date: { value: '', disabled: true },
            intervall: { value: '', disabled: true },
            type: { value: '', disabled: true },
        });
    }

    createSizeProperty(): FormGroup {
        return this.fb.group({
            name: ''
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


    addPsaTemplate() {
        this.showError = true;
        this.psaForm.markAllAsTouched();
        this.profileForm.markAllAsTouched();
        if (this.psaForm.valid && this.selectedsupplierID != null && this.profileForm.valid && this.rolestoTemplate.length != 0) {
            let templateObj = new Pe();
            templateObj.name = this.profileForm.value.psaName;
            let roles: Array<Role> = [];
            let tempsizeR: Array<size_range> = [];
            let t: Array<size_range> = [];

            if (this.psaFormProperties == undefined) {
                templateObj.properties = [];
            } else {
                templateObj.properties = this.psaFormProperties.value;
            }
            if (this.sizeRangeForm == undefined) {
                templateObj.size_ranges = t;

            } else {

                templateObj.size_ranges = t;
                tempsizeR = this.sizeRangeForm.value.sizeRanges;
                for (let sizeR of tempsizeR) {
                    templateObj.size_ranges.push(sizeR);
                }
            }

            templateObj.supplItemID = this.profileForm.value.supplier_itemID;
            templateObj.roles = this.rolestoTemplate;
            templateObj.supplier = new Supplier(this.selectedsupplierID);
            let loading: HTMLIonLoadingElement;
            this.loadingController.create({}).then(res => {
                loading = res;
                loading.present();
                this.psatemplateService.createPsaTemplate(templateObj)
                    .then(res => {
                        this.events.publish('updateTemplates');
                        this.router.navigate(['users/pe']);
                    })
                    .catch(error => {
                        //Errorhandling
                        this.errorService.error(error);

                    });

                this.resetFormAfterSubmit();
                this.router.navigate(['users/pe']);
                loading.dismiss();
            }).catch(error => {
                loading.dismiss();
            });
        }
    }


    resetFormAfterSubmit() {
        this.psaForm.reset();
        this.profileForm.reset();
        if (this.psaFormProperties != undefined) {
            this.psaFormProperties.reset();
        }
        this.sizeRangeForm.reset()
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

    validation_messages = {
        'name': [
            { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 50 Zeichen bestehen.' }
        ],
        'name_property': [
            { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 20 Zeichen bestehen.' }
        ],
        'text_property': [
            { type: 'required', message: 'Bitte ein gültigen Text eintragen.' },
            { type: 'minlength', message: 'Der Text muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Text darf maximal aus 20 Zeichen bestehen.' }
        ],
        'minValue_property': [
            { type: 'required', message: 'Bitte ein gültigen Wert eintragen.' },
            { type: 'minlength', message: 'Der Wert muss mindesten aus 1 Zeichen bestehen.' },
            { type: 'pattern', message: 'Der Wert muss eine Zahl sein.' }
        ],
        'maxValue_property': [
            { type: 'required', message: 'Bitte ein gültigen Wert eintragen.' },
            { type: 'minlength', message: 'Der Wert muss mindesten aus 1 Zeichen bestehen.' },
            { type: 'pattern', message: 'Der Wert muss eine Zahl sein.' }
        ],
        'name_sizeRange': [
            { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 20 Zeichen bestehen.' }
        ],
        'supplier_itemID': [
            { type: 'required', message: 'Bitte ein gültigen Wert eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 50 Zeichen bestehen.' }
        ],
    }
}
