<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Employee;
use App\Address;
use App\Role;
use App\role_employee;
use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\Auth;

class EmployeeController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Employee Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles request for the Employees
    |
    */

    /**
     * Creates a new Employee or updates a existing one
     *
     * @return response
     */
    public function setOne(Request $request)
    {
        $employeeRequest = $request->get('employee');
        $addressRequest = $employeeRequest['address'];
        $validator = Validator::make($employeeRequest, Employee::$rules);
        $validatorAddress = Validator::make($addressRequest, Address::$rules);

        $employee = new Employee();
        $address = new Address();
        if ($request->isMethod('put')) {
            $employee = Employee::findOrFail($employeeRequest['employee_ID']);
            $address = Address::where('employee_ID', $employeeRequest['employee_ID'])->get()->first();
            if (empty($address)) {
                $address = new Address();
            }
        } else if ($request->isMethod('post')) { } else {
            return response()->json(['error' => 'Could not create Employee'], 400);
        }
        if ($validator->passes()) {
            $employee->name = $employeeRequest['name'];
            $company = Auth::user()->company;
            $employee->company()->associate($company);
            if (array_key_exists('locker', $employeeRequest)) {
                $employee->locker = $employeeRequest['locker'];
            }
            if (array_key_exists('email', $employeeRequest)) {
                $employee->email = $employeeRequest['email'];
            }
            if (array_key_exists('phonenumber', $employeeRequest)) {
                $employee->phonenumber = $employeeRequest['phonenumber'];
            }
            $employee->save();

            if ($request->isMethod('post')) {
            if(array_key_exists('roles', $employeeRequest)) {
                $roles = $employeeRequest['roles'];
                $rolesExist = $employee->roles()->get();
                if(!empty($roles)) {
                    foreach($roles as $role) {
                        $assign = true;
                        // Check, if role already assigned
                        foreach($rolesExist as $roleExist) {
                            if($roleExist["role_ID"] == $role["role_ID"]) {
                                $assign = false;
                            }
                        }
                        if($assign) {
                            $roleToInsert = Role::findOrFail($role['role_ID']);
                            $employee->roles()->attach($roleToInsert);
                        }
                    }
                }
            }
            $employee['roles'] = $employee->roles()->get();
            }

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
                $address->employee()->associate($employee);
                $address->save();
                $respAddress = Address::where('employee_ID', $employee['employee_ID'])->get()->first();
            } else if (empty($addressRequest) && !empty($address)) {
                $address->delete();
            }
            $employee['address'] = $respAddress;
            return response()->json($employee, 201);
        }
        return response()->json(['error' => 'Could not create Employee'], 400);
    }

    /**
     * Returns a Employee with the given ID
     *
     * @return response
     */
    public function getOne($id)
    {
        $employee = Employee::findOrFail($id);
        $address = Address::where('employee_ID', $id)->get()->first();
        $roles = $employee->roles()->get();
        $employee['address'] = $address;
        if(!empty($roles)) {
            $employee['roles'] = $roles;
        } else {
            $employee['roles'] = array();
        }
        return response()->json($employee, 201);
    }

    /**
     * Returns all Employees of a Company
     *
     * @return response
     */
    public function getAll()
    {
        $company = Auth::user()->company;
        $employees = $company->employees->toArray();
        usort($employees, function ($a, $b) {
            return strcmp($a['name'], $b['name']);
        });
        if (count($employees) == 0) {
            return response()->json(array(), 201);
        }
        foreach ($employees as &$employee) {
            $address = new Address();
            $address = Address::where('employee_ID', $employee['employee_ID'])->get()->first();
            $employee['address'] = $address;

            $employeeForRoles = Employee::find($employee['employee_ID']);
            if(!empty($employeeForRoles)) $roles = $employeeForRoles->roles()->get();
            if(!empty($roles)) $employee['roles'] = $roles;

        }
        return response()->json($employees, 201);
    }

    /**
     * Deletes one Employee with the given ID
     *
     * @return response
     */
    public function deleteOne($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();
        return response()->json(['success' => 'Employee deleted'], 201);
    }

    /**
     * Deletes all Employees of the Company
     *
     * @return response
     */
    public function deleteAll()
    {
        $company = Auth::user()->company;
        $employees = $company->employees;
        if (count($employees) == 0) {
            return response()->json(['error' => 'Not found'], 404);
        }
        //Array der zu löschenden Employees durchgehen und löschen
        foreach ($employees as $employee) {
            $employee->delete();
        }
        return response()->json(['success' => 'Employees deleted'], 201);
    }

    /**
     * Assigns a given Role to the given Employee
     *
     * @return response
     */
    public function assignRole(Request $request)
    {
        $request = $request->all();
        $role = Role::findOrFail($request['role_ID']);
        $new_employee = Employee::findOrFail($request['employee_ID']);

        $attach = true;
        foreach($role->employees as $employee){
            if($employee["employee_ID"] == $new_employee["employee_ID"]){
                $attach = false;
            }
        }

        if($attach)
            $role->employees()->attach($request['employee_ID']);

        return response()->json($role->employees, 201);
    }

    /**
     * Unassigns a given Role from the given Employee
     *
     * @return response
     */
    public function unassignRole(Request $request)
    {
        $request = $request->all();
        $role = Role::findOrFail($request['role_ID']);
        $employee = Employee::findOrFail($request['employee_ID']);

        $role->employees()->detach($request['employee_ID']);

        return response()->json($role->employees, 201);
    }

    /**
     * Returns all Roles of a given Employee
     *
     * @return response
     */
    public function getAllRoles($id)
    {
        $company = Auth::user()->company;
        $employee = Employee::findOrFail($id);
        $roles = $employee->roles->toArray();
        $role_ids = role_employee::where('employee_ID', $id)->get('role_ID')->all();
        $roles = array();
        foreach ($role_ids as $role_id) {
            $role = Role::where('role_ID', $role_id['role_ID'])->get()->all();
            array_push($roles, $role[0]);
        }

        return response()->json($roles, 201);
    }
}
