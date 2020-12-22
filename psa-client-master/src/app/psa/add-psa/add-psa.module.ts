import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddPsaPage } from './add-psa.page';
import { AddPsaComponentModule } from '../../components/psa/add-psa/add-psa-component.module';

const routes: Routes = [
  {
    path: '',
    component: AddPsaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    FormsModule,
    IonicModule,
    AddPsaComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddPsaPage]
})
export class AddPsaPageModule {}
