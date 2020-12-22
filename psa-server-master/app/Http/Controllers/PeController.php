<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Employee;
use App\Pe;
use App\Ppe;
use App\Role;
use App\Supplier;
use Validator;
use App\Size_Range;
use App\Property;
use App\Size;
use App\Stock;

class PeController extends Controller
{
    
    /*
    |--------------------------------------------------------------------------
    | Pe Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles requests for Pes
    |
    */

    /**
     * Returns all Pes of a Company
     *
     * @return response
     */
    public function getAll()
    {
        $pes = array();
        $company = Auth::user()->company;
        $pes = Pe::where('company_ID', $company->company_ID)->get();

        if (count($pes) == 0) {
            return response()->json($pes, 201);
        }

        foreach ($pes as $pe) {
            $properties = $pe->properties()->get();
            $pe['properties'] = $properties;

            $roles = $pe->roles()->get();
            $pe['roles'] = $roles;

            $size_ranges = $pe->size_ranges()->get();

            foreach ($size_ranges as $sizer) {
                $sizes = Size::where('sizer_ID', $sizer['sizer_ID'])->get();
                $sizer['sizes'] = $sizes;
            }

            $pe['size_ranges'] = $size_ranges;
        }
        return response()->json($pes, 201);
    }

    /**
     * Returns a Pe with the given ID
     *
     * @return response
     */
    public function getOne($id)
    {
        $pe = Pe::findOrFail($id);

        $ppes = Ppe::where('pe_ID', $id)->get();
        $pe['ppes'] = $ppes;

        $properties = $pe->properties()->get();
        $pe['properties'] = $properties;

        $roles = $pe->roles()->get();
        $pe['roles'] = $roles;

        $size_ranges = $pe->size_ranges()->get();
        foreach ($size_ranges as $sizer) {
            $sizes = Size::where('sizer_ID', $sizer['sizer_ID'])->get();
            $sizer['sizes'] = $sizes;
        }

        $pe['size_ranges'] = $size_ranges;

        return response()->json($pe, 201);
    }

