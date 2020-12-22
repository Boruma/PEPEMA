<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    //Validator Rules
    public static $rules = [
        'place' => 'required|min:2|max:30',
        'street' => 'required|min:2|max:50',
        'housenumber' => 'required|max:10',
        'postcode' => 'required|min:2|max:10',
        'address_additional' => 'max:30|nullable'
    ];

    //PrimaryKey
    protected $primaryKey = 'address_ID';

    //Relations
    public function company()
    {
        return $this->belongsTo('App\Company', 'company_ID', 'company_ID');
    }

    public function employee()
    {
        return $this->belongsTo('App\Employee', 'employee_ID', 'employee_ID');
    }

    public function supplier()
    {
        return $this->belongsTo('App\Supplier', 'supplier_ID', 'supplier_ID');
    }
}
