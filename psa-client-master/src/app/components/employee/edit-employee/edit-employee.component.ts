import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { Employee } from 'src/app/models/employee';
import { Address } from 'src/app/models/address';
import { LoadingController } from '@ionic/angular';
import { Events, AlertController } from '@ionic/angular';
import { Role } from '../../../models/role';
import { Router, NavigationExtras } from '@angular/router';


@Component({
    selector: 'app-edit-employee',
    templateUrl: './edit-employee.component.html',
    styleUrls: ['./edit-employee.component.scss'],
})

export class EditEmployeeComponent implements OnInit {
    createForm: FormGroup;
    addressForm: FormGroup;

    employee: Employee = <Employee>{};
    originEmployee: Employee;
    id: number;
    addressToggle: boolean = false;
    private showAdrDelActivate: boolean = null;
    showAdressDeleted: boolean = false;

    otherRoles: Role[];

    alltemplateforSearch: Role[];
    searchTerm: string = '';

    constructor(public formBuilder: FormBuilder,
        private employeeService: EmployeeService,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private events: Events,
        private alertCtrl: AlertController,
        private router: Router) {

        if (this.router.getCurrentNavigation() != null && this.router.getCurrentNavigation().extras.state != null) {
            this.employee = this.router.getCurrentNavigation().extras.state.employee;
            this.originEmployee = this.router.getCurrentNavigation().extras.state.employee;
        } else {
            this.router.navigate(['users/employees']);
        }
        this.prepareEmployee();

        this.alltemplateforSearch = [];
        this.createForm = this.formBuilder.group({
            id: ['',],
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            email: ['', [Validators.email, Validators.minLength(5), Validators.maxLength(40), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
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
        this.events.subscribe('editEmployee', (employee) => {
            this.employee = employee;
            this.originEmployee = employee;
        });

        // ----------------------------------------------------------------------
        // Role
        // added or removed role from employee
        this.events.subscribe('employeeRole', (role) => {
            this.getOtherRoles();
        });
    }

    ngOnInit() {
    }

    //initialise the employee
    private prepareEmployee() {
        this.employee = this.employeeService.copyEmployee(this.originEmployee);

        if (this.employee['address'] == null) {
            this.employee.address = <Address>{};
        }

        if (this.originEmployee.address) {
            this.addressToggle = true;
            setTimeout(() => this.addressForm.enable(), 0);
        }
        this.getOtherRoles();
    }

    //alert for changing a person
    async presentAlertConfirm() {
        const alert = await this.alertCtrl.create({
            header: 'Person ändern',
            message: this.employee.name + ' wirklich ändern?',
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

                        this.editEmployee();
                    }
                }
            ]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    //edits the values of an employee
    editEmployee() {
        if (!this.addressToggle) {
            this.employee.address = <Address>{};
        }
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
            spinner: 'circles'
        }).then(res => {
            loading = res;
            loading.present();

            this.employeeService.editEmployee(this.employee).then(employee => {


                if (employee['address'] != null && employee['address']['place'] != null) {
                    setTimeout(() => this.addressForm.enable(), 0);
                    this.addressToggle = true;
                } else {
                    setTimeout(() => this.addressForm.disable(), 0);
                    this.addressToggle = false;
                    this.employee.name = employee['name'];
                    this.employee.email = employee['email'];
                    this.employee.phonenumber = employee['phonenumber'];
                    this.employee.locker = employee['locker'];
                    this.employee.employee_ID = employee['employee_ID'];
                    this.employee.address = <Address>{};
                }
                loading.dismiss();

                // edit role in db
                this.writeRolesInDB();

                this.originEmployee = this.employee;

                this.events.publish('updateEmployees', this.originEmployee);

                this.router.navigate(['users/employees']);

            })
                .catch(error => {
                    //Errorhandling
                    this.errorService.error(error);
                    loading.dismiss();
                });
        });


    }

    private showEmployee() {
        this.events.publish('showEmployee', (this.employee));
    }

    //gets the information for an employee
    getEmployee($id) {
        setTimeout(() => this.addressForm.disable(), 0);
        this.addressToggle = false;
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();
            this.employeeService.getEmployee($id).then(employee => {
                if (employee['address'] != null && employee['address']['place'] != null) {
                    setTimeout(() => this.addressForm.enable(), 0);
                    this.addressToggle = true;
                    this.employee = employee;
                } else {
                    setTimeout(() => this.addressForm.disable(), 0);
                    this.addressToggle = false;
                    this.employee.name = employee['name'];
                    this.employee.email = employee['email'];
                    this.employee.phonenumber = employee['phonenumber'];
                    this.employee.locker = employee['locker'];
                    this.employee.employee_ID = employee['employee_ID'];
                    this.employee.address = <Address>{};
                }
                loading.dismiss();
            })
                .catch(error => {
                    //Errorhandling
                    this.errorService.error(error);
                    loading.dismiss();
                });
        });
    }

