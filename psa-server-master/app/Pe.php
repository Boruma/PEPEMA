<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pe extends Model
{
    //Validator Rules
    public static $rules = [
        'name' => 'required|min:2|max:50',
    ];

    //PrimaryKey
    protected $primaryKey = 'pe_ID';

    //Relations
    public function company()
    {
        return $this->belongsTo('App\Company', 'company_ID', 'company_ID');
    }

    public function supplier()
    {
        return $this->belongsTo('App\Supplier', 'supplier_ID', 'supplier_ID');
    }

    public function ppes()
    {
        return $this->hasMany('App\Ppe', 'sn', 'sn');
    }

    public function roles()
    {
        return $this->belongsToMany('App\Role', 'role_pes', 'pe_ID', 'role_ID');
    }

    public function properties()
    {
        return $this->belongsToMany('App\Property', 'property_pes', 'pe_ID', 'property_ID');
    }

    public function size_ranges()
    {
        return $this->belongsToMany('App\Size_Range',  'sizerange_pes', 'pe_ID', 'sizer_ID');
    }
}
