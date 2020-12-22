import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddRolePage } from './add-role.page';

import {AddRoleComponent} from '../../components/role/add-role/add-role.component';


const routes: Routes = [
  {
    path: '',
    component: AddRolePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    AddRoleComponent
  ],
  declarations: [AddRolePage, AddRoleComponent]
})
export class AddRolePageModule {}
