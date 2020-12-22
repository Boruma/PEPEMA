import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from './guards/auth.guard';

const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    // set route and title through data object. Header can be hidden with data: {showHeader: 'false'}
    {path: 'login', loadChildren: './user/login/login.module#LoginPageModule', data: {title: 'Login'}},
    {
        path: 'initSignup',
        loadChildren: './user/init-signup/init-signup.module#InitSignupPageModule',
        data: {title: 'Neues Unternehmen anlegen'}
    },
    {
        path: 'users',
        canActivate: [AuthGuardService],
        loadChildren: './user/user-routing.module#UserRoutingModule'
    },
    
 
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
