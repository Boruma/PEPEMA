<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class role_pe extends Model
{
    //Validator Rules
    public static $rules = [
        'role_ID' => 'required',
        'pe_ID' => 'required'
    ];

    //PrimaryKey
    protected $primaryKey = 'role_pe_ID';

    //Relations
    public function role()
    {
        return $this->belongsTo('App\Role', 'role_ID', 'role_ID');
    }

    public function pe()
    {
        return $this->belongsTo('App\Pe', 'pe_ID', 'pe_ID');
    }
}
