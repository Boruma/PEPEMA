import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { Address } from 'src/app/models/address';
import { Employee } from 'src/app/models/employee';
import { LoadingController, AlertController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { Role } from '../../../models/role';
import { HeaderComponent } from '../../../header/header.component';

@Component({
    selector: 'app-add-employee',
    templateUrl: './add-employee.component.html',
    styleUrls: ['./add-employee.component.scss'],
})

export class AddEmployeeComponent implements OnInit {


    createForm: FormGroup;
    addressForm: FormGroup;
    employee: Employee = {} as Employee;
    private showAdrDelActivate: boolean = null;
    showAddressDeleted: boolean = false;

    private saved: boolean = false;

    otherRoles: Role[];

    alltemplateforSearch: Role[];

    addressToggle = false;
    attemptedSubmit = false;
    employeeAdded = false;
    private header: HeaderComponent;

    constructor(public formBuilder: FormBuilder,
        private employeeService: EmployeeService,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private events: Events,
        private router: Router
    ) {

        this.alltemplateforSearch = [];
        this.employee.address = {} as Address;
        this.createForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            email: ['', [Validators.email, Validators.minLength(5), Validators.maxLength(40),
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            phonenumber: ['', [Validators.minLength(5), Validators.maxLength(20)]],
            locker: ['',],
            toggleAddress: ['',]
        });
        this.addressForm = this.formBuilder.group({
            place: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            street: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            housenumber: ['', [Validators.required, Validators.maxLength(10)]],
            postcode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
            address_additional: ['', [Validators.minLength(2), Validators.maxLength(30)]]
        });
        this.addressForm.disable();

        // ----------------------------------------------------------------------
        // Role

        // roles of origin employee in db updated
        this.events.subscribe('role', (role) => {
            // this.getRolesFromEmployee();
        });

        // added or removed role from employee
        this.events.subscribe('employeeRole', (role) => {
            this.getOtherRoles();
        });

        this.employee.roles = [];
        this.getOtherRoles();
    }

    // error messages for different errors
    validation_messages = {
        email: [
            { type: 'required', message: 'Bitte eine gültige Email eintragen.' },
            { type: 'email', message: 'Die Email Adresse muss gültig sein.' },
            { type: 'pattern', message: 'Die Email Adresse muss folgendes Format haben: xxxx@xx.xx' },
            { type: 'maxlength', message: 'Die Email darf maximal aus 40 Zeichen bestehen.' }
        ],
        name: [
            { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 50 Zeichen bestehen.' }
        ],
        phonenumber: [
            { type: 'minlength', message: 'Die Telefonnummer muss mindestens aus 7 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Die Telefonnummer darf maximal aus 20 Zeichen bestehen.' }
        ],
        place: [
            { type: 'required', message: 'Bitte ein gültigen Ort eintragen.' },
            { type: 'minlength', message: 'Der Ortsname muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Ortsname darf maximal aus 30 Zeichen bestehen.' }
        ],
        street: [
            { type: 'required', message: 'Bitte eine gültige Straße eintragen.' },
            { type: 'minlength', message: 'Der Straßenname muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Straßenname darf maximal aus 50 Zeichen bestehen.' }
        ],
        housenumber: [
            { type: 'required', message: 'Bitte eine gültige Hausnummer eintragen.' },
            { type: 'maxlength', message: 'Die Hausnummer darf maximal aus 10 Zeichen bestehen.' }
        ],
        postcode: [
            { type: 'required', message: 'Bitte eine gültige PLZ eintragen.' },
            { type: 'minlength', message: 'Der PLZ muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Die PLZ darf maximal aus 10 Zeichen bestehen.' }
        ],
        address_additional: [
            { type: 'minlength', message: 'Der Addresszusatz muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Addresszusatz darf maximal aus 30 Zeichen bestehen.' }
        ],
    };

    ngOnInit() {
    }

    //creates a employee
    createEmployee() {
        this.attemptedSubmit = true;
        if (this.createForm.valid && (!this.addressToggle || this.addressForm.valid)) {
            let loading: HTMLIonLoadingElement;
            this.loadingController.create({}).then(res => {
                loading = res;
                loading.present();
                this.employeeService.createEmployee(this.employee)
                    .then(newEmployee => {
                        this.saved = true;
                        this.attemptedSubmit = false;
                        this.markFieldsReset();
                        this.events.publish('updateEmployees', (newEmployee)); // reset Employee-List in list-employee
                        this.events.publish('showEmployee', newEmployee);
                        this.events.publish('roleUpdatedInDB', newEmployee);

                        this.employee = {} as Employee;
                        this.employee.address = {} as Address;
                        loading.dismiss();
                        this.router.navigate(['users/employees']);
                        this.header.saved = true;
                    })
                    .catch(error => {
                        // Errorhandling
                        this.errorService.error(error);
                        loading.dismiss();
                    });
            });
        } else {
            this.markFieldsDirty();
        }
    }

    //toggles the address form
    toggleAddressForm() {
        if (this.addressToggle) {
            if (this.showAdrDelActivate == null) {
                this.showAdrDelActivate = true;
            }
            this.addressForm.disable();
        } else {
            this.addressForm.enable();
        }
    }

    // toggles the delete message
    toggleDeleteMessage() {
        if (this.showAdrDelActivate === true) {
            if (this.showAddressDeleted) {
                this.showAddressDeleted = false;
            } else {
                this.showAddressDeleted = true;
            }
        }

    }

    //marks the invalid inputfields as dirty
    markFieldsDirty() {
        this.createForm.markAllAsTouched();

        for (const field in this.createForm.controls) {
            this.createForm.controls[field].markAsDirty();
        }
        if (this.addressToggle) {
            this.addressForm.markAllAsTouched();
            for (const field2 in this.addressForm.controls) {
                this.addressForm.controls[field2].markAsDirty();
            }
        }
    }

    //resets the marked dirty fields
    markFieldsReset() {
        for (const field in this.createForm.controls) {
            this.createForm.controls[field].reset();
        }
        if (this.addressToggle) {
            for (const field2 in this.addressForm.controls) {
                this.addressForm.controls[field2].reset();
            }
        }
    }

    ////////////////////////////
    // Roles
    getOtherRoles() {
        this.employeeService.getAllRoles().then(result => {
            // other roles = all roles
            if (result == null || result === undefined) {
                this.otherRoles = [];
            } else {
                this.otherRoles = result;

                // remove the already added roles from other roles
                if (this.employee.roles.length !== 0) {
                    this.employee.roles.forEach(role => {
                        this.otherRoles.splice(this.otherRoles.findIndex(findRole => findRole.role_ID === role.role_ID), 1);
                    });
                }
                this.alltemplateforSearch = this.otherRoles;
            }
        }).catch(error => {
            this.errorService.error(error);
        });
    }


    // adds a role to an employee model
    addRole(addRole: Role) {
        if (addRole != null) {
            // add role to the temporary employee
            this.employee.roles.push(addRole);

            this.events.publish('employeeRole', addRole);
        }
    }

    // removes a role from an employee model
    removeRole(removeRole: Role) {
        if (removeRole !== null) {
            // remove role from the temporary employee
            const removeIndex = this.employee.roles.indexOf(removeRole);
            if (removeIndex >= 0) {
                this.employee.roles.splice(removeIndex, 1);
            }
            this.events.publish('employeeRole', removeRole);
        }
    }

    onSearchTerm(ev: CustomEvent) {
        this.otherRoles = this.alltemplateforSearch;

        const val = ev.detail.value;
        if (val.trim() !== '') {
            this.otherRoles = this.otherRoles.filter(term => {
                return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
        }
    }

}
