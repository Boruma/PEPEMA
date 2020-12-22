<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class sizerange_pe extends Model
{
    //Validator Rules
    public static $rules = [
        'sizer_ID' => 'required',
        'pe_ID' => 'required'
    ];

    //PrimaryKey
    protected $primaryKey = 'sizer_pe_ID';

    //Relations
    public function size_range()
    {
        return $this->belongsTo('App\Size_Range', 'sizer_ID', 'sizer_ID');
    }

    public function pe()
    {
        return $this->belongsTo('App\Pe', 'pe_ID', 'pe_ID');
    }
}
