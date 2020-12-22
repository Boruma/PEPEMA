import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ShowEmployeeComponent } from './show-employee/show-employee.component';
import { ListEmployeesComponent } from './list-employees/list-employees.component';

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
    ShowEmployeeComponent,
    ListEmployeesComponent
  ],
  declarations: [ShowEmployeeComponent, ListEmployeesComponent],

})
export class EmployeeModule { }
