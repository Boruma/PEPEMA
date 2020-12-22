import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShowOrderPage } from './show-order.page';
import { ShowOrderComponentModule } from './../../components/order/show-order/show-order-component.module';
import { CreatePsaComponentModule } from './../../components/psa/create-psa/create-psa-component.module';

const routes: Routes = [
  {
    path: '',
    component: ShowOrderPage
  },
  { path: 'createPsa', loadChildren: '../create-psa/create-psa.module#CreatePsaPageModule', data:{title: 'Artikel hinzufügen', showBackButton: true, savedMessage: true}  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowOrderComponentModule,
    CreatePsaComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ShowOrderPage]
})
export class ShowOrderPageModule {}
