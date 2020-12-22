import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelectSetupPage } from './select-setup.page';

const routes: Routes = [
  {
    path: '',
    component: SelectSetupPage
  },
  { path: 'supplier', loadChildren: '../supplier-setup/supplier-setup.module#SupplierSetupPageModule' },
  { path: 'create-supplier', loadChildren: '../create-supplier-setup/create-supplier-setup.module#CreateSupplierSetupPageModule' },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelectSetupPage]
})
export class SelectSetupPageModule { }
