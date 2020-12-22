import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SupplierSetupPage } from './supplier-setup.page';

const routes: Routes = [
  {
    path: '',
    component: SupplierSetupPage
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
  declarations: [SupplierSetupPage]
})
export class SupplierSetupPageModule {}
