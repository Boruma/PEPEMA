<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Size_Range extends Model
{
    public $table = "size_ranges";

    //Validator Rules
    public static $rules = [
        'name' => 'required|min:2|max:30',
    ];

    //PrimaryKey
    protected $primaryKey = 'sizer_ID';

    //Relations
    public function ppes()
    {
        return $this->belongsToMany('App\Ppe', 'sizerange_ppes', 'sizer_ID', 'sn');
    }

    public function pes()
    {
        return $this->belongsToMany('App\Pe', 'sizerange_pes');
    }

    public function size()
    {
        return $this->hasMany('App\Size', 'size_ID', 'size_ID');
    }
}
