import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreatePsaPage } from './create-psa.page';
import { CreatePsaComponentModule } from '../../components/psa/create-psa/create-psa-component.module';

const routes: Routes = [
  {
    path: '',
    component: CreatePsaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePsaComponentModule,  
    RouterModule.forChild(routes)
  ],
  declarations: [CreatePsaPage]
})
export class CreatePsaPageModule {}
