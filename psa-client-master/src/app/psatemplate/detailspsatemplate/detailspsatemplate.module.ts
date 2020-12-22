import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailspsatemplatePage } from './detailspsatemplate.page';
;
import { PsatemplateModule } from '../../components/psatemplate/psatemplate/psatemplate.module';

import { ShowPsatemplateComponent } from '../../components/psatemplate/show-psatemplate/show-psatemplate.component';

const routes: Routes = [
  {
    path: '',
    component: DetailspsatemplatePage
  }
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
    ShowPsatemplateComponent
  ],
  declarations: [DetailspsatemplatePage]
})
export class DetailspsatemplatePageModule { }
