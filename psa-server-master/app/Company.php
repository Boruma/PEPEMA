<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    //Validator Rules
    public static $rules = [
        'name' => 'required|min:2',
    ];

    //PrimaryKey
    protected $primaryKey = 'company_ID';


    //Relations
    public function users()
    {
        return $this->hasMany('App\User');
    }

    public function employees()
    {
        return $this->hasMany('App\Employee', 'company_ID', 'company_ID');
    }

    public function ppe()
    {
        return $this->hasMany('App\Ppe', 'sn', 'sn');
    }

    public function roles()
    {
        return $this->hasMany('App\Role', 'role_ID', 'role_ID');
    }

    public function suppliers()
    {
        return $this->hasMany('App\Supplier', 'supplier_ID', 'supplier_ID');
    }

    public function pes()
    {
        return $this->hasMany('App\Pe', 'pe_ID', 'pe_ID');
    }

    public function address()
    {
        return $this->hasOne('App\address_ID', 'address_ID', 'address_ID');
    }

    public function stocks()
    {
        return $this->hasMany('App\Stock', 'stock_ID', 'stock_ID');
    }
}