    /**
     * Creates a new Pe with the given Parameters
     *
     * @return response
     */
    public function setOne(Request $request)
    {
        // Read in request objects
        $peRequest = $request->all();
        $propertyRequest = $peRequest['properties'];
        $roleRequest = $peRequest['roles'];
        $sizerRequest = $peRequest['size_range'];

        if (empty($peRequest)) {
            return response()->json(['error' => 'Could not create Pe'], 400);
        }

        // Create validator
        $validator = Validator::make($peRequest, Pe::$rules);

        //---------
        //Important Validations
        //1.
        //1.1: is supplier id in request available
        //1.2: does a supplier exist with the given ID
        //2. has the given sizerange at least one size
        //3.
        //3.1: is at least one role available
        //3.2: are all roles available in the DB
        //4. is the Pe valid
        //5. are the sizes valid
        //6. if properties available: are they valid

        //1.1
        if (!array_key_exists('supplier_ID', $peRequest) || $peRequest['supplier_ID'] == null) {
            return response()->json(['error' => 'Could not create Pe (supplier is needed)'], 400);
        }
        //1.2
        Supplier::findOrFail($peRequest['supplier_ID']);
        //2.
        if (!empty($sizerRequest)) {
            foreach ($sizerRequest as $sizer) {
                if (!array_key_exists('sizes', $sizer) || count($sizer['sizes']) == 0) {
                    return response()->json(['error' => 'Could not create Pe (at least one size of a size_range is needed)'], 400);
                }

                //5.
                $validateSizes = $sizer['sizes'];
                foreach ($validateSizes as $validSize) {
                    $validatorSize = Validator::make($validSize, Size::$rules);
                    if (!$validatorSize->passes()) {
                        return response()->json(['error' => 'Could not create Pe (at least one size is not valid)'], 400);
                    }
                }
            }
        }
        //3.1
        if (empty($roleRequest)) {
            return response()->json(['error' => 'Could not create Pe (at least one role is needed)'], 400);
        }
        //3.2
        foreach ($roleRequest as $role) {
            $rol = Role::where('name', $role['name'])->get()->first();
            if (empty($rol)) {
                return response()->json(['error' => 'Could not create Pe (at least one role was not found in database)'], 400);
            }
        }
        //4.
        if (!$validator->passes()) {
            return response()->json(['error' => 'Could not create Pe (name is not valid)'], 400);
        }

        //6.
        if (!empty($propertyRequest)) {
            foreach ($propertyRequest as $propertyValid) {
                $validatorProperty = Validator::make($propertyValid, Property::$rules);
                if (!($validatorProperty->passes())) {
                    return response()->json(['error' => 'Could not create Pe (at least one property is not valid)'], 400);
                }
            }
        }
        //---------

        $pe = new Pe();

        // Set Pe
        $pe->name = $peRequest['name'];
        $pe->supplItemID = $peRequest['supplItemID'];

        $company = Auth::user()->company;
        $pe->company()->associate($company);
        // Check for supplier
        $supplier = Supplier::findOrFail($peRequest['supplier_ID']);
        $pe->supplier()->associate($supplier);

        $pe->save();
        // Set properties
        if (!empty($propertyRequest)) {
            foreach ($propertyRequest as $property) {
                // Check if property with given name already exists for this pe
                $prop = Property::where('name', $property['name'])->get();
                if (count($prop) == 0) {
                    $prop = new Property();
                } else {
                    $propsExist = $pe->properties()->get();
                    foreach ($prop as $pro) {
                        if ($propsExist->contains('property_ID', $pro['property_ID'])) {
                            return response()->json(['error' => 'Could not create Pe (duplicated property name)'], 400);
                            break;
                        }
                    }
                    $prop = new Property();
                }

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
                $pe->properties()->attach($prop);
            }
        }

        // Set roles
        foreach ($roleRequest as $role) {
            // Check if roles alreaedy exists
            $rol = Role::where('name', $role['name'])->where('company_ID', $company->company_ID)->get()->first();
            if (empty($rol)) {
                return response()->json(['error' => 'Could not create Pe (role not found)'], 400);
            }
            $pe->roles()->attach($rol);
        }

        // Set Size Range
        if (!empty($sizerRequest)) {
            foreach ($sizerRequest as $sizr) {
                // check if sizerange with given name already exists for this pe
                $sizer = Size_Range::where('name', $sizr['name'])->get();
                if (count($sizer) == 0) {
                    $sizer = new Size_Range();
                } else {
                    $sizesExist = $pe->size_ranges()->get();
                    foreach ($sizer as $sir) {
                        if ($sizesExist->contains('sizer_ID', $sir['sizer_ID'])) {
                            return response()->json(['error' => 'Could not create Pe (duplicated sizeRange name)'], 400);
                            break;
                        }
                    }
                    $sizer = new Size_Range();
                }

                $sizer->name = $sizr['name'];
                $sizer->save();
                $sizes = $sizr['sizes'];
                // Set Sizes
                foreach ($sizes as $size) {
                    $sizeTemp = new Size();
                    $sizeTemp->name = $size['name'];
                    $sizeTemp->size_range()->associate($sizer);
                    $sizeTemp->save();
                }
                $pe->size_ranges()->attach($sizer);
            }
        }
        return $this->getOne($pe['pe_ID']);
    }

