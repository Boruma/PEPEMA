<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OrderEnt extends Model
{
    //Validator Rules
    public static $rules = [
        'orderdate' => 'date|nullable',
        'expectedDeliveryDate' => 'date|nullable',
        'commitedDeliveryDate' => 'date|nullable',
        'state' => 'max:40|nullable'
    ];

    //PrimaryKey
    protected $primaryKey = 'order_ID';

    //Relations
    public function supplier()
    {
        return $this->belongsTo('App\Supplier', 'supplier_ID', 'supplier_ID');
    }

    public function ppe()
    {
        return $this->hasMany('App\Ppe', 'sn', 'sn');
    }
}
