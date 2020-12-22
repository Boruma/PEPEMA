import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'company/add',
        loadChildren: '../company/add-company/add-company.module#AddCompanyPageModule',
        data: { title: 'Unternehmen hinzufügen' }
    },
    { path: 'roles', loadChildren: '../role/manage-role/manage-role.module#ManageRolePageModule', data: { title: 'Rollenverwaltung' } },
    {
        path: 'employees',
        loadChildren: '../employee/manage-employee-app-view/manage-employee-app-view.module#ManageEmployeeAppViewPageModule',
        data: { title: 'Personenverwaltung' }
    },
    { path: 'signup', loadChildren: '../user/signup/signup.module#SignupPageModule', data: { title: 'Registrieren' } },
    { path: 'logout', loadChildren: '../user/logout/logout.module#LogoutPageModule', data: { title: 'Ausloggen' } },
    { path: 'ppe', loadChildren: '../psa/manage-psa/manage-psa.module#ManagePsaPageModule', data: { title: 'Lager' } },
    { path: 'allppe', loadChildren: '../psa/manage-allpsa/manage-allpsa.module#ManageAllPsaPageModule', data: { title: 'PSA Bestand' } },
    { path: 'setup', loadChildren: '../setup/select-setup/select-setup.module#SelectSetupPageModule', data: { title: 'Setup' } },
    {
        path: 'supplier',
        loadChildren: '../supplier/manage-supplier/manage-supplier.module#ManageSupplierPageModule',
        data: { title: 'Lieferantenverwaltung' }
    },
    {
        path: 'orders',
        loadChildren: '../order/manage-order/manage-order.module#ManageOrderPageModule',
        data: { title: 'Bestellungsverwaltung' }
    },
    {
        path: 'pe',
        loadChildren: '../psatemplate/managepsatemplate/managepsatemplate.module#ManagepsatemplatePageModule',
        data: { title: 'PSA-Schablonenverwaltung' }
    },
    { path: 'settings', loadChildren: '../settings/settings.module#SettingsPageModule', data: { title: 'Einstellungen' } }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}