    /**
     * Updates a Pe with the given ID and Parameters
     *
     * @return response
     */
    public function updateOne(Request $request)
    {
        $request = $request->all();
        $propertyRequest = array();
        $sizerRequest = array();
        $roleRequest = array();

        if (empty($request)) {
            return response()->json(['error' => 'Could not update Pe (empty request)'], 400);
        }

        if (array_key_exists('properties', $request)) {
            $propertyRequest = $request['properties'];
        }

        if (array_key_exists('size_range', $request)) {
            $sizerRequest = $request['size_range'];
        }

        if (array_key_exists('roles', $request)) {
            $roleRequest = $request['roles'];
        }

        // Create validator
        $validator = Validator::make($request, Pe::$rules);

        //---------
        //Important Validations
        //1.
        //1.1: is supplier id in request available
        //1.2: does a supplier exist with the given ID
        //2. has the given sizerange at least one size
        //3.
        //3.1: is at least one role available
        //3.2: are all roles available in the DB
        //4. is the Pe valid
        //5. are the sizes valid
        //6. if properties available: are they valid


        //1.1
        if (!array_key_exists('supplier_ID', $request) || $request['supplier_ID'] == null) {
            return response()->json(['error' => 'Could not create Pe (supplier is needed)'], 400);
        }
        //1.2
        Supplier::findOrFail($request['supplier_ID']);
        //2.

        if (!empty($sizerRequest)) {
            foreach ($sizerRequest as $sizer) {
                if (!array_key_exists('sizes', $sizer) || count($sizer['sizes']) == 0) {
                    return response()->json(['error' => 'Could not create Pe (at least one size of a size_range is needed)'], 400);
                }

                //5.
                $validateSizes = $sizer['sizes'];
                foreach ($validateSizes as $validSize) {
                    $validatorSize = Validator::make($validSize, Size::$rules);
                    if (!$validatorSize->passes()) {
                        return response()->json(['error' => 'Could not create Pe (at least one size is not valid)'], 400);
                    }
                }
            }
        }

        //3.1
        if (empty($roleRequest)) {
            return response()->json(['error' => 'Could not create Pe (at least one role is needed)'], 400);
        }
        //3.2
        foreach ($roleRequest as $role) {
            $rol = Role::where('name', $role['name'])->get()->first();
            if (empty($rol)) {
                return response()->json(['error' => 'Could not create Pe (at least one role was not found in database)'], 400);
            }
        }
        //4.
        if (!$validator->passes()) {
            return response()->json(['error' => 'Could not create Pe (name is not valid)'], 400);
        }

        //6.
        if (!empty($propertyRequest)) {
            foreach ($propertyRequest as $propertyValid) {
                $validatorProperty = Validator::make($propertyValid, Property::$rules);
                if (!($validatorProperty->passes())) {
                    return response()->json(['error' => 'Could not create Pe (at least one property is not valid)'], 400);
                }
            }
        }

        // Update attributes
        $pe = Pe::findOrFail($request['pe_ID']);
        if (empty($pe)) {
            return response()->json(['error' => 'Could not update Pe (no Pe with given id)'], 400);
        }


        if (array_key_exists('name', $request)) {
            $pe->name = $request['name'];
        }

        if (array_key_exists('supplier_ID', $request)) {
            $supplier = Supplier::findOrFail($request['supplier_ID']);
            $pe->supplier()->associate($supplier);
        } else {
            return response()->json(['error' => 'Could not update Pe (missing supplier)'], 400);
        }

        if (array_key_exists('supplItemId', $request)) {
            $pe = $request['supplItemId'];
        }


        // Delete the properties that are not in the update request
        $propExist = $pe->properties()->get();
        foreach ($propExist as $prop) {
            $del = true;
            foreach ($propertyRequest as $property) {
                if ($property['name'] == $prop['name']) {
                    $del = false;
                }
            }

            if ($del) {
                // Delete for ppes
                $ppes = Ppe::where('pe_ID', $pe['pe_ID'])->get();
                foreach ($ppes as $ppe) {
                    $propertiesPpe = $ppe->properties()->get();
                    foreach ($propertiesPpe as $propPpe) {
                        if ($propPpe['name'] == $prop['name']) {
                            $propToDel = Property::find($propPpe['property_ID']);
                            $ppe->properties()->detach($propToDel);
                            $propToDel->delete();
                        }
                    }
                }

                $pe->properties()->detach($prop);
                $prop->delete();
            }
        }

        // Update properties
        foreach ($propertyRequest as $property) {
            $newProp = false;

            // Check if property with given name already exists for this pe
            $prop = null;
            if (array_key_exists('property_ID', $property)) {
                $prop = Property::find($property['property_ID']);
                if (empty($prop))  $prop = $pe->properties()->where('name', $property['name'])->get()->first();
            } else {
                $prop = $pe->properties()->where('name', $property['name'])->get()->first();
            }
            if (empty($prop)) {
                $newProp = true;
                $prop = new Property();
            }

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

            }

            $prop->save();
            if ($newProp) $pe->properties()->attach($prop);

            // Update PPes' Properties
            // Creates new Property for PPe
            if ($newProp) {
                $ppes = Ppe::where('pe_ID', $pe['pe_ID'])->get();
                foreach ($ppes as $ppe) {
                    $propTemp = new Property();
                    if ($prop['name'] != null) $propTemp->name = $prop['name'];
                    if ($prop['type'] != null) $propTemp->type = $prop['type'];
                    if ($prop['text'] != null) $propTemp->text = $prop['text'];
                    if ($prop['date'] != null) $propTemp->date = $prop['date'];
                    if ($prop['minValue'] != null) $propTemp->minValue = $prop['minValue'];
                    if ($prop['maxValue'] != null) $propTemp->maxValue = $prop['maxValue'];
                    if ($prop['intervall'] != null) $propTemp->minValue = $prop['intervall'];
                    $propTemp->propertyTemplate_ID = $prop['property_ID'];

                    $propTemp->save();
                    $ppe->properties()->attach($propTemp);
                }
            } else {
                //Updates Property for PPe
                $propsToUpdate = Property::where('propertyTemplate_ID', $prop['property_ID'])->get();
                foreach ($propsToUpdate as $propUpdate) {
                    if ($prop['name'] != null) $propUpdate->name = $prop['name'];
                    if ($prop['type'] != null) $propUpdate->type = $prop['type'];
                    if ($prop['text'] != null) $propUpdate->text = $prop['text'];
                    if ($prop['date'] != null) $propUpdate->date = $prop['date'];
                    if ($prop['minValue'] != null) $propUpdate->minValue = $prop['minValue'];
                    if ($prop['maxValue'] != null) $propUpdate->maxValue = $prop['maxValue'];
                    if ($prop['intervall'] != null)$propUpdate->minValue = $prop['intervall'];
                    $propUpdate->save();
                }
            }
        }


