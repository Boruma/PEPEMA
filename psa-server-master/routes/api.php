<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => ['cors'],
], function () {

    //User
    Route::post('register', 'Auth\RegisterController@register');
    Route::auth();
    //add Company
    Route::post('company', 'CompanyController@setOne');
    Route::get('companies', 'CompanyController@getAll');


    //Routes only for logged in users
    Route::group([
        'middleware' => ['auth:api'],
    ], function () {
        //User
        Route::get('logout', 'UsersController@logout');
        Route::get('user', 'UsersController@getOne');

        //Company
        Route::delete('company/{id}', 'CompanyController@deleteOne');
        Route::get('company', 'CompanyController@getOne');
        Route::put('company', 'CompanyController@setOne');
        Route::get('stock', 'CompanyController@getStock');

        //Employee
        Route::put('employee', 'EmployeeController@setOne');
        Route::post('employee', 'EmployeeController@setOne');
        Route::get('employee', 'EmployeeController@getAll');
        Route::get('employee/{id}', 'EmployeeController@getOne');
        Route::delete('employee/{id}', 'EmployeeController@deleteOne');
        Route::delete('employee', 'EmployeeController@deleteAll');
        Route::post('employee/assignRole', 'EmployeeController@assignRole');
        Route::post('employee/unassignRole', 'EmployeeController@unassignRole');
        Route::get('employee/roles/{id}', 'EmployeeController@getAllRoles');

        //PPE
        Route::post('ppe/all', 'PpeController@getAll');
        Route::get('ppe/{id}', 'PpeController@getOne');
        Route::post('ppe/allCompany', 'PpeController@getAllCompany');
        Route::post('ppe', 'PpeController@postOne');
        Route::put('ppe', 'PpeController@updateOne');
        Route::delete('ppe/{id}', 'PpeController@deleteOne');
        Route::post('ppe/assign', 'PpeController@assignOne');
        Route::post('ppe/unassign', 'PpeController@unassignOne');
        Route::post('ppe/delivered', 'PpeController@deliveredPPE');

        //PE
        Route::get('pe', 'PeController@getAll');
        Route::get('pe/{id}', 'PeController@getOne');
        Route::post('pe', 'PeController@setOne');
        Route::put('pe', 'PeController@updateOne');
        Route::delete('pe/{id}', 'PeController@deleteOne');
        Route::post('pe/assignRole', 'PeController@assignRole');
        Route::post('pe/unassignRole', 'PeController@unassignRole');

        //Role
        Route::get('role', 'RoleController@getAll');
        Route::get('role/{id}', 'RoleController@getOne');
        Route::post('role', 'RoleController@setOne');
        Route::put('role', 'RoleController@setOne');
        Route::delete('role/{id}', 'RoleController@deleteOne');
        Route::delete('role', 'RoleController@deleteAll');
        Route::get('role/pes/{id}', 'RoleController@getAllPesFromEmployee');

        //Supplier
        Route::get('supplier', 'SupplierController@getAll');
        Route::get('supplier/{id}', 'SupplierController@getOne');
        Route::get('supplier/pes/{id}', 'SupplierController@getPes');
        Route::post('supplier', 'SupplierController@setOne');
        Route::put('supplier', 'SupplierController@updateOne');
        Route::delete('supplier/{id}', 'SupplierController@deleteOne');

        //Order
        Route::get('order', 'OrderEntController@getAll');
        Route::delete('order', 'OrderEntController@deleteAll');
        Route::post('order', 'OrderEntController@setOne');
        Route::put('order', 'OrderEntController@setOne');
        Route::get('order/{id}', 'OrderEntController@getOne');
        Route::get('order/supplier/{id}', 'OrderEntController@getAllSupp');
        Route::delete('order/{id}', 'OrderEntController@deleteOne');
        Route::put('order/delivered/{id}', 'OrderEntController@orderDelivered');
        Route::put('order/commited/{id}', 'OrderEntController@orderCommited');
    });
});
