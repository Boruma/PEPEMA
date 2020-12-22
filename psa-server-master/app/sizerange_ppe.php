<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class sizerange_ppe extends Model
{
    public $table = "sizerange_ppes";
    //Validator Rules
    public static $rules = [
        'sizer_ID' => 'required',
        'ppe_ID' => 'required'
    ];

    //PrimaryKey
    protected $primaryKey = 'sizer_sn';

    //Relations
    public function size_range()
    {
        return $this->belongsTo('App\Size_Range', 'sizer_ID', 'sizer_ID');
    }

    public function ppe()
    {
        return $this->belongsTo('App\Ppe', 'sn', 'sn');
    }
}
