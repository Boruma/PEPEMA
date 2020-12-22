<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Address;
use App\Supplier;
use App\Pe;
use App\Size;
use Validator;

class SupplierController extends Controller
{    
    
    /*
    |--------------------------------------------------------------------------
    | Supplier Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles requests for Suppliers
    |
    */

    /**
     * Returns all Supplier of the Company
     *
     * @return response
     */
    public function getAll()
    {
        $suppliers = array();
        $company = Auth::user()->company;
        $suppliers = Supplier::where('company_ID', $company->company_ID)->get();

        if (count($suppliers) == 0) {
            return response()->json($suppliers, 201);
        }

        foreach ($suppliers as &$supplier) {
            $address = Address::where('supplier_ID', $supplier['supplier_ID'])->get()->first();
            if (!empty($address)) {
                $supplier['address'] = $address;
            }
        }
        return response()->json($suppliers->values(), 201);
    }


    /**
     * Returns the Supplier with given ID
     *
     * @return response
     */
    public function getOne($id)
    {
        $company = Auth::user()->company;
        $supplier = Supplier::where('company_ID', $company->company_ID)->where('supplier_ID', $id)->get()->first();

        if (empty($supplier)) {
            return response()->json(['error' => 'No Supplier found'], 404);
        }

        $addresses = Address::where('supplier_ID', $supplier['supplier_ID'])->get()->first();
        if (!empty($addresses)) {
            $supplier['addresses'] = $addresses;
        }

        return response()->json($supplier, 201);
    }

    /**
     * Creates a new Supplier with given Parameters
     *
     * @return response
     */
    public function setOne(Request $request)
    {
        $supplierRequest = $request->all();
        if (array_key_exists('address', $supplierRequest)) {
            $addressRequest = $supplierRequest['address'];
        }
        $company = Auth::user()->company;

        $supplierExist = Supplier::where('name', $supplierRequest['name'])->where('company_ID', $company->company_ID)->get()->first();
        if (!empty($supplierExist)) {
            return $this->getOne($supplierExist['supplier_ID']);
        }

        // Validation
        $validator = Validator::make($supplierRequest, Supplier::$rules);
        if (!array_key_exists('name', $supplierRequest)) {
            return response()->json(['error' => 'Could not create Supplier (name is needed)'], 400);
        }
        if (!$validator->passes()) {
            return response()->json(['error' => 'Could not create Supplier'], 400);
        }

        $validatorAdr = Validator::make($addressRequest, Address::$rules);
        if (is_array($addressRequest) && count($addressRequest) > 6) {
            return response()->json(['error' => 'Could not create Supplier (only one Address is allowed)'], 400);
        }
        if (!$validatorAdr->passes()) {
            return response()->json(['error' => 'Could not create Supplier (the Address is not valid)'], 400);
        }


        // Set supplier attributes
        $supplier = new Supplier();
        $supplier->name = $supplierRequest['name'];
        $supplier->company()->associate($company);
        if (array_key_exists('email', $supplierRequest)) {
            $supplier->email = $supplierRequest['email'];
        }
        $supplier->save();

        // Set address
        $addr = new Address();
        $addr->place = $addressRequest['place'];
        $addr->street = $addressRequest['street'];
        $addr->housenumber = $addressRequest['housenumber'];
        $addr->postcode = $addressRequest['postcode'];
        if (array_key_exists('address_additional', $addressRequest)) {
            $addr->address_additional = $addressRequest['address_additional'];
        } else {
            $addr->address_additional = "";
        }
        $addr->supplier()->associate($supplier);
        $addr->save();


        return $this->getOne($supplier['supplier_ID']);
    }

    /**
     * Updates the Supplier with given Parameters
     *
     * @return response
     */
    public function updateOne(Request $request)
    {
        if (empty($request)) {
            return response()->json(['error' => 'Could not update Supplier (empty request)'], 400);
        }
        $supplierRequest = $request->all();

        if (array_key_exists('address', $supplierRequest)) {
            $addressRequest = $supplierRequest['address'];
        }

        $company = Auth::user()->company;

        // Create validator
        $validator = Validator::make($supplierRequest, Supplier::$rules);
        if (!array_key_exists('name', $supplierRequest)) {
            return response()->json(['error' => 'Could not create Supplier (name is needed)'], 400);
        }

        if (!$validator->passes()) {
            return response()->json(['error' => 'Could not create Supplier'], 400);
        }

        if (!empty($addressRequest)) {
            $validatorAdr = Validator::make($addressRequest, Address::$rules);
            if (!$validatorAdr->passes()) {
                return response()->json(['error' => 'Could not create Supplier (at least one Address is not valid)'], 400);
            }
        } else {
            return response()->json(['error' => 'Could not create Supplier (one Address is needed)'], 400);
        }

        // Update supplier attributes
        if (array_key_exists('supplier_ID', $supplierRequest)) {
            $supplier = Supplier::find($supplierRequest['supplier_ID']);
            if (empty($supplier)) {
                return response()->json(['error' => 'Could not update Supplier (no Supplier with given id)'], 400);
            }
        } else {
            return response()->json(['error' => 'Could not update Supplier (no Supplier id given)'], 400);
        }
        $supplier->name = $supplierRequest['name'];

        if (array_key_exists('email', $supplierRequest)) {
            $supplier->email = $supplierRequest['email'];
        }
        $supplier->save();

        $addressesExist = Address::where('supplier_ID', $supplier['supplier_ID'])->get();
        foreach ($addressesExist as $addr) {
            $del = true;
            if (array_key_exists('address_ID', $addressRequest)) {
                if ($addr['address_ID'] == $addressRequest['address_ID']) {
                    $del = false;
                }
            }
            if ($del) {
                $addr->delete();
            }
        }

        // Update or create address
        if (array_key_exists('address_ID', $addressRequest)) {
            $addr = Address::find($addressRequest['address_ID']);
            if (empty($addr)) {
                $addr = new Address();
            }
        } else {
            $addr = new Address();
        }

        $addr->place = $addressRequest['place'];
        $addr->street = $addressRequest['street'];
        $addr->housenumber = $addressRequest['housenumber'];
        $addr->postcode = $addressRequest['postcode'];
        if (array_key_exists('address_additional', $addressRequest)) {
            $addr->address_additional = $addressRequest['address_additional'];
        } else {
            $addr->address_additional = "";
        }
        $addr->supplier()->associate($supplier);
        $addr->save();
        return $this->getOne($supplier['supplier_ID']);
    }


    /**
     * Deletes the Supplier with given ID
     *
     * @return response
     */
    public function deleteOne($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->address()->delete();

        $supplier->delete();

        return response()->json(['success' => 'Supplier deleted'], 201);
    }

    /**
     * Returns Pes of given Supplier
     *
     * @return response
     */
    public function getPes($id)
    {
        $supplier = Supplier::findOrFail($id);
        $company = Auth::user()->company;
        $pes = Pe::where('company_ID', $company['company_ID'])->where('supplier_ID', $supplier['supplier_ID'])->get();
        $response = array();
        if (count($pes) == 0) {
            return response()->json($response, 201);
        }

        foreach($pes as $pe) {
            $properties = $pe->properties()->get();
            $pe['properties'] = $properties;

            $roles = $pe->roles()->get();
            $pe['roles'] = $roles;

            $size_ranges = $pe->size_ranges()->get();

            foreach($size_ranges as $sizer) {
                $sizes = Size::where('sizer_ID',$sizer['sizer_ID'])->get();
                $sizer['sizes'] = $sizes;
            }

            $pe['size_ranges'] = $size_ranges;
        }
        return response()->json($pes->values(), 201);
    }
}
