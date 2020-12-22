<?php

namespace App\Http\Controllers;

use App\Company;
use App\Address;
use App\Stock;
use App\Ppe;
use App\OrderEnt;
use App\Supplier;
use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Company Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles requests for a Company
    |
    */

    /**
     * Creates a new Company or updates a existing
     *
     * @return response
     */
    public function setOne(Request $request)
    {
        $companyRequest = $request->get('company');
        $addressRequest = $companyRequest['address'];
        $validator = Validator::make($companyRequest, Company::$rules);
        $validatorAddress = Validator::make($addressRequest, Address::$rules);
        $company = new Company();
        $address = new Address();
        $stock = new Stock();

        if ($request->isMethod('put')) {
            $company = Company::findOrFail($companyRequest['company_ID']);
            $address = Address::where('company_ID', $companyRequest['company_ID'])->get()->first();
            if (empty($address)) {
                $address = new Address();
            }
        } else if ($request->isMethod('post')) { } else {
            return response()->json(['error' => 'Could not create Company'], 400);
        }

        if ($validator->passes()) {
            $company->name = $companyRequest['name'];
            $company->save();

            $stock->name = "Lager";
            $stock->company_ID = $company->company_ID;
            $stock->company()->associate($company);
            $stock->save();

            $respAddress = new Address();
            if ($validatorAddress->passes()) {
                $address->place = $addressRequest['place'];
                $address->street = $addressRequest['street'];
                $address->housenumber = $addressRequest['housenumber'];
                $address->postcode = $addressRequest['postcode'];
                if (array_key_exists('address_additional', $addressRequest)) {
                    $address->address_additional = $addressRequest['address_additional'];
                } else {
                    $address->address_additional = "";
                }
                $address->company()->associate($company);
                $address->save();
                $respAddress = Address::where('company_ID', $company['company_ID'])->get()->first();
            } else if (empty($addressRequest) && !empty($address)) {
                $address->delete();
            }
            $company['address'] = $respAddress;
            return response()->json($company, 201);
        }
        return response()->json(['error' => 'Could not create Company'], 400);
    }

    /**
     * Deletes a Company with the given ID
     *
     * @return response
     */
    public function deleteOne($id)
    {
        $company = Company::findOrFail($id);

        // Delete all Ppes
        $employ = $company->employees()->get();
        foreach ($employ as $empl) {
            $ppes = Ppe::where('employee_ID', $empl['employee_ID'])->get();
            foreach ($ppes as $ps) {
                $toDelete = Ppe::find($ps['sn']);
                $toDelete->delete();
            }
        }

        // Delete all Orderents
        $supplier = Supplier::where('company_ID', $company['company_ID'])->get();
        foreach ($supplier as $suppl) {
            $oents = OrderEnt::where('supplier_ID', $suppl['supplier_ID'])->get();
            foreach ($oents as $oe) {
                //Delete all Psas of Order
                $ppes = Ppe::where('order_ID', $oe['order_ID'])->get();
                if (count($ppes) != 0) {
                    foreach ($ppes as &$ppe) {
                        $ppe->delete();
                    }
                }
                $toDelete = OrderEnt::find($oe['order_ID']);
                $toDelete->delete();
            }
        }

        $company->delete();
        return response()->json(['success' => 'Company deleted'], 201);
    }

    /**
     * Returns the requested Company
     *
     * @return response
     */
    public function getOne()
    {
        $company = Auth::user()->company;
        $address = Address::where('company_ID', $company['company_ID'])->get()->first();
        $company['address'] = $address;
        return response()->json($company, 200);
    }

    /**
     * Returns the requested Company Stock
     *
     * @return response
     */
    public function getStock()
    {
        $company = Auth::user()->company;
        $stock = Stock::where('company_ID', $company['company_ID'])->get()->first();
        return response()->json($stock, 200);
    }

    /**
     * Returns all Companies
     *
     * @return response
     */
    public function getAll()
    {
        $companies = array();
        $companies = DB::select('select * from companies');
        if ($companies != null && count($companies) > 0) {
            return response()->json($companies, 200);
        } else {
            return response()->json($companies, 201);
        }
    }
}
