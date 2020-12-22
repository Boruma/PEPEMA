import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddEmployeePage } from './add-employee.page';

import { AddEmployeeComponentModule } from './../../components/employee/add-employee/add-employee-component.module';

const routes: Routes = [
  {
    path: '',
    component: AddEmployeePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AddEmployeeComponentModule
  ],
  declarations: [AddEmployeePage]
})
export class AddEmployeePageModule { }
