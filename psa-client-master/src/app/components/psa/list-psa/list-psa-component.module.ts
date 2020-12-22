import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FilterPipe } from '../../../pipes/app.filter';

import { ListPsaComponent } from './list-psa.component';
import { PpeFilterComponent } from 'src/app/components/filter/ppe-filter/ppe-filter.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
  ],
  providers: [
    BarcodeScanner
  ],
  exports: [
    ListPsaComponent
  ],
  entryComponents: [
    PpeFilterComponent
  ],
  declarations: [
    ListPsaComponent,
    FilterPipe,
    PpeFilterComponent,
  ],
})

export class ListPsaComponentModule { }
