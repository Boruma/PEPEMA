import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditRolePage } from './edit-role.page';


import {EditRoleComponent} from '../../components/role/edit-role/edit-role.component';


const routes: Routes = [
  {
    path: '',
    component: EditRolePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    EditRoleComponent
  ],
  declarations: [EditRolePage, EditRoleComponent]
})
export class EditRolePageModule {}
