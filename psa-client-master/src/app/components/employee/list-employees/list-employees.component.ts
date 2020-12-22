import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { Employee } from 'src/app/models/employee';
import { LoadingController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

import { Events, AlertController } from '@ionic/angular';

@Component({
    selector: 'app-list-employees',
    templateUrl: './list-employees.component.html',
    styleUrls: ['./list-employees.component.scss'],
})
export class ListEmployeesComponent implements OnInit {

    // list of all employees
    private employees: Employee[] = new Array();
    filterdEmployees: Employee[];
    public searchTerm: string = '';
    private markedEmployee: Employee;

    // index of current employee
    public listIndex: number;
    listIsEmpty: boolean;


    constructor(public formBuilder: FormBuilder,
        private employeeService: EmployeeService,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private events: Events,
        private alertCtrl: AlertController,
        private router: Router
    ) {

        this.markedEmployee = null;
        this.events.subscribe('deleteEmployee', (employee) => {

            this.deleteEmployee(employee.employee_ID);
            this.listIndex = -1;
            this.searchTerm = '';
        });
        //If a employee will be chaneged or a new one will be added
        this.events.subscribe('updateEmployees', (employee) => {
            this.markedEmployee = employee;
            this.searchTerm = '';
            this.getAllEmployees();
        });

        this.events.subscribe('addEmployee', () => {

            this.addEmployee();
        });

    }

    ngOnInit() {

        this.listIsEmpty = true;
        this.getAllEmployees();

    }

    ionViewDidEnter() {
        this.listIndex = -1;
        this.searchTerm = '';
    }

    //Array to fill the Dropdown List
    public dropdownOptions = [
        { id: 0, val: 'Mitarbeiter sortieren' },
        { id: 1, val: 'A-Z' },
        { id: 2, val: 'Z-A' },
        { id: 3, val: 'Änderung aufsteigend' },
        { id: 4, val: 'Änderung absteigend' },
        { id: 5, val: 'Erstellung aufsteigend' },
        { id: 6, val: 'Erstellung absteigend' }
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
            default:
                break;
        }

    }

    sortasc() {
        this.employees.sort((a, b) => (a.name > b.name) ? 1 : -1);
    }

    sortdesc() {
        this.employees.sort((a, b) => (a.name < b.name) ? 1 : -1);
    }

    sortupdateasc() {
        this.employees.sort((a, b) => (a['updated_at'] > b['updated_at']) ? 1 : -1);
    }

    sortupdatedesc() {
        this.employees.sort((a, b) => (a['updated_at'] < b['updated_at']) ? 1 : -1);
    }

    sortdateasc() {
        this.employees.sort((a, b) => (a['created_at'] > b['created_at']) ? 1 : -1);
    }

    sortdatedesc() {
        this.employees.sort((a, b) => (a['created_at'] < b['created_at']) ? 1 : -1);
    }

    // reads in all employees and saves them to the array
    async getAllEmployees() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({

        }).then(res => {
            loading = res;
            loading.present();

            this.employeeService.getEmployees().then(resEmployees => {
                loading.dismiss();
                if (resEmployees.length !== 0) {
                    this.employees = resEmployees;
                    this.filterdEmployees = resEmployees;
                    this.listIsEmpty = false;
                    this.listIndex = this.getIndex(this.markedEmployee);
                }
            })
                .catch(error => {
                    loading.dismiss();
                    this.errorService.error(error);
                });
        });
    }

    //delete a employee with id
    public deleteEmployee(id) {

        // delete in server
        this.employeeService.deleteEmployee(id).then(res => {
            // delete in array
            this.employees.splice(this.employees.findIndex(employee => employee.employee_ID == id), 1);
            //reduces the current filtered EmployeeList
            this.setFilteredEmployees();
            //show "Keine Personen enthalten"
            if (this.employees.length == 0) {
                this.listIsEmpty = true;
            }
            this.router.navigate(['users/employees']);
        }).catch(res => {
            if (res.error.message.includes('Integrity constraint violation: 1451')) {
                let error: any;
                error = Error;
                error.status = "Diesem Mitarbeiter sind noch PSAs zugeordnet. Bitte entferne diese zuerst.";
                this.errorService.error(error);
            }

        });


    }

    // returns array index of employee
    private getIndex(employee: Employee) {
        for (const index in this.filterdEmployees) {
            if (this.filterdEmployees[index].employee_ID === employee.employee_ID) {
                return this.filterdEmployees.indexOf(this.filterdEmployees[index]);
            }
        }
        return -1;
    }

    setFilteredEmployees() {
        this.filterdEmployees = this.filterEmployee(this.searchTerm);
    }

    private filterEmployee(searchTerm) {
        return this.employees.filter(employee => {
            return employee.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
    }

    public showEmployee(employee) {
        let navigationExtras: NavigationExtras = {
            state: {
                employee: employee,
                url: this.router.url
            }
        };
        this.router.navigate([this.router.url + '/show'], navigationExtras);
    }

    public showEmployeeDesktop(employee) {
        for (let i = 0; i < this.employees.length; i++) {
            if (this.employees[i].employee_ID === employee.employee_ID) {
                this.listIndex = i;
            }
        }

        this.events.publish('showEmployee', (employee));
    }

    public addEmployee() {
        this.router.navigate([this.router.url + '/add']);
    }

    public editEmployee(employee) {
        let navigationExtras: NavigationExtras = {
            state: {
                employee: employee,
                url: this.router.url
            }
        };
        this.router.navigate([this.router.url + '/edit'], navigationExtras);
    }

    async presentAlertConfirmDelete(employee) {
        const alert = await this.alertCtrl.create({
            header: 'Person löschen',
            message: employee.name + ' wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {

                    }
                }, {
                    text: 'Löschen',
                    handler: () => {
                        let id = employee.employee_ID;
                        this.deleteEmployee(id);
                    }
                }
            ]
        });

        await alert.present();
        let result = await alert.onDidDismiss();
    }
}