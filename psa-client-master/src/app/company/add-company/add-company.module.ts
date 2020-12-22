import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddCompanyPage } from './add-company.page';

const routes: Routes = [
  {
    path: '',
    component: AddCompanyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddCompanyPage]
})
export class AddCompanyPageModule { }
