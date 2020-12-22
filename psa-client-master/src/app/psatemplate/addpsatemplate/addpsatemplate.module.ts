import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { AddpsatemplatePage } from './addpsatemplate.page';
import { HttpClientModule} from '@angular/common/http';

import { AddPropertyComponent } from '.././../components/psatemplate/add-property/add-property.component';
import { AddSizerangeComponent } from '.././../components/psatemplate/add-sizerange/add-sizerange.component';

import { PropertyModule } from '../../components/psatemplate/add-property/property.module';

const routes: Routes = [
  {
    path: '',
    component: AddpsatemplatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    RouterModule.forChild(routes),
    PropertyModule
  ],
  entryComponents: [
    AddPropertyComponent,
    AddSizerangeComponent
  ],
  declarations: [AddpsatemplatePage]
})
export class AddpsatemplatePageModule {}
