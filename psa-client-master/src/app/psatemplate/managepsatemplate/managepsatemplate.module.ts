import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ManagepsatemplatePage } from './managepsatemplate.page';



import { PsatemplateModule } from '../../components/psatemplate/psatemplate/psatemplate.module';

import { ListPsatemplateComponent } from '../../components/psatemplate/list-psatemplate/list-psatemplate.component';
import { ShowPsatemplateComponent } from '../../components/psatemplate/show-psatemplate/show-psatemplate.component';

const routes: Routes = [
  {
    path: '',
    component: ManagepsatemplatePage
  },
  { path: 'add', loadChildren: './../addpsatemplate/addpsatemplate.module#AddpsatemplatePageModule', data: { title: 'PSA-Schablone hinzufügen', showBackButton: true, savedMessage: true } },
  { path: 'edit', loadChildren: './../editapsatemplate/editapsatemplate.module#EditapsatemplatePageModule', data: { title: 'PSA-Schablone bearbeiten', showBackButton: true, savedMessage: true } },
  { path: 'details', loadChildren: './../detailspsatemplate/detailspsatemplate.module#DetailspsatemplatePageModule', data: { title: 'PSA-Schablonen-Info', showBackButton: true, savedMessage: false } }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PsatemplateModule
  ],
  entryComponents: [

    ListPsatemplateComponent,
    ShowPsatemplateComponent
  ],
  declarations: [ManagepsatemplatePage]
})
export class ManagepsatemplatePageModule { }
