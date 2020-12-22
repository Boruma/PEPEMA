<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ppe extends Model
{
    //Validator Rules
    public static $rules = [
        'sn' => 'required|min:1|max:100',
        'comment' => 'max:150|nullable',
        'state' => 'max:30|nullable'
    ];

    //PrimaryKey
    protected $primaryKey = 'sn';
    protected $keyType = 'string';
    public $incrementing = false;

    //Relations
    public function pe()
    {
        return $this->belongsTo('App\Pe', 'pe_ID', 'pe_ID');
    }

    public function employee()
    {
        return $this->belongsTo('App\Employee', 'employee_ID', 'employee_ID');
    }

    public function stock()
    {
        return $this->belongsTo('App\Stock', 'stock_ID', 'stock_ID');
    }

    public function orderent()
    {
        return $this->belongsTo('App\OrderEnt', 'order_ID', 'order_ID');
    }

    public function properties()
    {
        return $this->belongsToMany('App\Property', 'property_ppes', 'sn', 'property_ID');
    }

    public function size_ranges()
    {
        return $this->belongsToMany('App\Size_Range', 'sizerange_ppes', 'sn', 'sizer_ID');
    }
}
