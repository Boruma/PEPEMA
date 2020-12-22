import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditOrderPage } from './edit-order.page';
import { EditOrderComponentModule } from './../../components/order/edit-order/edit-order-component.module';


const routes: Routes = [
  {
    path: '',
    component: EditOrderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditOrderComponentModule,
    RouterModule.forChild(routes),

  ],
  declarations: [EditOrderPage]
})
export class EditOrderPageModule {}
