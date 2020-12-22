<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class property_pe extends Model
{
    //Validator Rules
    public static $rules = [
        'pe_ID' => 'required',
        'property_ID' => 'required'
    ];

    //PrimaryKey
    protected $primaryKey = 'prop_pe_ID';

    //Relations
    public function property()
    {
        return $this->belongsTo('App\Property', 'property_ID', 'property_ID');
    }

    public function pe()
    {
        return $this->belongsTo('App\Pe', 'pe_ID', 'pe_ID');
    }
}
