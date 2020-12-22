<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    //Validator Rules
    public static $rules = [
        'name' => 'required|min:2|max:50',
    ];

    //PrimaryKey
    protected $primaryKey = 'role_ID';

    //Relations
    public function company()
    {
        return $this->belongsTo('App\Company', 'company_ID', 'company_ID');
    }

    public function pes()
    {
        return $this->belongsToMany('App\Pe', 'role_pes', 'role_ID', 'pe_ID');
    }

    public function employees()
    {
        return $this->belongsToMany('App\Employee', 'role_employees', 'role_ID', 'employee_ID');
    }

}
