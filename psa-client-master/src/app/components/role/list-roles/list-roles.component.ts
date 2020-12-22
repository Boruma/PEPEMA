import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Role } from '../../../models/role';
import { Events, LoadingController } from '@ionic/angular';
import { ErrorhandlingService } from '../../../services/errorhandling.service';
import { FormBuilder } from '@angular/forms';
import { RoleService } from '../../../services/role.service';
import { ManageRolePage } from '../../../role/manage-role/manage-role.page';
import { Router, NavigationExtras } from '@angular/router';
import { ProviderService } from '../../../services/provider.service';

@Component({
    selector: 'app-list-roles',
    templateUrl: './list-roles.component.html',
    styleUrls: ['./list-roles.component.scss'],
})
export class ListRolesComponent implements OnInit {

    // list of all roles
    roles: Role[];


    private rolesForSearch: Role[];
    // index of current role
    public listIndex: number;


    constructor(public formBuilder: FormBuilder,
        private roleService: RoleService,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private manageRole: ManageRolePage,
        private events: Events,
        private changeDetector: ChangeDetectorRef,
        private router: Router,
        private provider: ProviderService) {

        this.events.subscribe('deleteRole', (role) => {
            this.deleteRole(role.role_ID);
            this.listIndex = -1;
            //this.changeDetector.detectChanges();
        });

        this.events.subscribe('updateRoles', (role) => {
            this.getAllRoles();
        });

        this.events.subscribe('addRole', (newRole) => {
            this.roles.push(newRole);
            this.listIndex = this.roles.indexOf(newRole);
            this.changeDetector.detectChanges();
        });

        this.events.subscribe('addRoleMobile', () => {

            this.addRole();
        });


    }

    ngOnInit() {
        this.getAllRoles();
    }

    onSearchTerm(ev: CustomEvent) {
        this.roles = this.rolesForSearch;

        const val = ev.detail.value;
        if (val.trim() !== '') {
            this.roles = this.roles.filter(term => {
                return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
        }
    }

    //Array to fill the Dropdown List
    public dropdownOptions = [
        {id: 0, val: 'Rollen sortieren'},
        { id: 1, val: 'A-Z' },
        { id: 2, val: 'Z-A' }
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
            default:
                break;
        }

    }

    sortasc() {
        this.roles.sort((a, b) => (a.name > b.name) ? 1 : -1);
    }

    sortdesc() {
        this.roles.sort((a, b) => (a.name < b.name) ? 1 : -1);
    }

    // returns array index of role
    private getIndex(role: Role) {
        for (const index in this.roles) {
            if (this.roles[index].role_ID === role.role_ID) {
                return this.roles.indexOf(this.roles[index]);
            }
        }
        return -1;
    }

    // reads in all roles and saves them to array
    async getAllRoles() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();
            this.roleService.getRoles().then(result => {
                loading.dismiss();
                this.roles = result;
                this.rolesForSearch = result;
                const tmpRole: Role = this.manageRole.getRole();
                if (tmpRole == null) {
                    this.listIndex = -1;
                } else {
                    this.listIndex = this.getIndex(tmpRole);
                }

            })
                .catch(error => {
                    loading.dismiss();
                    this.errorService.error(error);
                });
        });
    }

    // sets the component
    public showRole(role) {
        let navigationExtras: NavigationExtras = {
            state: {
                role: role
            }
        };
        this.router.navigate([this.router.url + '/show'], navigationExtras);
    }

    public showRoleDesktop(role) {
        this.events.publish('showRole', (role));
        this.manageRole.setRole(role);
        this.manageRole.setComponentID(1);
    }

    public addRole() {
        this.router.navigate([this.router.url + '/add']);
    }

    public deleteRole(id) {

        // delete in server
        this.roleService.deleteRole(id).then(res => {
        });
        // delete in array
        this.roles.splice(this.roles.findIndex(role => role.role_ID === id), 1);
        this.manageRole.setRole(null);
        this.manageRole.setComponentID(0);

        this.router.navigate(['users/roles']);
    }

    setListIndex(id: number): void {
        this.listIndex = id;
    }
}
