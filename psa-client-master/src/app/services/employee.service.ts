import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProviderService } from './provider.service';
import { Employee } from '../models/employee';
import { Address } from 'src/app/models/address';
import { Storage } from '@ionic/storage';
import { Role } from '../models/role';
import { Observable } from 'rxjs';
import { Pe } from '../models/pe';


const TOKEN_KEY = 'auth-token';

@Injectable({
    providedIn: 'root'
})

export class EmployeeService {

    employeeUrl: string = this.global.globalUrl + '/employee';
    roleUrl: string = this.global.globalUrl + '/role';

    public _updateEmployeeMobile: any = null;
    public _removeEmployeeMobile: any = null;
    public _addPsaMobile: any = null;
    public updateObservable;
    public removeObservable;
    public addPsaObservable;

    constructor(private http: HttpClient, public global: ProviderService, private storage: Storage) {

        this._updateEmployeeMobile = Observable.create(observer => {
            this.updateObservable = observer;
        });

        this._removeEmployeeMobile = Observable.create(observer => {
            this.removeObservable = observer;
        });

        this._addPsaMobile = Observable.create(observer => {
            this.addPsaObservable = observer;
        });

    }

    public updateEmployeeMobile() {
        this.updateObservable.next();
    }

    public removeEmployeeMobile() {
        this.removeObservable.next();
    }

    public addPsaMobile() {
        this.addPsaObservable.next();
    }

    // creates an employee
    createEmployee(employee: Employee): Promise<Employee> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    'employee': employee
                };
                return this.http.post<Employee>(this.employeeUrl, postData, httpOption).toPromise();
            }
        });
    }


    createAndGetEmployee(employee: Employee): Promise<any> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    'employee': employee
                };
                return this.http.post(this.employeeUrl, postData, httpOption).toPromise();
            }
        });
    }

    // gets the values of an employee from the db
    getEmployee(id: number): Promise<Employee> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = `${this.employeeUrl}/${id}`;
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                return this.http.get<Employee>(url, httpOption).toPromise();
            }
        });
    }

    // gets the values of all employees from the db
    getEmployees(): Promise<Employee[]> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };

                return this.http.get<Employee[]>(this.employeeUrl, httpOption).toPromise();
            }
        });
    }

    // Changes the values of employee
    editEmployee(employee: Employee): Promise<Employee> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    'employee': employee
                };
                return this.http.put<Employee>(this.employeeUrl, postData, httpOption).toPromise();
            }
        });
    }

    //deletes a employee
    deleteEmployee(id: number) {
        return this.storage.get(TOKEN_KEY).then(res => {
           
            if (res) {
                const url = `${this.employeeUrl}/${id}`;
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + res
                    })
                };
                return this.http.delete(url, httpOption).toPromise();
            }
        });
    }

    public copyEmployee(employee: Employee): Employee {
        let copy: Employee = <Employee>{};
        copy.address = <Address>{};

        copy.employee_ID = employee.employee_ID;
        copy.locker = employee.locker;
        copy.name = employee.name;
        copy.email = employee.email;
        copy.phonenumber = employee.phonenumber;
        copy.address = employee.address;

        copy.roles = employee.roles;
        return copy;
    }

    // get all roles from employee
    public getAllRolesFromEmployee(employeeId: number): Promise<Role[]> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    }
                    )
                };
                const url = this.global.globalUrl + '/employee/roles/' + employeeId;
                return this.http.get<Role[]>(url, httpOption).toPromise();
            }
        });
    }

    // get all roles
    public getAllRoles(): Promise<Role[]> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    }
                    )
                };
                return this.http.get<Role[]>(this.roleUrl, httpOption).toPromise();
            }
        });
    }

    // get one role
    public getRole(roleId) {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = `${this.roleUrl}/${roleId}`;
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    }
                    )
                };
                return this.http.get<Role[]>(url, httpOption).toPromise();
            }
        });
    }

    // add role to employee
    public addRole(employeeId: number, roleId: number) {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    'role_ID': roleId,
                    'employee_ID': employeeId
                };
                // http://localhost/PSA/psa-server/public/api/role/assignEmployee?role_ID=6&employee_ID=1
                const url = this.employeeUrl + '/assignRole';
                return this.http.post(url, postData, httpOption).toPromise();
            }
        });
    }

    // removes a role from an employee
    public removeRole(employeeId: number, roleId: number) {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    'role_ID': roleId,
                    'employee_ID': employeeId
                };
                // employee/unassignRole?role_ID=9&employee_ID=1
                const url = this.employeeUrl + '/unassignRole';
                return this.http.post(url, postData, httpOption).toPromise();
            }
        });
    }

    //assign a ppe to a employee
    assignOne(employee, ppe) {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    'employee_ID': employee.employee_ID,
                    'sn': ppe.sn,
                    'stock_ID': 1
                };
                const url = this.global.globalUrl + '/ppe/assign'
                return this.http.post(url, postData, httpOption).toPromise();
            }
        });
    }

    //unassign a ppe from a employee
    unassignOne(stock, ppe) {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    'sn': ppe.sn,
                    'stock_ID': stock
                };
                const url = this.global.globalUrl + '/ppe/unassign'

                return this.http.post(url, postData, httpOption).toPromise();
            }
        });
    }

    //get all pes from a employee
    getAllPesFromEmployee(employeeID: number): Promise<Pe[]> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = this.global.globalUrl + '/role/pes/' + employeeID;
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                return this.http.get<Pe[]>(url, httpOption).toPromise();
            }
        });
    }

}
