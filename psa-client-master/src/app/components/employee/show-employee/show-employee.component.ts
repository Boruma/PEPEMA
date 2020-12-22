import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CompanyService } from '../../../services/company.service';
import { Employee } from 'src/app/models/employee';
import { Events, AlertController } from '@ionic/angular';
import { EmployeeService } from '../../../services/employee.service';
import { ErrorhandlingService } from '../../../services/errorhandling.service';
import { Router, NavigationExtras } from '@angular/router';
import { ProviderService } from '../../../services/provider.service';
import { Pe } from '../../../models/pe';
import { PPE } from '../../../models/ppe';
import { PsaService } from "../../../services/psa.service";


@Component({
    selector: 'app-show-employee',
    templateUrl: './show-employee.component.html',
    styleUrls: ['./show-employee.component.scss'],
})
export class ShowEmployeeComponent implements OnInit {

    private url: string;
    employee: Employee;

    availablePes = new Map<Pe, PPE[]>();

    constructor(
        private events: Events,
        private alertCtrl: AlertController,
        private employeeService: EmployeeService,
        private errorService: ErrorhandlingService,
        private router: Router,
        private psaService: PsaService,
        private loadingController: LoadingController,
        private companyService: CompanyService) {

        // sets  initial employee for Appview 
        if (this.router.getCurrentNavigation() != null && this.router.getCurrentNavigation().extras.state != null) {
            this.employee = this.router.getCurrentNavigation().extras.state.employee;
            this.url = this.router.getCurrentNavigation().extras.state.url;
        } 

        // shows different employee
        // "this.manageEmployee.setEmployee" und "this.manageEmployee.setComponentID(1)" In publisherclass
        this.events.subscribe('showEmployee', (newEmployee) => {
            this.employee = newEmployee;
            this.availablePes.clear();
            this.getPes();
        });

        if (this.employee != null) {
            this.getRolesFromEmployee();
        }

        // roles changed in db
        this.events.subscribe('roleUpdatedInDB', (role) => {
            if (this.employee != null) {
                this.getRolesFromEmployee();
            }
        });

        this.employeeService._updateEmployeeMobile.subscribe(() => {
            //this.provider.goBackBy = 2;
            this.editEmployee();
        });

        this.employeeService._addPsaMobile.subscribe(() => {
            //this.provider.goBackBy = 2;
            this.addpsa(null, null);
        });

        this.employeeService._removeEmployeeMobile.subscribe(() => {
            this.presentAlertConfirm();
        });
    }


    ngOnInit() {
    }


    getPes() {

        if (this.employee != null) {
            this.employeeService.getAllPesFromEmployee(this.employee.employee_ID).then(resultPes => {
                resultPes.forEach((pe) => {
                    if (this.availablePes.has(pe) !== true) {
                        this.availablePes.set(pe, []);
                    }
                });


                this.psaService.getPsasToEmployee(this.employee.employee_ID)
                    .then(data => {
                        this.employee.ppes = data['ppes'];
                    }).then(() => {
                        if (this.employee.ppes != undefined) {
                            this.employee.ppes.forEach((ppe) => {
                                for (let key of Array.from(this.availablePes.keys())) {
                                    if (key.pe_ID == ppe.pe.pe_ID) {
                                        this.availablePes.get(key).push(ppe);
                                    }
                                }
                            });
                        }
                    });
            }).catch(error => {
                this.errorService.error(error);
            });
        }
    }


    //only show address if employee got one
    public showAddress() {
        //No address in DB gives us null
        if (this.employee.address == null) {
            return false;
            //Add a new Employee without address input
        } else if (
            this.employee.address.address_additional == null &&
            this.employee.address.housenumber == null &&
            this.employee.address.place == null &&
            this.employee.address.postcode == null &&
            this.employee.address.street == null) {
            return false;
        }
        return true;
    }

    //alert for deleting person
    async presentAlertConfirm() {
        const alert = await
            this.alertCtrl.create({
                header: 'Person löschen',
                message: this.employee.name + ' wirklich löschen?',
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
                            this.deleteEmployee();
                        }
                    }
                ]
            });

        await
            alert.present();
    }

    public editEmployee() {
        let navigationExtras: NavigationExtras = {
            state: {
                employee: this.employee
            }
        };
        this.router.navigate(['users/employees/edit'], navigationExtras);
    }

    public deleteEmployee() {
        this.events.publish('deleteEmployee', this.employee);
        this.router.navigate(['users/employees']);
    }

    getRolesFromEmployee() {
        this.employeeService.getAllRolesFromEmployee(this.employee.employee_ID).then(result => {
            if (result == null) {
                this.employee.roles = [];
            } else {
                this.employee.roles = result;
            }
            this.events.publish('showEmployee', this.employee);
        }).catch(error => {
            this.errorService.error(error);
        });
    }

    public showEmployee(employee) {
        let navigationExtras: NavigationExtras = {
            state: {
                employee: employee,
                url: this.router.url
            }
        };
        this.router.navigate(['users/employees/show'], navigationExtras);
    }

    public showListEmployee() {
        this.router.navigate(['users/employees']);
    }

    public addpsa(employee, pe) {
        if (employee == null) {
            employee = this.employee;
        }
        let navigationExtras: NavigationExtras = {
            state: {
                employee: employee,
                pe: pe,
                url: this.router.url
            }
        };
        this.router.navigate(['users/employees/addpsa'], navigationExtras);
    }

    unassignone(ppe: PPE) {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({
            spinner: "circles"
        }).then(res => {
            loading = res;
            loading.present();
            this.companyService.getStock().then(stock => {
                this.employeeService.unassignOne(stock['stock_ID'], ppe)
                    .then(data => {
                        let index = this.employee.ppes.findIndex(search => search.sn === ppe.sn);
                        this.employee.ppes.splice(index, 1);
                        this.availablePes.clear();
                        this.getPes();
                        loading.dismiss();
                    }).catch(error => {
                        //Errorhandling
                        loading.dismiss();
                    })
            });
        });
    
    }

    //alert for remove psa
    async presentAlertConfirmUnassignOne( ppe: PPE) {
        const alert = await this.alertCtrl.create({
            header: 'PSA entfernen',
            message: '<strong>' + ppe.sn + '</strong> wirklich von <strong>' + this.employee.name + '</strong> entfernen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {

                    }
                }, {
                    text: 'Entfernen',
                    handler: () => {
                        this.unassignone(ppe);
                    }
                }
            ]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }
}
