<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    //Validator Rules
    public static $rules = [
        'name' => 'required|min:2|max:30',
        'type' => 'required|min:1|max:20',
        'text' => 'max:200|nullable'
    ];

    //PrimaryKey
    protected $primaryKey = 'property_ID';

    //Relations
    public function ppe()
    {
        return $this->belongsToMany('App\Ppe', 'property_ppes', 'property_ID', 'ppe_ID');
    }

    public function pes()
    {
        return $this->belongsToMany('App\Pe', 'property_pes', 'property_ID', 'pe_ID');
    }
}
