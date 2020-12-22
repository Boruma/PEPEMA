<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AddressController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Address Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles requests for the Address of a user
    |
    */

    /**
     * Creates a new Address
     *
     * @return response
     */
    public function postOne(Request $request){
        $validator = Validator::make($request->all(), Address::$rules);

        if($validator->passes()){
            $address = new Address();
            $address->place = $request->get('place');
            $address->street = $request->get('street');
            $address->housenumber = $request->get('housenumber');
            $address->postcode = $request->get('postcode');
            $address->address_additional = $request->get('address_additional');
            $address->save();
            return response()->json($address);
        }
        return response()->json(['error' => 'Could not create Address'], 400);
    }
}
