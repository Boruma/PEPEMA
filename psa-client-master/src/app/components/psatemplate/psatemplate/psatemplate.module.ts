import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ShowPsatemplateComponent } from '../show-psatemplate/show-psatemplate.component';
import { ListPsatemplateComponent } from '../list-psatemplate/list-psatemplate.component';



const routes: Routes = [
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    ShowPsatemplateComponent,
    ListPsatemplateComponent,
   
  ],
  declarations: [ShowPsatemplateComponent, ListPsatemplateComponent],
  
})
export class PsatemplateModule { }
