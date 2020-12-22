import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditEmployeePage } from './edit-employee.page';
import { EditEmployeeComponentModule } from './../../components/employee/edit-employee/edit-employee-component.module';


const routes: Routes = [
  {
    path: '',
    component: EditEmployeePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    EditEmployeeComponentModule
  ],
  entryComponents: [
  ],
  declarations: [EditEmployeePage]
})
export class EditEmployeePageModule { }
