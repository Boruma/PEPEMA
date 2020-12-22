<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    //Validator Rules
    public static $rules = [
        'name' => 'required|min:2|max:50',
    ];

    //PrimaryKey
    protected $primaryKey = 'supplier_ID';

    //Relations
    public function company()
    {
        return $this->belongsTo('App\Company', 'company_ID', 'company_ID');
    }

    public function address()
    {
        return $this->hasOne('App\Address', 'address_ID', 'address_ID');
    }

    public function orderEnt()
    {
        return $this->hasMany('App\OrderEnt', 'order_ID', 'order_ID');
    }

    public function pes()
    {
        return $this->hasMany('App\Pe', 'pe_ID', 'pe_ID');
    }
}
