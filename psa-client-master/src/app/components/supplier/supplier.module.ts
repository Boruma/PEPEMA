import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ShowSupplierComponent } from './show-supplier/show-supplier.component';
import { ListSupplierComponent } from './list-supplier/list-supplier.component';

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
    ShowSupplierComponent,
    ListSupplierComponent
  ],
  declarations: [ShowSupplierComponent, ListSupplierComponent],
  
})
export class SupplierModule { }
