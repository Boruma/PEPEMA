import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShowRolePage } from './show-role.page';


import { RoleModule } from '../../components/role/role.module';
import { ShowRoleComponent } from '../../components/role/show-role/show-role.component';

const routes: Routes = [
  {
    path: '',
    component: ShowRolePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    RoleModule
  ],
  entryComponents: [
    ShowRoleComponent
  ],
  declarations: [ShowRolePage]
})
export class ShowRolePageModule {}
