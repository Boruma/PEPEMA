<?php

namespace App\Http\Controllers;

use App\OrderEnt;
use App\Pe;
use App\Employee;
use App\Ppe;
use App\Property;
use App\property_ppe;
use App\Size;
use App\Size_Range;
use App\sizerange_ppe;
use App\Stock;
use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\Auth;

class PpeController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Ppe Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles request for Ppes
    |
    */

    /**
     * Sets delivered true and puts the Ppe in the Stock
     *
     * @return response
     */
    public function deliveredPPE(Request $request)
    {
        $ppe = null;
        // Read in request objects
        if (array_key_exists('ppe', $request->all())) {
            $ppe = $request['ppe'];
        } else {
            return response()->json(['error' => 'Could not update Ppe (values have to be in a "ppe" array)'], 400);
        }
        $company = Auth::user()->company;
        $stock = Stock::where('company_ID', $company['company_ID'])->get()->first();

        $oldPPE = Ppe::findOrFail($ppe['sn']);
        if ($oldPPE['delivered'] != false) {
            return response()->json(['error' => 'Could not update Ppe (the PPE already got delivered)'], 400);
        }
        if (!array_key_exists('newSN', $ppe)) {
            return response()->json(['error' => 'Could not update Ppes (at least one newSN is missing for the PPEs)'], 400);
        }

        $sizeranges = sizerange_ppe::where('sn', $ppe['sn'])->get();
        if (count($sizeranges) != 0) {
            foreach ($sizeranges as $sizerange) {
                $sizerange->delete();
            }
        }

        $properties = property_ppe::where('sn', $ppe['sn'])->get();
        if (count($properties) != 0) {
            foreach ($properties as $property) {
                $property->delete();
            }
        }

        $oldPPE->sn = $ppe['newSN'];
        $oldPPE->delivered = true;
        $oldPPE->stock()->associate($stock);
        $oldPPE->save();

        if (count($sizeranges) != 0) {
            foreach ($sizeranges as $sizerange) {
                $sizer = Size_Range::findOrFail($sizerange['sizer_ID']);
                $oldPPE->size_ranges()->attach($sizerange->sizer_ID);
            }
        }
        if (count($properties) != 0) {
            foreach ($properties as $property) {
                $propertyEnt = Property::findOrFail($property['property_ID']);
                $oldPPE->properties()->attach($property->property_ID);
            }
        }

        $oldPPE->save();

        $order = OrderEnt::findOrFail($oldPPE['order_ID']);
        $allPPEsSend = true;
        $ppes = Ppe::where('order_ID', $oldPPE['order_ID'])->get();
        foreach ($ppes as $ppe) {
            if (!$ppe['delivered']) {
                $allPPEsSend = false;
            }
        }
        if ($allPPEsSend) {
            $date = date("Y-m-d");
            $order->commitedDeliveryDate = $date;
            $order->state = "delivered";
            $order->save();
        }
        return response()->json($oldPPE, 201);
    }

    /**
     * Assign a Ppe to a Employee with the given ID and SN
     *
     * @return response
     */
    public function assignOne(Request $request)
    {
        if ($request['employee_ID'] != null && $request['sn'] != null) {
            $employee = Employee::findOrFail($request['employee_ID']);
            $ppe = Ppe::findOrFail($request['sn']);
            if ($ppe->stock_ID != null) {
                $ppe->stock()->dissociate();
            }
            $ppe->employee()->associate($employee);
            $ppe->save();
            $propertieKeys = property_ppe::where('sn', $request['sn'])->get();
            $properties = array();
            if (count($propertieKeys) != 0) {
                foreach ($propertieKeys as $key) {
                    $properties['properties'][] = Property::findOrFail($key['property_ID']);
                }
            } else {
                $properties['properties'][] = null;
            }

            $sizerKeys = sizerange_ppe::where('sn', $request['sn'])->get();
            $sizeranges = array();
            if (count($sizerKeys) != 0) {
                foreach ($sizerKeys as $key) {
                    $range = array();
                    $range = Size_Range::findOrFail($key['sizer_ID']);

                    $range['sizes'] = Size::where('sizer_ID', $key['sizer_ID'])->get();
                    $sizeranges[] = $range;
                }
            }

            $ppe['properties'] = $properties['properties'];
            $ppe['size_ranges'] = $sizeranges;
            return response()->json($ppe, 201);
        } else {
            return response()->json(['error' => 'No employee_ID or sn given in the request'], 404);
        }
    }

    /**
     * Unassign a Ppe from a Employee and put it in the Stock
     *
     * @return response
     */
    public function unassignOne(Request $request)
    {
        if ($request['stock_ID'] != null && $request['sn'] != null) {
            $stock = Stock::findOrFail($request['stock_ID']);
            $ppe = Ppe::findOrFail($request['sn']);
            if ($ppe->employee_ID != null) {
                $ppe->employee()->dissociate();
            }
            $ppe->stock()->associate($stock);
            $ppe->save();
            $propertieKeys = property_ppe::where('sn', $request['sn'])->get();
            $properties = array();
            if (count($propertieKeys) != 0) {
                foreach ($propertieKeys as $key) {
                    $properties['properties'][] = Property::findOrFail($key['property_ID']);
                }
            } else {
                $properties['properties'][] = null;
            }

            $sizerKeys = sizerange_ppe::where('sn', $request['sn'])->get();
            $sizeranges = array();
            if (count($sizerKeys) != 0) {
                foreach ($sizerKeys as $key) {
                    $range = array();
                    $range = Size_Range::findOrFail($key['sizer_ID']);

                    $range['sizes'] = Size::where('sizer_ID', $key['sizer_ID'])->get();
                    $sizeranges[] = $range;
                }
            }

            $ppe['properties'] = $properties['properties'];
            $ppe['size_ranges'] = $sizeranges;
            return response()->json($ppe, 201);
        } else {
            return response()->json(['error' => 'No stock_ID or sn given in the request'], 404);
        }
    }

    /**
     * Returns all Ppes of given Employee, Stock, Pe with the given ID
     *
     * @return response
     */
    public function getAll(Request $request)
    {
        $ppes = array();
        if ($request['employee_ID'] != null) {
            $ppes = Ppe::where('employee_ID', $request['employee_ID'])->get()->all();
        }
        if ($request['stock_ID'] != null) {
            $ppes = Ppe::where('stock_ID', $request['stock_ID'])->get()->all();
        }
        if ($request['order_ID'] != null) {
            $ppes = Ppe::where('order_ID', $request['order_ID'])->get()->all();
        }
        if ($request['pe_ID'] != null) {
            $ppes = Ppe::where('pe_ID', $request['pe_ID'])->get()->all();
        }

        if (count($ppes) == 0) {
            return response()->json($ppes, 201);
        }
        usort($ppes, function ($a, $b) {
            return $a > $b;
        });

        foreach ($ppes as &$ppe) {
            $propertieKeys = property_ppe::where('sn', $ppe['sn'])->get()->values();
            $properties = array();
            if (count($propertieKeys) != 0) {
                foreach ($propertieKeys as $key) {
                    $properties['properties'][] = Property::findOrFail($key['property_ID']);
                }
            } else {
                $properties['properties'] = array();
            }

            $sizerKeys = sizerange_ppe::where('sn', $ppe['sn'])->get()->values();
            $sizeranges = array();
            if (count($sizerKeys) != 0) {
                foreach ($sizerKeys as $key) {
                    $range = array();
                    $range = Size_Range::findOrFail($key['sizer_ID']);

                    $range['sizes'] = Size::where('sizer_ID', $key['sizer_ID'])->get()->values();
                    $sizeranges[] = $range;
                }
            }

            $ppe['properties'] = $properties['properties'];
            $ppe['size_ranges'] = $sizeranges;
            $ppe['template'] = $ppe->pe;
        }

        $ppeRes['ppes'] = $ppes;
        return response($ppeRes, 201);
    }

    /**
     * Returns all Ppes of the company
     *
     * @return response
     */
    public function getAllCompany(Request $request)
    {
        $company = Auth::user()->company;
        //get all ppes of the available stocks
        $stocks = Stock::where('company_ID', $company['company_ID'])->get()->all();
        if (count($stocks) == 0) {
            return response()->json("", 201);
        }
        $ppes = array();
        foreach($stocks as $stock){
            $ppesstock = Ppe::where('stock_ID', $stock['stock_ID'])->get()->all();
            foreach($ppesstock as $ppe){
                $ppes[] = $ppe;
            }
        }
        //get all ppes of the employees
        $employees = $company->employees->toArray();
        if (count($employees) != 0) {
            foreach($employees as $employee){
                $ppesemployee = Ppe::where('employee_ID', $employee['employee_ID'])->get()->all();
                foreach($ppesemployee as $ppe){
                    $ppe['employee_ID'] = $employee['employee_ID'];
                    $ppes[] = $ppe;
                }
            }
        }
        //return response()->json($ppes, 201);
        if (count($ppes) == 0) {
            return response()->json($ppes, 201);
        }
        usort($ppes, function ($a, $b) {
            return $a > $b;
        });
       
        foreach ($ppes as &$ppe) {
            $propertieKeys = property_ppe::where('sn', $ppe['sn'])->get()->values();
            $properties = array();
            if (count($propertieKeys) != 0) {
                foreach ($propertieKeys as $key) {
                    $properties['properties'][] = Property::findOrFail($key['property_ID']);
                }
            } else {
                $properties['properties'] = array();
            }

            $sizerKeys = sizerange_ppe::where('sn', $ppe['sn'])->get()->values();
            $sizeranges = array();
            if (count($sizerKeys) != 0) {
                foreach ($sizerKeys as $key) {
                    $range = array();
                    $range = Size_Range::findOrFail($key['sizer_ID']);

                    $range['sizes'] = Size::where('sizer_ID', $key['sizer_ID'])->get()->values();
                    $sizeranges[] = $range;
                }
            }

            $ppe['properties'] = $properties['properties'];
            $ppe['size_ranges'] = $sizeranges;
            $ppe['template'] = $ppe->pe;
        }

        $ppeRes['ppes'] = $ppes;
        return response($ppeRes, 201);
    }

    /**
     * Returns a Ppe with the given SN
     *
     * @return response
     */
    public function getOne($id)
    {
        $ppe = Ppe::findOrFail($id);

        $propertieKeys = property_ppe::where('sn', $id)->get();
        $properties = array();
        if (count($propertieKeys) != 0) {
            foreach ($propertieKeys as $key) {
                $properties['properties'][] = Property::findOrFail($key['property_ID']);
            }
        } else {
            $properties['properties'][] = null;
        }

        $sizerKeys = sizerange_ppe::where('sn', $id)->get();
        $sizeranges = array();
        if (count($sizerKeys) != 0) {
            foreach ($sizerKeys as $key) {
                $range = array();
                $range = Size_Range::findOrFail($key['sizer_ID']);

                $range['sizes'] = Size::where('sizer_ID', $key['sizer_ID'])->get();
                $sizeranges[] = $range;
            }
        }

        $ppe['properties'] = $properties['properties'];
        $ppe['size_ranges'] = $sizeranges;
        return response()->json($ppe, 201);
    }

    /**
     * Creates a new Ppe
     *
     * @return response
     */
    public function postOne(Request $req)
    {
        $request = null;
        // Read in request objects
        if (array_key_exists('psa', $req->all())) {
            $request = $req['psa'];
        } else {
            return response()->json(['error' => 'Could not create Ppe (values have to be in a "psa" array)'], 400);
        }
        $propertyRequest = array();
        $sizerRequest = array();
        if (array_key_exists('properties', $request)) {
            $propertyRequest = $request['properties'];
        }
        if (array_key_exists('size_ranges', $request)) {
            $sizerRequest = $request['size_ranges'];
        }

        if (empty($request)) {
            return response()->json(['error' => 'Could not create Ppe'], 400);
        }

        // Create validator
        $validator = Validator::make($request, Ppe::$rules);

        //---------
        //important Validations
        //1. has sizerange at least one size
        //2. are the sizes valid
        //3. is the ppe valid
        //4. are the given properties valid
        //5. test if stockid or orderid is given
        //6. test if sn is already existing
        //7. is given type for given attribute

        //1.
        if (!empty($sizerRequest)) {
            foreach ($sizerRequest as $sizerReq) {
                if (!array_key_exists('sizes', $sizerReq) || count($sizerReq['sizes']) == 0) {
                    return response()->json(['error' => 'Could not create Ppe (one size of a size_range is needed)'], 400);
                }

                //2.
                $validateSizes = $sizerReq['sizes'];
                foreach ($validateSizes as $validateSize) {
                    $validatorSize = Validator::make($validateSize, Size::$rules);
                    if (!$validatorSize->passes()) {
                        return response()->json(['error' => 'Could not create Ppe (at least one size is not valid)'], 400);
                    }
                }
            }
        }
        //3.
        if (!$validator->passes()) {
            return response()->json(['error' => 'Could not create Ppe (some attributes are not valid)'], 400);
        }
        //4.
        if (!empty($propertyRequest)) {
            foreach ($propertyRequest as $property) {
                $validatorProperty = Validator::make($property, Property::$rules);
                if (!($validatorProperty->passes())) {
                    return response()->json(['error' => 'Could not create Ppe (at least one property is not valid)'], 400);
                }

                //7.
                $type = $property['type'];
                switch ($type) {
                    case "value":
                        if (!array_key_exists('minValue', $property)) {
                            return response()->json(['error' => 'Could not create Ppe (ppes of type value need a value(minValue))'], 400);
                        } else if ($property['minValue'] === null) {
                            return response()->json(['error' => 'Could not create Ppe (ppes of type value need a value(minValue))'], 400);
                        }
                        break;
                    case "upValueRange":
                        if (!array_key_exists('minValue', $property) || !array_key_exists('maxValue', $property)) {
                            return response()->json(['error' => 'Could not create Ppe (ppes of type upValueRange need a min&maxValue)'], 400);
                        } else if ($property['minValue'] === null || $property['maxValue'] === null) {
                            return response()->json(['error' => 'Could not create Ppe (ppes of type upValueRange need a min&maxValue)'], 400);
                        }
                        break;
                    case "downValueRange":
                        if (!array_key_exists('minValue', $property) || !array_key_exists('maxValue', $property)) {
                            return response()->json(['error' => 'Could not create Ppe (ppes of type downValueRange need a min&maxValue)'], 400);
                        } else if ($property['minValue'] === null || $property['maxValue'] === null) {
                            return response()->json(['error' => 'Could not create Ppe (ppes of type downValueRange need a min&maxValue)'], 400);
                        }
                        break;
                    case "intervall":
                        if (!array_key_exists('intervall', $property)) {
                            return response()->json(['error' => 'Could not create Ppe (ppes of type intervall need a intervall value)'], 400);
                        } else if ($property['intervall'] === null) {
                            return response()->json(['error' => 'Could not create Ppe (ppes of type intervall need a intervall value)'], 400);
                        }
                        break;
                }
            }
        }
        //5.
        if (!array_key_exists('order_ID', $request) && !array_key_exists('stock_ID', $request)) {
            return response()->json(['error' => 'Could not create Ppe (order_id or stock_id is missing)'], 400);
        } else if ($request['order_ID'] == null && $request['stock_ID'] == null) {
            return response()->json(['error' => 'Could not create Ppe (order_id or stock_id is missing)'], 400);
        }
        $isOrderPPE = false;
        if (array_key_exists('order_ID', $request) && $request['order_ID'] != null) {
            $isOrderPPE = true;
        }

        //6.
        $already = Ppe::find($request['sn']);
        if ($already != null) {
            return response()->json(['error' => 'Could not create Ppe (sn is already used)'], 400);
        }
        //---------

        $ppe = new Ppe();

        // Set Ppe with Pe
        $ppe->sn = $request['sn'];

        $pe = Pe::findOrFail($request['pe_ID']);
        $ppe->pe()->associate($pe);

        //set delivered false, if orderPPE
        if ($isOrderPPE) {
            $ppe->delivered = false;
        } else {
            $ppe->delivered = true;
        }

        if (array_key_exists('order_ID', $request) && $request['order_ID'] != null) {
            $order = OrderEnt::findOrFail($request['order_ID']);
            $ppe->orderent()->associate($order);
        } else if (array_key_exists('stock_ID', $request) && $request['stock_ID'] != null) {
            $stock = Stock::findOrFail($request['stock_ID']);
            $ppe->stock()->associate($stock);
        }

        // Check for attributes
        if (array_key_exists('state', $request)) {
            $ppe->state = $request['state'];
        }
        if (array_key_exists('commissioningdate', $request)) {
            $ppe->commissioningdate = $request['commissioningdate'];
        }
        if (array_key_exists('comment', $request)) {
            $ppe->comment = $request['comment'];
        }

        // Set properties
        $properties = array();
        if (!empty($propertyRequest)) {
            foreach ($propertyRequest as $property) {
                $prop = new Property();
                $prop->propertyTemplate_ID = $property['property_ID'];
                $prop->name = $property['name'];
                $prop->type = $property['type'];
                if (array_key_exists('text', $property) && $property['type'] == "text") {
                    $prop->text = $property['text'];
                }
                if (array_key_exists('date', $property) && $property['type'] == "date") {
                    $prop->date = $property['date'];
                }
                if (array_key_exists('minValue', $property) && ($property['type'] == "value" || $property['type'] == "downValueRange" || $property['type'] == "upValueRange")) {
                    $prop->minValue = $property['minValue'];
                }
                if (array_key_exists('maxValue', $property) && ($property['type'] == "downValueRange" || $property['type'] == "upValueRange")) {
                    $prop->maxValue = $property['maxValue'];
                }
                if (array_key_exists('intervall', $property) && $property['type'] == "intervall") {
                    $prop->minValue = $property['intervall'];
                    $prop->date = date("Y-m-d", time());
                }
                $prop->save();
                $properties[] = $prop;
            }
        }

        // Set Size Range
        $size_ranges = array();
        if (!empty($sizerRequest)) {
            foreach ($sizerRequest as $sizerReq) {
                $sizer = new Size_Range();
                $sizer->name = $sizerReq['name'];
                $sizer->save();
                $size = $sizerReq['sizes'][0];
                // Set Size
                $sizeTemp = new Size();
                $sizeTemp->name = $size['name'];
                $sizeTemp->size_range()->associate($sizer);
                $sizeTemp->save();
                $newSize = Size::find($sizeTemp['size_ID']);
                $sizer['sizes'] = $newSize;
                $size_ranges[] = $sizer;
            }
        }

        $ppe->save();

        if (count($properties) != 0) {
            foreach ($properties as $property) {
                $ppe->properties()->attach($property->property_ID);
            }
        }
        if (count($size_ranges) != 0) {
            foreach ($size_ranges as $size_range) {
                $ppe->size_ranges()->attach($size_range->sizer_ID);
            }
        }

        $ppe['properties'] = $properties;
        $ppe['size_ranges'] = $size_ranges;
        return response()->json($ppe, 201);
    }

    /**
     * Updates a existing Ppe with given SN
     *
     * @return response
     */
    public function updateOne(Request $req)
    {
        $request = null;
        // Read in request objects
        if (array_key_exists('psa', $req->all())) {
            $request = $req['psa'];
        } else {
            return response()->json(['error' => 'Could not create Ppe (values has to be in a "psa" array)'], 400);
        }
        //return response()->json($request ,201);
        $propertyRequest = array();
        $sizerRequest = array();
        if (array_key_exists('properties', $request)) {
            $propertyRequest = $request['properties'];
        }
        if (array_key_exists('size_ranges', $request)) {
            $sizerRequest = $request['size_ranges'];
        }

        if (empty($request)) {
            return response()->json(['error' => 'Could not update Ppe'], 400);
        }

        // Create validator
        $validator = Validator::make($request, Ppe::$rules);
        //---------
        //important Validations
        //1. has sizerange at least one size
        //2. are the sizes valid
        //3. is the ppe valid
        //4. are the given properties valid
        //5. is given type for given attribute
        //6. is the given SN already existing

        //1.
        if (!empty($sizerRequest)) {
            foreach ($sizerRequest as $sizerReq) {
                if ($sizerReq != null) {
                    if (!array_key_exists('sizes', $sizerReq) || count($sizerReq['sizes']) == 0) {
                        return response()->json(['error' => 'Could not create Ppe (one size of a size_range is needed)'], 400);
                    }

                    //2.
                    $validateSizes = $sizerReq['sizes'];
                    foreach ($validateSizes as $validateSize) {
                        $validatorSize = Validator::make($validateSize, Size::$rules);
                        if (!$validatorSize->passes()) {
                            return response()->json(['error' => 'Could not create Ppe (at least one size is not valid)'], 400);
                        }
                    }
                }
            }
        }
        //3.
        if (!$validator->passes()) {
            return response()->json(['error' => 'Could not create Ppe (some attributes are not valid)'], 400);
        }
        //4.
        if (!empty($propertyRequest)) {
            foreach ($propertyRequest as $property) {
                if ($property != null) {
                    $validatorProperty = Validator::make($property, Property::$rules);
                    if (!($validatorProperty->passes())) {
                        return response()->json(['error' => 'Could not create Ppe (at least one property is not valid)'], 400);
                    }

                    //5.
                    $type = $property['type'];
                    switch ($type) {
                        case "value":
                            if (!array_key_exists('minValue', $property)) {
                                return response()->json(['error' => 'Could not create Ppe (ppes of type value need a value(minValue))'], 400);
                            } else if ($property['minValue'] === null) {
                                return response()->json(['error' => 'Could not create Ppe (ppes of type value need a value(minValue))'], 400);
                            }
                            break;
                        case "upValueRange":
                            if (!array_key_exists('minValue', $property) || !array_key_exists('maxValue', $property)) {
                                return response()->json(['error' => 'Could not create Ppe (ppes of type upValueRange need a min&maxValue)'], 400);
                            } else if ($property['minValue'] === null || $property['maxValue'] === null) {
                                return response()->json(['error' => 'Could not create Ppe (ppes of type upValueRange need a min&maxValue)'], 400);
                            }
                            break;
                        case "downValueRange":
                            if (!array_key_exists('minValue', $property) || !array_key_exists('maxValue', $property)) {
                                return response()->json(['error' => 'Could not create Ppe (ppes of type downValueRange need a min&maxValue)'], 400);
                            } else if ($property['minValue'] === null || $property['maxValue'] === null) {
                                return response()->json(['error' => 'Could not create Ppe (ppes of type downValueRange need a min&maxValue)'], 400);
                            }
                            break;
                        case "intervall":
                            if (!array_key_exists('intervall', $property)) {
                                return response()->json(['error' => 'Could not create Ppe (ppes of type intervall need a intervall value)'], 400);
                            } else if ($property['intervall'] == null) {
                                return response()->json(['error' => 'Could not create Ppe (ppes of type intervall need a intervall value != 0)'], 400);
                            }
                            break;
                    }
                }
            }
        }
        //6.
        if (!array_key_exists('sn', $request)) {
            return response()->json(['error' => 'Could not create Ppe (sn is missing)'], 400);
        } else if ($request['sn'] == null) {
            return response()->json(['error' => 'Could not create Ppe (sn is missing)'], 400);
        }
        //---------

        $ppe = Ppe::findOrFail($request['sn']);

        // Set Ppe with Pe

        // Check for attributes
        if (array_key_exists('state', $request)) {
            $ppe->state = $request['state'];
        }
        if (array_key_exists('commissioningdate', $request)) {
            $ppe->commissioningdate = $request['commissioningdate'];
        }
        if (array_key_exists('comment', $request)) {
            $ppe->comment = $request['comment'];
        }

        // Set properties
        $properties = array();
        if (!empty($propertyRequest)) {
            foreach ($propertyRequest as $property) {
                if ($property != null) {
                    $prop = Property::findOrFail($property['property_ID']);
                    if (array_key_exists('text', $property) && $property['type'] == "text") {
                        $prop->text = $property['text'];
                    }
                    if (array_key_exists('date', $property) && $property['type'] == "date") {
                        $prop->date = $property['date'];
                    }
                    if (array_key_exists('minValue', $property) && ($property['type'] == "value" || $property['type'] == "downValueRange" || $property['type'] == "upValueRange")) {
                        $prop->minValue = $property['minValue'];
                    }
                    if (array_key_exists('maxValue', $property) && ($property['type'] == "downValueRange" || $property['type'] == "upValueRange")) {
                        $prop->maxValue = $property['maxValue'];
                    }
                    if (array_key_exists('intervall', $property) && $property['type'] == "intervall") {
                        $prop->minValue = $property['intervall'];
                    }
                    $prop->save();
                    $properties[] = $prop;
                }
            }
        }

        // Set Size Range
        $size_ranges = array();
        if (!empty($sizerRequest)) {
            foreach ($sizerRequest as $sizerReq) {
                if ($sizerReq != null) {
                    $sizer = Size_Range::findOrFail($sizerReq['sizer_ID']);
                    $size = $sizerReq['sizes'][0];
                    // Set Size
                    $sizeTemp = Size::where('sizer_ID', $sizerReq['sizer_ID'])->get()->first();
                    $sizeTemp->name = $size['name'];
                    $sizeTemp->save();
                    $newSize = Size::find($sizeTemp['size_ID']);
                    $sizer['sizes'] = $newSize;
                    $size_ranges[] = $sizer;
                }
            }
        }

        $ppe->save();
        $ppe['properties'] = $properties;
        $ppe['size_ranges'] = $size_ranges;
        return response()->json($ppe, 201);
    }

    /**
     * Deletes a Ppe with given ID
     *
     * @return response
     */
    public function deleteOne($id)
    {
        $ppe = Ppe::findOrFail($id);

        $sizerKeys = sizerange_ppe::where('sn', $id)->get();
        if (count($sizerKeys) != 0) {
            foreach ($sizerKeys as $key) {
                $range = Size_Range::find($key['sizer_ID']);
                if (!empty($range)) {
                    $range->delete();
                }
            }
        }

        $propertyKeys = property_ppe::where('sn', $id)->get();
        if (count($propertyKeys) != 0) {
            foreach ($propertyKeys as $key) {
                $property = Property::find($key['property_ID']);
                if (!empty($property)) {
                    $property->delete();
                }
            }
        }
        $oldPPE = $ppe;
        $ppe->delete();
        if ($oldPPE['order_ID']) {
            $order = OrderEnt::findOrFail($oldPPE['order_ID']);
            if ($order['state'] != "delivered") {
                $allPPEsSend = true;
                $ppes = Ppe::where('order_ID', $order['order_ID'])->get();
                foreach ($ppes as $ppe) {
                    if (!$ppe['delivered']) {
                        $allPPEsSend = false;
                    }
                }
                if ($allPPEsSend) {
                    $date = date("Y-m-d");
                    $order->commitedDeliveryDate = $date;
                    $order->state = "delivered";
                    $order->save();
                }
            }
        }
        return response()->json(['success' => 'PPE deleted'], 201);
    }
}
