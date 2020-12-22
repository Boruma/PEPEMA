import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShowSupplierPage } from './show-supplier.page';
import { ShowSupplierComponent}from '../../components/supplier/show-supplier/show-supplier.component';
import { SupplierModule } from '../../components/supplier/supplier.module';
const routes: Routes = [
  {
    path: '',
    component: ShowSupplierPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SupplierModule
  ],
  entryComponents: [
    ShowSupplierComponent
  ],
  declarations: [ShowSupplierPage]
})
export class ShowSupplierPageModule {}
