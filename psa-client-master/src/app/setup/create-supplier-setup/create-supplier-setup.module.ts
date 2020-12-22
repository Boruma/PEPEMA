import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateSupplierSetupPage } from './create-supplier-setup.page';
import { ListSupplierComponent } from '../../components/supplier/list-supplier/list-supplier.component';
import { ShowSupplierComponent } from '../../components/supplier/show-supplier/show-supplier.component';
import { SupplierModule } from '../../components/supplier/supplier.module';

const routes: Routes = [
  {
    path: '',
    component: CreateSupplierSetupPage
  },
  { path: 'add', loadChildren: '../../supplier/add-supplier/add-supplier.module#AddSupplierPageModule', data: { title: 'Lieferanten hinzufügen', showBackButton: true, savedMessage: true } },
  { path: 'edit', loadChildren: '../../supplier/edit-supplier/edit-supplier.module#EditSupplierPageModule', data: { title: 'Lieferanten bearbeiten', showBackButton: true, savedMessage: true } },
  { path: 'show', loadChildren: '../../supplier/show-supplier/show-supplier.module#ShowSupplierPageModule', data: { title: 'Lieferanten-Info', showBackButton: true, savedMessage: false } },
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
  declarations: [CreateSupplierSetupPage]
})
export class CreateSupplierSetupPageModule { }
