import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddOrderPage } from './add-order.page';
import { AddOrderComponentModule } from './../../components/order/add-order/add-order-component.module';
import { CreatePsaComponentModule } from './../../components/psa/create-psa/create-psa-component.module';

const routes: Routes = [
  {
    path: '',
    component: AddOrderPage
  },
  { path: 'createPsa', loadChildren: '../create-psa/create-psa.module#CreatePsaPageModule', data: { title: 'Artikel hinzufügen' } }

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddOrderComponentModule,
    CreatePsaComponentModule,

    RouterModule.forChild(routes)

  ],
  declarations: [AddOrderPage]
})
export class AddOrderPageModule { }
