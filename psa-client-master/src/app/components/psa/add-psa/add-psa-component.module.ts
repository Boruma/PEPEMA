import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AddPsaComponent } from './add-psa.component';

import { AddPropertyComponent } from '../../psatemplate/add-property/add-property.component';
import { AddSizerangeComponent } from '../../psatemplate/add-sizerange/add-sizerange.component';

import { PropertyModule } from '../../psatemplate/add-property/property.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    PropertyModule
  ],
  exports: [
    AddPsaComponent
  ],
  entryComponents: [
    AddPropertyComponent,
    AddSizerangeComponent
  ],
  providers: [
    BarcodeScanner
  ],
  declarations: [
    AddPsaComponent
  ],
})

export class AddPsaComponentModule { }
