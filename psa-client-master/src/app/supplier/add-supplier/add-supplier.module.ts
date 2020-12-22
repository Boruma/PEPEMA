import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddSupplierPage } from './add-supplier.page';
import {AddSupplierComponent} from '../../components/supplier/add-supplier/add-supplier.component';

const routes: Routes = [
  {
    path: '',
    component: AddSupplierPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    AddSupplierComponent
  ],
  declarations: [AddSupplierPage, AddSupplierComponent]
})
export class AddSupplierPageModule {}