        // Delete roles that are not in the update request
        $rolesExist = $pe->roles()->get();
        foreach ($rolesExist as $ro) {
            $del = true;
            foreach ($roleRequest as $role) {
                if ($role['name'] == $ro['name']) {
                    $del = false;
                }
            }
            if ($del) {
                $pe->roles()->detach($ro);
            }
        }

        // Update roles
        foreach ($roleRequest as $role) {
            $company = Auth::user()->company;
            $roll = Role::where('name', $role['name'])->where('company_ID', $company->company_ID)->get();
            $rolesExist = $pe->roles()->get();

            if (!empty($roll)) {
                if ($rolesExist->contains('name', $role['name'])) {
                } else {
                    $pe->roles()->attach($roll);
                }
            } else {
                return response()->json(['error' => 'Could not create Pe (role not found)'], 400);
            }

            // Move PPEs' from Employee to Stock when missing the role
            $ppes = Ppe::where('pe_ID', $pe['pe_ID'])->get();
            foreach ($ppes as $ppe) {
                if (!empty($ppe['employee_ID'])) {
                    $employee = Employee::find($ppe['employee_ID']);
                    if (!empty($employee)) {
                        $rolesEmpl = $employee->roles()->get();
                        $movePpe = true;
                        foreach ($rolesEmpl as $roleEmpl) {
                            if ($rolesExist->contains('name', $roleEmpl['name'])) {
                                $movePpe = false;
                                return response()->json(['error' => 'Could not create Pe (role not found)'], 400);
                            }
                        }
                        if ($movePpe) {
                            $stock = Stock::where('company_ID', $company['company_ID'])->get()->first();
                            $ppe->employee()->dissociate();
                            $ppe->stock()->associate($stock);
                            $ppe->save();
                        }
                    }
                }
            }
        }