    //toggle address form
    toggleAddressForm() {
        if (this.addressToggle) {
            if (this.showAdrDelActivate == null) {
                this.showAdrDelActivate = true;
            }
            setTimeout(() => this.addressForm.disable(), 0);
        } else {
            setTimeout(() => this.addressForm.enable(), 0);
        }
    }

    //toggles delete message
    toggleDeleteMessage() {
        if (this.showAdrDelActivate === true) {
            if (this.showAdressDeleted) {
                this.showAdressDeleted = false;
            } else {
                this.showAdressDeleted = true;
            }
        }
    }

    //gets all roles of the employee
    getOtherRoles() {
        this.employeeService.getAllRoles().then(result => {
            // other roles = all roles
            if (result == null || result === undefined) {
                this.otherRoles = [];
            } else {
                this.otherRoles = result;

                // remove the already added roles from other roles
                this.employee.roles.forEach(role => {
                    this.otherRoles.splice(this.otherRoles.findIndex(findRole => findRole.role_ID === role.role_ID), 1);
                });
            }
            this.alltemplateforSearch = this.otherRoles;

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
            const removeIndex = this.employee.roles.indexOf(removeRole);
            if (removeIndex >= 0) {
                this.employee.roles.splice(removeIndex, 1);
            }
            this.events.publish('employeeRole', removeRole);
        }
    }

    //writes the roles in the DB
    writeRolesInDB() {
        let removeRoles: Role[];
        let addRoles: Role[];

        removeRoles = [];
        addRoles = [];

        if (this.employee.roles === undefined) {
            this.employee.roles = [];
        }

        const employeeRoles = this.employee.roles;

        this.employeeService.getAllRolesFromEmployee(this.originEmployee.employee_ID).then(result => {
            if (result !== undefined) {
                this.originEmployee.roles = result;
            } else {
                this.originEmployee.roles = [];
            }

            // define which roles have to be removed and remove them
            for (let role of this.originEmployee.roles) {
                let remove = true;
                for (let newRole of employeeRoles) {
                    if (role.role_ID === newRole.role_ID) {
                        remove = false;
                    }
                }
                if (remove) {
                    removeRoles.push(role);
                }
            }

            for (let role of removeRoles) {
                this.employeeService.removeRole(this.originEmployee.employee_ID, role.role_ID).then(res => {
                    this.events.publish('roleUpdatedInDB', null);
                });
            }

            // define which roles have to be added and add them
            for (let newRole of employeeRoles) {
                let add = true;
                for (let role of this.originEmployee.roles) {
                    if (role.role_ID === newRole.role_ID) {
                        add = false;
                    }
                }
                if (add) {
                    addRoles.push(newRole);
                }
            }
            for (let role of addRoles) {
                this.employeeService.addRole(this.originEmployee.employee_ID, role.role_ID).then(res => {
                    this.events.publish('roleUpdatedInDB', null);
                });
            }

        });
    }

    //navigates to addpsa page
    public addpsa(employee) {
        if (employee == null) {
            employee = this.employee;
        }
        let navigationExtras: NavigationExtras = {
            state: {
                employee: employee,
                url: this.router.url
            }
        };
        this.router.navigate(['users/employees/addpsa'], navigationExtras);
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

    //Error messages
    validation_messages = {
        'email': [
            { type: 'required', message: 'Bitte eine gültige Email eintragen.' },
            { type: 'email', message: 'Die Email Adresse muss gültig sein.' },
            { type: 'pattern', message: 'Die Email Adresse muss folgendes Format haben: xxxx@xx.xx' },
            { type: 'maxlength', message: 'Die Email darf maximal aus 40 Zeichen bestehen.' }
        ],
        'name': [
            { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 50 Zeichen bestehen.' }
        ],
        'phonenumber': [
            { type: 'minlength', message: 'Die Telefonnummer muss mindestens aus 7 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Die Telefonnummer darf maximal aus 20 Zeichen bestehen.' }
        ],
        'place': [
            { type: 'required', message: 'Bitte ein gültigen Ort eintragen.' },
            { type: 'minlength', message: 'Der Ortsname muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Ortsname darf maximal aus 30 Zeichen bestehen.' }
        ],
        'street': [
            { type: 'required', message: 'Bitte eine gültige Straße eintragen.' },
            { type: 'minlength', message: 'Der Straßenname muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Straßenname darf maximal aus 50 Zeichen bestehen.' }
        ],
        'housenumber': [
            { type: 'required', message: 'Bitte eine gültige Hausnummer eintragen.' },
            { type: 'maxlength', message: 'Die Hausnummer darf maximal aus 10 Zeichen bestehen.' }
        ],
        'postcode': [
            { type: 'required', message: 'Bitte eine gültige PLZ eintragen.' },
            { type: 'minlength', message: 'Der PLZ muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Die PLZ darf maximal aus 10 Zeichen bestehen.' }
        ],
        'address_additional': [
            { type: 'minlength', message: 'Der Addresszusatz muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Addresszusatz darf maximal aus 30 Zeichen bestehen.' }
        ],
    }

}