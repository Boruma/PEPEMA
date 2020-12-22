import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditSupplierPage } from './edit-supplier.page';
import {EditSupplierComponent} from '../../components/supplier/edit-supplier/edit-supplier.component';

const routes: Routes = [
  {
    path: '',
    component: EditSupplierPage
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
    EditSupplierComponent
  ],
  declarations: [EditSupplierPage, EditSupplierComponent]
})
export class EditSupplierPageModule {}
