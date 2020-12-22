<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class role_employee extends Model
{
    //Validator Rules
    public static $rules = [
        'role_ID' => 'required',
        'employee_ID' => 'required'
    ];

    //PrimaryKey
    protected $primaryKey = 'role_emp_ID';

    //Relations
    public function role()
    {
        return $this->belongsTo('App\Role', 'role_ID', 'role_ID');
    }

    public function employee()
    {
        return $this->belongsTo('App\Employee', 'employee_ID', 'employee_ID');
    }
}
