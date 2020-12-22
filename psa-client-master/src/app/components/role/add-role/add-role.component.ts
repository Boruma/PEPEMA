import { Component, OnInit } from '@angular/core';
import { Events, LoadingController } from '@ionic/angular';
import { ErrorhandlingService } from '../../../services/errorhandling.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../services/role.service';
import { Router, NavigationExtras } from '@angular/router';
import { Address } from '../../../models/address';
import { Employee } from '../../../models/employee';
import { Role } from '../../../models/role';

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.scss'],
})
export class AddRoleComponent implements OnInit {

    createForm: FormGroup;
    role: Role = {} as Role;

    attemptedSubmit = false;
    roleAdded = false;

    roleExists: boolean = false;

    constructor(public formBuilder: FormBuilder,
        private roleService: RoleService,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private router: Router,
        private events: Events) {
        this.createForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
        });
    }

    createRole() {
        this.attemptedSubmit = true;
        if (this.createForm.valid) {
            let loading: HTMLIonLoadingElement;
            this.loadingController.create({

            }).then(res => {
                loading = res;
                loading.present();
                this.roleService.createRole(this.createForm.value.name)
                    .then(newRole => {

                        this.attemptedSubmit = false;
                        this.markFieldsReset();
                        loading.dismiss();

                        this.events.publish('addRole', (newRole));
                        this.events.publish('showRole', (newRole));

                        this.role = {} as Role;
                        this.router.navigate(['users/roles']);
                    })
                    .catch(error => {
                        if (error.error.message.indexOf("Duplicate entry") >= 0) {
                            this.roleExists = true;
                        } else {
                            // Errorhandling
                            this.errorService.error(error);

                        }
                        loading.dismiss();
                    });
            });
        } else {
            this.markFieldsDirty();
        }
    }

    markFieldsDirty() {
        for (const field in this.createForm.controls) {
            this.createForm.controls[field].markAsDirty();
        }
    }

    markFieldsReset() {
        for (const field in this.createForm.controls) {
            this.createForm.controls[field].reset();
        }
    }

    ngOnInit() {
    }

    // error messages for different errors
    validation_messages = {
        name: [
            { type: 'required', message: 'Bitte einen gültigen Namen eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 50 Zeichen bestehen.' }
        ]
    };

}
