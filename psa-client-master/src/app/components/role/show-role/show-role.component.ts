import { Component, OnInit } from '@angular/core';
import { Role } from '../../../models/role';
import { AlertController, Events } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { RoleService } from '../../../services/role.service';

@Component({
    selector: 'app-show-role',
    templateUrl: './show-role.component.html',
    styleUrls: ['./show-role.component.scss'],
})
export class ShowRoleComponent implements OnInit {

    role: Role;
    constructor(
        private events: Events,
        private alertCtrl: AlertController,
        private router: Router,
        private roleService: RoleService) {

        // shows different role
        this.events.subscribe('showRole', (newRole) => {
            this.role = newRole;
        });

        if (this.router.getCurrentNavigation().extras.state != null)
            this.role = this.router.getCurrentNavigation().extras.state.role;

        this.roleService._updateRoleMobile.subscribe(() => {
            //this.provider.goBackBy = 2;
            this.editRole(this.role);
        });


        this.roleService._removeRoleMobile.subscribe(() => {
            this.presentAlertConfirm();
        });
    }

    ngOnInit() {
        if (this.router.getCurrentNavigation().extras.state != null)
            this.role = this.router.getCurrentNavigation().extras.state.role;
    }

    public editRole(role) {

        let navigationExtras: NavigationExtras = {
            state: {
                role: role
            }
        };

        this.router.navigate(['users/roles/edit'], navigationExtras);
    }

    async presentAlertConfirm() {
        const alert = await this.alertCtrl.create({
            header: 'Rolle löschen',
            message: this.role.name + ' wirklich löschen?',
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
                        this.deleteRole();
                    }
                }
            ]
        });

        await alert.present();
        const result = await alert.onDidDismiss();
    }

    public deleteRole() {
        this.events.publish('deleteRole', this.role);
        this.router.navigate(['users/roles']);
    }
}
