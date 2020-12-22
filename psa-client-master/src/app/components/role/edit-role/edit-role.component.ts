import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../../models/role';
import { AlertController, Events, LoadingController } from '@ionic/angular';
import { ErrorhandlingService } from '../../../services/errorhandling.service';
import { Router} from '@angular/router';
import { RoleService } from '../../../services/role.service';

@Component({
    selector: 'app-edit-role',
    templateUrl: './edit-role.component.html',
    styleUrls: ['./edit-role.component.scss'],
})
export class EditRoleComponent implements OnInit {

    createForm: FormGroup;

    role: Role = {} as Role;
    originRole: Role;
    id: number;
    roleExists: boolean = false;

    constructor(public formBuilder: FormBuilder,
        private roleService: RoleService,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private router: Router,
        private events: Events,
        private alertCtrl: AlertController) {

        if (this.router.getCurrentNavigation() != null && this.router.getCurrentNavigation().extras.state != null) {
            this.originRole = this.router.getCurrentNavigation().extras.state.role;

        } else {
            this.router.navigate(['users/roles']);
        }

        this.role = roleService.copyRole(this.originRole);


        this.createForm = this.formBuilder.group({
            id: ['',],
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        });

        this.events.subscribe('editRole', (role) => {
            this.role = role;
        });

    }

    // error Messages
    validation_messages = {
        name: [
            { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 50 Zeichen bestehen.' }
        ]
    };

    ngOnInit() {
    }

    async presentAlertConfirm() {
        const alert = await this.alertCtrl.create({
            header: 'Rolle ändern',
            message: this.role.name + ' wirklich ändern?',
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
                        this.editRole();
                    }
                }
            ]
        });
        await alert.present();
        const result = await alert.onDidDismiss();
    }

    // edits the values of a role
    editRole() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({

        }).then(res => {
            loading = res;
            loading.present();
            this.roleService.editRole(this.createForm.value.name, this.originRole.role_ID).then(role => {
                loading.dismiss();
                this.originRole = role;
                this.events.publish('showRole', (this.originRole));

                this.events.publish('updateRoles', (this.originRole));
                this.router.navigate(['users/roles']);
            })
                .catch(error => {
                    // Errorhandling
                    if (error.error.message.indexOf("Duplicate entry") >= 0) {
                        this.roleExists = true;
                    } else {
                        // Errorhandling
                        this.errorService.error(error);

                    }
                    loading.dismiss();
                   
                });
        });
    }

    private showRole() {
        this.events.publish('showRole', (this.role));

    }

    // gets the information for a role
    getRole($id) {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({

        }).then(res => {
            loading = res;
            loading.present();
            this.roleService.getRole($id).then(role => {
                loading.dismiss();
            })
                .catch(error => {
                    // Errorhandling
                    this.errorService.error(error);
                    loading.dismiss();
                });
        });
    }

}
