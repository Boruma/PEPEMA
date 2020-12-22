import { Component, OnInit } from '@angular/core';
import { PPE } from 'src/app/models/ppe';
import { ModalController } from '@ionic/angular';
import { EmployeeService } from '../../../services/employee.service';
import { Events } from '@ionic/angular';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PsaService } from '../../../services/psa.service';
import { AlertController } from '@ionic/angular';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { ProviderService } from '../../../services/provider.service';
import { Employee } from 'src/app/models/employee';
@Component({
    selector: 'app-show-psa',
    templateUrl: './show-psa.component.html',
    styleUrls: ['./show-psa.component.scss'],
})
export class ShowPsaComponent implements OnInit {

    private url: String;
    ppe: PPE;
    employee: Employee;

    constructor(public modalController: ModalController,
        private route: ActivatedRoute,
        private employeeService: EmployeeService,
        private events: Events,
        private router: Router,
        private loadingController: LoadingController,
        private psaService: PsaService,
        public alertController: AlertController,
        private errorService: ErrorhandlingService,
        private provider: ProviderService) {

        this.events.subscribe('showPpe', (newPpe) => {
            this.ppe = newPpe;
            if (this.ppe.employee_ID != null) {
                this.setEmployeeName();
            }
        });

        this.events.subscribe('updatePsaMobile', () => {
            if (this.ppe != null) {
                this.updatePsa(this.ppe);
            }
        });

        this.events.subscribe('deletePsaMobile', () => {
            if (this.ppe != null) {
                this.deletePsa(this.ppe);
            }
        });
    }

    ngOnInit() {
        this.route.params.forEach(params => {
           // This will be triggered every time the params change
        if (this.router.getCurrentNavigation().extras.state != null) {
            console.log("state")
            this.ppe = this.router.getCurrentNavigation().extras.state.ppe;
            if (this.ppe.employee_ID != null) {
                this.setEmployeeName();
            }
        } else {
            if (this.router.url == '/users/allppe') {
                console.log(this.router.url)
                this.router.navigate(['users/allppe']);
            } else {
                console.log(this.router.url)
                this.router.navigate(['users/ppe']);
            }
        }
        });
    }

    setEmployeeName() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();
            this.employeeService.getEmployee(this.ppe.employee_ID)
                .then(employee => {
                    this.employee = employee;
                    this.ppe.employee_name = employee.name;
                    loading.dismiss();
                })
                .catch(error => {
                    // Errorhandling
                    this.errorService.error(error);
                    loading.dismiss();
                });
        });
    }

    deletePsa(ppe) {
        this.presentAlertConfirmDelete(ppe);
    }

    async presentAlertConfirmDelete(ppe) {
        const alert = await this.alertController.create({
            header: 'PSA löschen',
            message: this.ppe.pe.name + ' wirklich löschen?',
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
                        let loading: HTMLIonLoadingElement;
                        this.loadingController.create({

                        }).then(res => {
                            loading = res;
                            loading.present();

                            this.psaService.deletePsa(ppe.sn)
                                .then(data => {
                                    this.ppe = null;
                                    this.events.publish('hidePpe');
                                    this.events.publish('updatePsas');
                                    this.router.navigate(['/users/ppe']);

                                }).catch(error => {

                                    this.errorService.error(error);
                                });
                            loading.dismiss();
                        });
                    }
                }
            ]
        });

        await alert.present();
    }


    updatePsa(ppe) {
        let navigationExtras: NavigationExtras = {
            state: {
                ppe: ppe
            }
        };
        this.router.navigate(['users/ppe/edit'], navigationExtras);
    }

    showEmployee() {
        let navigationExtras: NavigationExtras = {
            state: {
                employee: this.employee,
                url: this.router.url
            }
        };
        this.router.navigate(['/users/employees']);
        this.router.navigate(['/users/employees/show'], navigationExtras);
    }
}
