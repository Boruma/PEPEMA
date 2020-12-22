import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddOrderComponent } from './add-order.component';
import { CreatePsaComponentModule } from '../../psa/create-psa/create-psa-component.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CreatePsaComponentModule,
        ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    ],
    exports: [
        AddOrderComponent
    ],
    declarations: [
        AddOrderComponent
    ],
})

export class AddOrderComponentModule {
}