        // Delete size_ranges that are not in the update request
        $sizerExist = $pe->size_ranges()->get();
        foreach ($sizerExist as $sizer) {
            $del = true;
            $sizerTemp = null;
            foreach ($sizerRequest as $sizr) {
                if ($sizer['name'] == $sizr['name']) {
                    $del = false;
                    $sizerTemp = $sizr;
                }
            }

            if ($del) {
                // Delete for ppes
                $ppes = Ppe::where('pe_ID', $pe['pe_ID'])->get();
                foreach ($ppes as $ppe) {
                    $sizersPpe = $ppe->size_ranges()->get();
                    foreach ($sizersPpe as $sizerPpe) {
                        if ($sizerPpe['name'] == $sizer['name']) {
                            $sizerToDelete = Size_Range::find($sizerPpe['sizer_ID']);
                            $ppe->size_ranges()->detach($sizerToDelete);
                            $sizerToDelete->delete();
                        }
                    }
                }

                $pe->size_ranges()->detach($sizer);
                $sizer->delete();
            } else {
                //Check for sizes
                $sizes = Size::where('sizer_ID', $sizer['sizer_ID'])->get();
                if (count($sizes) == 0) {
                    // return response()->json(['error' => 'Could not create Pe (size_range not found)'], 400);
                }

                if ($sizerTemp == null) return response()->json(['error' => 'Could not create Pe (size_range not found)'], 400);
                $sizesReq = $sizerTemp['sizes'];
                foreach ($sizes as $sizeExist) {
                    $delSize = true;
                    foreach ($sizesReq as $sizeReq) {
                        if ($sizeReq['name'] == $sizeExist['name']) {
                            $delSize = false;
                        }
                    }
                    if ($delSize) {
                        // Delete for ppes
                        $sizersPpe = Size_Range::where('sizerTemplate_ID', $sizer['sizer_ID'])->get();
                        foreach ($sizersPpe as $sizerPpe) {
                            $sizesPpe = Size::where('sizer_ID', $sizerPpe['sizer_ID'])->get();
                            foreach ($sizesPpe as $sizePpe) {
                                if (!array_key_exists("sizes", $sizerRequest) || !$sizerRequest['sizes']->contains('name', $sizePpe['name'])) {
                                    $sizeToDelete = Size::find($sizePpe['size_ID']);
                                    $sizeToDelete->delete();
                                }
                            }
                        }
                        $sizeExist->delete();
                    }
                }
            }
        }

