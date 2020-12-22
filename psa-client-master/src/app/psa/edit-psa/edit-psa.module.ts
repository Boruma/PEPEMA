import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditPsaPage } from './edit-psa.page';

import { EditPsaComponentModule } from '../../components/psa/edit-psa/edit-psa-component.module';


const routes: Routes = [
  {
    path: '',
    component: EditPsaPage
  },{
    path: ':id',
    component: EditPsaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    FormsModule,
    IonicModule,
    EditPsaComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditPsaPage]
})
export class EditPsaPageModule {}
