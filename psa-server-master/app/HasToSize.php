<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HasToSize extends Model
{
    //Validator Rules
    public static $rules = [
        'name' => 'required|min:2|max:30',
    ];

    //PrimaryKey
    protected $primaryKey = 'name';

    //Relations
    public function size()
    {
        return $this->belongsTo('App\Size', 'size_ID', 'size_ID');
    }

    public function employee()
    {
        return $this->belongsTo('App\Employee', 'employee_ID', 'employee_ID');
    }

}
