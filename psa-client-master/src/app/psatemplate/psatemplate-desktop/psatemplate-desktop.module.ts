import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PsatemplateDesktopPage } from './psatemplate-desktop.page';


import { PsatemplateModule } from '../../components/psatemplate/psatemplate/psatemplate.module';

import { ListPsatemplateComponent } from '../../components/psatemplate/list-psatemplate/list-psatemplate.component';
import { ShowPsatemplateComponent } from '../../components/psatemplate/show-psatemplate/show-psatemplate.component';
const routes: Routes = [
  {
    path: '',
    component: PsatemplateDesktopPage
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

    ListPsatemplateComponent,
    ShowPsatemplateComponent
  ],
  declarations: [PsatemplateDesktopPage]
})
export class PsatemplateDesktopPageModule { }
