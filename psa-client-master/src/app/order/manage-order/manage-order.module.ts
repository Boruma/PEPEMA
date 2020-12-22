import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ManageOrderPage} from './manage-order.page';
import {ListOrdersComponentModule} from './../../components/order/list-orders/list-order-component.module';
import {ShowOrderComponentModule} from './../../components/order/show-order/show-order-component.module';

const routes: Routes = [
    {
        path: '',
        component: ManageOrderPage
    },
    {path: 'add', loadChildren: '../add-order/add-order.module#AddOrderPageModule', data: {title: 'Bestellung hinzufügen', showBackButton: true, savedMessage: true}},
    {path: 'edit', loadChildren: '../edit-order/edit-order.module#EditOrderPageModule', data: {title: 'Bestellung bearbeiten', showBackButton: true, savedMessage: true}},
    {path: 'show', loadChildren: '../show-order/show-order.module#ShowOrderPageModule', data: {title: 'Bestellungs-Info', showBackButton: true, savedMessage: false}},

];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListOrdersComponentModule,
        ShowOrderComponentModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ManageOrderPage]
})
export class ManageOrderPageModule {
}
