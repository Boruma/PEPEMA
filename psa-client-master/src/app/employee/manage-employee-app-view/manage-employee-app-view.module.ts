import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ManageEmployeeAppViewPage } from './manage-employee-app-view.page';
import { EmployeeModule } from '../../components/employee/employee.module';

import { ListEmployeesComponent } from '../../components/employee/list-employees/list-employees.component';
import { ShowEmployeeComponent } from '../../components/employee/show-employee/show-employee.component';



const routes: Routes = [
  {
    path: '',
    component: ManageEmployeeAppViewPage
  },
  { path: 'add', loadChildren: '../add-employee/add-employee.module#AddEmployeePageModule', data: { title: 'Person hinzufügen', showBackButton: true, savedMessage: true } },
  { path: 'edit', loadChildren: '../edit-employee/edit-employee.module#EditEmployeePageModule', data: { title: 'Person bearbeiten', showBackButton: true, savedMessage: true } },
  { path: 'show', loadChildren: '../show-employee/show-employee.module#ShowEmployeePageModule', data: { title: 'Personen-Info', showBackButton: true, savedMessage: false } },
  { path: 'addpsa', loadChildren: '../psatoemployee/psatoemployee.module#PsatoemployeePageModule', data: { title: 'PSA zuordnen', showBackButton: true, savedMessage: false } },


];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }), FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    EmployeeModule
  ],
  entryComponents: [
    ShowEmployeeComponent,
    ListEmployeesComponent
  ],
  declarations: [ManageEmployeeAppViewPage]
})
export class ManageEmployeeAppViewPageModule { }
