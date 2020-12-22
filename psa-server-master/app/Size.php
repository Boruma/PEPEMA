<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    //Validator Rules
    public static $rules = [
        'name' => 'required|min:1|max:50',
    ];

    //PrimaryKey
    protected $primaryKey = 'size_ID';

    //Relations
    public function size_range()
    {
        return $this->belongsTo('App\Size_Range', 'sizer_ID', 'sizer_ID');
    }

    public function hasToSize() {
        return $this->hasMany('App\HasToSize', 'name', 'name');
    }

}
