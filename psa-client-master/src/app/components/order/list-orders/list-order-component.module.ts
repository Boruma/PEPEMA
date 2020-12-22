import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListOrdersComponent } from './list-orders.component';
import { from } from 'rxjs';
import { OrderFiltersComponent } from 'src/app/components/filter/order-filters/order-filters.component'
import { FilterPipeSupplier } from '../../../pipes/app.filter_supplier';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
  ],
  exports: [
    ListOrdersComponent
  ],
  entryComponents: [
    OrderFiltersComponent
  ],
  declarations: [
    ListOrdersComponent,
    OrderFiltersComponent,
    FilterPipeSupplier
  ],
})

export class ListOrdersComponentModule { }


