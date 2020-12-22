import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FilterAllPipe } from '../../../pipes/app.filterall';

import { ListAllPsaComponent } from './list-allpsa.component';
import { AllPpeFilterComponent } from 'src/app/components/filter/allppe-filter/allppe-filter.component'

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
    ListAllPsaComponent
  ],
  entryComponents: [
    AllPpeFilterComponent
  ],
  declarations: [
    ListAllPsaComponent,
    FilterAllPipe,
    AllPpeFilterComponent,
  ],
})

export class ListAllPsaComponentModule { }
