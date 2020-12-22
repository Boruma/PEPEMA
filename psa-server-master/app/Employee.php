<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    //Validator Rules
    public static $rules = [
        'name' => 'required|min:2|max:50',
        'phonenumber' => 'max:20|nullable',
        'email' => 'max:40|nullable'
    ];

    //PrimaryKey
    protected $primaryKey = 'employee_ID';


    //Relations
    public function company()
    {
        return $this->belongsTo('App\Company', 'company_ID', 'company_ID');
    }

    public function address()
    {
        return $this->hasMany('App\Address', 'address_ID', 'address_ID');
    }

    public function roles()
    {
        return $this->belongsToMany('App\Role', 'role_employees', 'employee_ID', 'role_ID');
    }
}
