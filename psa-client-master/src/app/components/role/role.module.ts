import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ShowRoleComponent } from './show-role/show-role.component';
import { ListRolesComponent } from './list-roles/list-roles.component';

const routes: Routes = [

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    ShowRoleComponent,
    ListRolesComponent
  ],
  declarations: [ShowRoleComponent, ListRolesComponent],

})
export class RoleModule { }
