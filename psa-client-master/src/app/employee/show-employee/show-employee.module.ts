import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShowEmployeePage } from './show-employee.page';
import { ShowEmployeeComponentModule } from './../../components/employee/show-employee/show-employee-component.module';
import { EmployeeModule } from '../../components/employee/employee.module';

import { ShowEmployeeComponent } from '../../components/employee/show-employee/show-employee.component';

const routes: Routes = [
  {
    path: '',
    component: ShowEmployeePage
  },
  { path: 'edit', loadChildren: '../edit-employee/edit-employee.module#EditEmployeePageModule' }

];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    EmployeeModule
  ],
  entryComponents: [
    ShowEmployeeComponent
  ],
  declarations: [ShowEmployeePage]
})
export class ShowEmployeePageModule { }
