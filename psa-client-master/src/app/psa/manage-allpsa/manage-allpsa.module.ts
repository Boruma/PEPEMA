import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ManageAllPsaPage } from './manage-allpsa.page';


import { ListAllPsaComponentModule } from '../../components/psa/list-allpsa/list-allpsa-component.module';
import { ShowPsaComponentModule } from '../../components/psa/show-psa/show-psa-component.module';

import { ListAllPsaComponent } from '../../components/psa/list-allpsa/list-allpsa.component';
import { ShowPsaComponent } from '../../components/psa/show-psa/show-psa.component';


const routes: Routes = [
  {
    path: '',
    component: ManageAllPsaPage
  },
  { path: 'add', loadChildren: '../add-psa/add-psa.module#AddPsaPageModule', data: { title: 'PSA hinzufügen', showBackButton: true, savedMessage: true } },
  { path: 'edit', loadChildren: '../edit-psa/edit-psa.module#EditPsaPageModule', data: { title: 'PSA bearbeiten', showBackButton: true, savedMessage: true } },
  { path: 'show', loadChildren: '../show-psa/show-psa.module#ShowPsaPageModule', data: { title: 'PSA-Info', showBackButton: true, savedMessage: false } },

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    ListAllPsaComponentModule,
    ShowPsaComponentModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    ListAllPsaComponent,
    ShowPsaComponent
  ],
  declarations: [ManageAllPsaPage]
})
export class ManageAllPsaPageModule { }