        //Update sizer_ranges
        if (!empty($sizerRequest)) {
            foreach ($sizerRequest as $sizer) {
                $newSizer = false;
                // check if sizerange with given name already exists for this pe
                $sizr = Size_Range::where('name', $sizer['name'])->get();
                if (empty($sizr) || count($sizr) == 0) {
                    $newSizer = true;
                    $sizr = new Size_Range();
                } else {
                    $sizer_found = false;
                    $sizesExist = $pe->size_ranges()->get();
                    foreach ($sizr as $sir) {
                        if ($sizesExist->contains('sizer_ID', $sir['sizer_ID'])) {
                            $sizer_found = true;
                            $sizr = $sir;
                            break;
                        }
                    }
                    if (!$sizer_found) {
                        $newSizer = true;
                        $sizr = new Size_Range();
                    }
                }

                $sizr->name = $sizer['name'];
                $sizr->save();

                $sizes = $sizer['sizes'];
                foreach ($sizes as $size) {
                    $newSize = true;
                    if (!$newSizer) {
                        $sizesExist = Size::where('sizer_ID', $sizr['sizer_ID'])->get();
                        if ($sizesExist->contains('name', $size['name'])) {
                            $newSize = false;
                        }
                    }
                    if ($newSize) {
                        $sizeTemp = new Size();
                        $sizeTemp->name = $size['name'];
                        $sizeTemp->size_range()->associate($sizr);
                        $sizeTemp->save();

                        // Create new Size for Ppe
                        if (array_key_exists('sizer_ID', $sizer)) {
                            $sizesToUpdate = Size_Range::where('sizerTemplate_ID', $sizer['sizer_ID'])->get();
                            foreach ($sizesToUpdate as $sizeUpdate) {
                                $sizeTemp2 = new Size();
                                $sizeTemp2->name = $size['name'];
                                $sizeTemp2->size_range()->associate($sizeUpdate);
                                $sizeTemp2->save();
                            }
                        }
                    }
                }
                if ($newSizer) $pe->size_ranges()->attach($sizr);

                // Update PPes' Size_Ranges
                // Creates new Size_Ranges for PPe
                if ($newSizer) {
                    $ppes = Ppe::where('pe_ID', $pe['pe_ID'])->get();
                    foreach ($ppes as $ppe) {
                        $sizerTemp = new Size_Range();
                        $sizerTemp->name = $sizr['name'];
                        $sizerTemp->sizerTemplate_ID = $sizr['sizer_ID'];
                        $sizerTemp->save();
                        foreach ($sizes as $size) {
                            $sizeTemp = new Size();
                            $sizeTemp->name = $size['name'];
                            $sizeTemp->size_range()->associate($sizerTemp);
                            $sizeTemp->save();
                        }

                        $ppe->size_ranges()->attach($sizerTemp);
                    }
                } else {
                    //Updates Property for PPe
                    if (array_key_exists('sizer_ID', $sizer)) {
                        $sizersToUpdate = Size_Range::where('sizerTemplate_ID', $sizer['sizer_ID'])->get();
                        foreach ($sizersToUpdate as $sizerUpdate) {
                            $sizerUpdate->name = $sizer['name'];

                            $sizerUpdate->save();
                        }
                    }
                }
            }
        }

        $pe->save();

        return $this->getOne($pe['pe_ID']);
    }

    /**
     * Deletes the Pe with given ID
     *
     * @return response
     */
    public function deleteOne($id)
    {
        $pe = Pe::findOrFail($id);

        $pe->roles()->detach();

        $pe->properties()->delete();
        $pe->properties()->detach();

        $pe->size_ranges()->delete();
        $pe->size_ranges()->detach();

        $pe->delete();

        return response()->json(['success' => 'Pe deleted'], 201);
    }

    /**
     * Assign a Role to a Pe
     *
     * @return response
     */
    public function assignRole(Request $request)
    {
        $request = $request->all();
        $role = Role::findOrFail($request['role_ID']);
        $new_pe = Pe::findOrFail($request['pe_ID']);

        $attach = true;
        foreach ($role->pes as $pe) {
            if ($pe['pe_ID'] == $new_pe['pe_ID']) {
                $attach = false;
            }
        }
        if ($attach)
            $role->pes()->attach($request['pe_ID']);

        return response()->json($role->pes, 201);
    }

    /**
     * Unassign a Role to a Pe
     *
     * @return response
     */
    public function unassignRole(Request $request)
    {

        $request = $request->all();
        $role = Role::findOrFail($request['role_ID']);
        $ppe = Pe::findOrFail($request['pe_ID']);

        $role->pes()->detach($request['pe_ID']);

        return response()->json($role->pes, 201);
    }
}
