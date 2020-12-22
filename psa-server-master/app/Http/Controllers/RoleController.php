<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Role;
use App\Pe;
use App\Employee;
use App\role_employee;
use Validator;
use Illuminate\Support\Facades\Auth;

class RoleController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Role Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles requests for Roles
    |
    */

    /**
     * Create a new Role or update a esiting Role
     *
     * @return response
     */
    public function setOne(Request $request)
    {
        $roleRequest = $request->all();

        $validator = Validator::make($roleRequest, Role::$rules);
        $role = new Role();
        if ($request->isMethod('put')) {
            $role = Role::findOrFail($roleRequest['role_ID']);
        } elseif ($request->isMethod('post')) {
        } else {
            return response()->json(['error' => 'Could not create Role'], 400);
        }

        if ($validator->passes()) {
            $role->name = $roleRequest['name'];
            $company = Auth::user()->company;

            $role->company()->associate($company);
            $role->save();


            return response()->json($role, 201);
        }
        return response()->json(['error' => 'Could not create Role'], 400);
    }

    /**
     * Returns all Roles of the Company
     *
     * @return response
     */
    public function getAll(){
        $company = Auth::user()->company;
        $roles = Role::where('company_ID', $company->company_ID)->get()->all();

        return response()->json($roles, 201);
    }

    /**
     * Returns all Pes of a Employee with given Roles
     *
     * @return response
     */
    public function getAllPesFromEmployee($id)
    {
        $company = Auth::user()->company;
        $employee = Employee::findOrFail($id);
        $roles = $employee->roles;
        $role_ids = role_employee::where('employee_ID', $id)->get('role_ID')->all();
        $roles = array();
        $pes = array();
        foreach ($role_ids as $role_id) {
            $role = Role::where('role_ID', $role_id['role_ID'])->get()->all();
            array_push($roles, $role[0]);
        }

        foreach ($roles as $role) {
            foreach ($role->pes as $new_pe) {
                $found = false;
                foreach($pes as $pe){
                    if($pe->pe_ID == $new_pe->pe_ID){
                        $found = true;
                    }
                }
                if (!$found) {
                    array_push($pes, $new_pe);
                }
            }
        }
        return response()->json($pes, 201);
    }

    /**
     * Returns a Role with given ID
     *
     * @return response
     */
    public function getOne($id)
    {
        $role = Role::findOrFail($id);
        return response()->json($role, 201);
    }

    /**
     * Deletes a Role with given ID
     *
     * @return response
     */
    public function deleteOne($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();
        return response()->json(['success' => 'Role deleted'], 201);
    }

    /**
     * Deletes all Roles of the Company
     *
     * @return response
     */
    public function deleteAll()
    {
        $company = Auth::user()->company;
        $roles = Role::where('company_ID', $company->company_ID)->get();

        if (count($roles) == 0) {
            return response()->json(['error' => 'Not found'], 404);
        }
        foreach ($roles as $role) {
            $role->delete();
        }
        return response()->json(['success' => 'Roles deleted'], 201);
    }
}
