<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class property_ppe extends Model
{
    //Validator Rules
    public static $rules = [
        'sn' => 'required',
        'property_ID' => 'required'
    ];

    //PrimaryKey
    protected $primaryKey = 'prop_sn';

    //Relations
    public function property()
    {
        return $this->belongsTo('App\Property', 'property_ID', 'property_ID');
    }

    public function ppe()
    {
        return $this->belongsTo('App\Ppe', 'sn', 'sn');
    }
}
