import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AddPropertyComponent } from './add-property.component';
import { AddSizerangeComponent } from '../add-sizerange/add-sizerange.component';


const routes: Routes = [

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    AddPropertyComponent,
    AddSizerangeComponent
  ],
  declarations: [AddPropertyComponent, AddSizerangeComponent],
  
})
export class PropertyModule { }
