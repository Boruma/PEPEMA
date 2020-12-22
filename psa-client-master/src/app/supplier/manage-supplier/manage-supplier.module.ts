import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ManageSupplierPage } from './manage-supplier.page';
import { ListSupplierComponent } from '../../components/supplier/list-supplier/list-supplier.component';
import { ShowSupplierComponent } from '../../components/supplier/show-supplier/show-supplier.component';
import { SupplierModule } from '../../components/supplier/supplier.module';
const routes: Routes = [
  {
    path: '',
    component: ManageSupplierPage
  },

  { path: 'add', loadChildren: '../add-supplier/add-supplier.module#AddSupplierPageModule', data: { title: 'Lieferanten hinzufügen', showBackButton: true, savedMessage: true } },
  { path: 'edit', loadChildren: '../edit-supplier/edit-supplier.module#EditSupplierPageModule', data: { title: 'Lieferanten bearbeiten', showBackButton: true, savedMessage: true } },
  { path: 'show', loadChildren: '../show-supplier/show-supplier.module#ShowSupplierPageModule', data: { title: 'Lieferanten-Info', showBackButton: true, savedMessage: false } },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SupplierModule
  ],
  entryComponents: [
    ShowSupplierComponent,
    ListSupplierComponent
  ],
  declarations: [ManageSupplierPage]
})
export class ManageSupplierPageModule { }
