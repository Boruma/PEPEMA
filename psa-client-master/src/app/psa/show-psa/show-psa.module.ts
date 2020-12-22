import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ShowPsaPage } from './show-psa.page';

import { ShowPsaComponentModule } from '../../components/psa/show-psa/show-psa-component.module';

const routes: Routes = [
  {
    path: '',
    component: ShowPsaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowPsaComponentModule,
    RouterModule.forChild(routes),

  ],
  declarations: [ShowPsaPage]
})
export class ShowPsaPageModule {}
