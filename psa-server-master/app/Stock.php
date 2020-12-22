<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    //Validator Rules
    public static $rules = [
        'name' => 'required|min:2|max:30',
    ];

    //PrimaryKey
    protected $primaryKey = 'stock_ID';

    //Relations
    public function company()
    {
        return $this->belongsTo('App\Company', 'company_ID', 'company_ID');
    }

    public function ppe()
    {
        return $this->hasMany('App\Ppe', 'sn', 'sn');
    }
}
