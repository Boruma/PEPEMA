import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Role } from '../models/role';
import { Observable } from 'rxjs';


const TOKEN_KEY = 'auth-token';

@Injectable({
    providedIn: 'root'
})

export class RoleService {

    roleUrl: string = this.global.globalUrl + '/role';

    public _updateRoleMobile: any = null;
    public _removeRoleMobile: any = null;
    public updateObservable;
    public removeObservable;

    constructor(private http: HttpClient, public global: ProviderService, private storage: Storage) {

        this._updateRoleMobile = Observable.create(observer => {
            this.updateObservable = observer;
        });

        this._removeRoleMobile = Observable.create(observer => {
            this.removeObservable = observer;
        });
    }

    public updateRoleMobile() {
        this.updateObservable.next();
    }

    public removeRoleMobile() {
        this.removeObservable.next();
    }

    // creates a role
    createRole(name: string): Promise<Role> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                const postData = {
                    'name': name
                };
                return this.http.post<Role>(this.roleUrl, postData, httpOption).toPromise();
            }
        });
    }

    createAndGetRole(role: Role): Promise<any> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    'role': role
                };
                return this.http.post(this.roleUrl, postData, httpOption).toPromise();
            }
        });
    }

    // gets the values of a role from the db
    getRole(id: number): Promise<Role> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = `${this.roleUrl}/${id}`;
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                return this.http.get<Role>(url, httpOption).toPromise();
            }
        });
    }


    // gets the values of all roles from the db
    getRoles(): Promise<Role[]> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                return this.http.get<Role[]>(this.roleUrl, httpOption).toPromise();
            }
        });
    }

    // Changes the values of roles
    editRole(name: string, id: number): Promise<Role> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    'name': name,
                    'role_ID': id
                };
                return this.http.put<Role>(this.roleUrl, postData, httpOption).toPromise();
            }
        });
    }

    //delete one role
    deleteRole(id: number) {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = `${this.roleUrl}/${id}`;
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + res
                    })
                };
                return this.http.delete(url, httpOption).toPromise();
                // gets a 201 state with success: "deleted entity"
            }
        });
    }

    public copyRole(role: Role): Role {
        const copy: Role = <Role>{};
        copy.role_ID = role.role_ID;
        copy.name = role.name;
        return copy;
    }
}
