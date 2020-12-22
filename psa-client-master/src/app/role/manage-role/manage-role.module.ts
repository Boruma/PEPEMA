import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ManageRolePage } from './manage-role.page';
import { RoleModule } from '../../components/role/role.module';

import { ListRolesComponent } from '../../components/role/list-roles/list-roles.component';
import { ShowRoleComponent } from '../../components/role/show-role/show-role.component';



const routes: Routes = [
    {
        path: '',
        component: ManageRolePage
    },
    { path: 'add', loadChildren: '../add-role/add-role.module#AddRolePageModule', data: { title: 'Rolle hinzufügen', showBackButton: true, savedMessage: true } },
    { path: 'edit', loadChildren: '../edit-role/edit-role.module#EditRolePageModule', data: { title: 'Rolle bearbeiten', showBackButton: true, savedMessage: true } },
    { path: 'show', loadChildren: '../show-role/show-role.module#ShowRolePageModule', data: { title: 'Rollen-Info', showBackButton: true, savedMessage: false } },

];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        RoleModule
    ],
    entryComponents: [
        ShowRoleComponent,
        ListRolesComponent
    ],
    declarations: [ManageRolePage]
})
export class ManageRolePageModule {
}
