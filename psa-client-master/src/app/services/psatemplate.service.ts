import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProviderService } from "./provider.service";
import { Storage } from "@ionic/storage";
import { Pe } from "../models/pe";
import { Role } from "../models/role";
import { Observable} from 'rxjs';


const TOKEN_KEY = 'auth-token';
@Injectable({
  providedIn: 'root'
})
export class PsatemplateService {
  psaTemplateUrl: string = this.global.globalUrl + '/pe';


  public _updateTemplateMobile: any = null;
  public _removeTemplateMobile: any = null;
  public updateObservable;
  public removeObservable;


  constructor(private http: HttpClient, public global: ProviderService, private storage: Storage) {


    this._updateTemplateMobile = Observable.create(observer => {
      this.updateObservable = observer;
    });

    this._removeTemplateMobile = Observable.create(observer => {
      this.removeObservable = observer;
    });
  }

  public updateTemplateobile() {
    this.updateObservable.next();
  }

  public removeTemplateMobile() {
    this.removeObservable.next();
  }


  //creates a psatemplate via http post request
  createPsaTemplate(template: Pe): Promise<any> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };

        let postData = {
          "name": template.name,
          "supplier_ID": template.supplier.supplier_ID,
          "properties": template.properties,
          "size_range": template.size_ranges,
          "roles": template.roles,
          "supplItemID": template.supplItemID
        }
        return this.http.post(this.psaTemplateUrl, postData, httpOption).toPromise();
      }
    });
  }

  //gets the values of an psatemplate from the db
  getPsaTemplate(id): Promise<any> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const url = `${this.psaTemplateUrl}/${id}`;
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        return this.http.get(url, httpOption).toPromise();
      }
    });
  }

  //gets the values of all templates from the db   
  getPsaTemplates(): Promise<Pe[]> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        return this.http.get<Pe[]>(this.psaTemplateUrl, httpOption).toPromise();
      }
    });
  }

  //delete one psatemplate
  deltePsaTemplate(id: number) {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const url = `${this.psaTemplateUrl}/${id}`;
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res

          })
        };
        return this.http.delete(url, httpOption).toPromise();
      }
    });
  }

  //update one psatemplate
  editPsaTemplate(template): Promise<any> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        let postData = {
          "pe_ID": template.pe_ID,
          "name": template.name,
          "supplier_ID": template.supplier_ID,
          "properties": template.properties,
          "size_range": template.size_ranges,
          "roles": template.roles
        }
        return this.http.put(this.psaTemplateUrl, postData, httpOption).toPromise();
      }
    });
  }



  // get all roles from PE
  public getAllRolesFromPe(PeId: number) {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        const url = this.global.globalUrl + '/pe/roles/' + PeId;
        return this.http.get<Role[]>(url, httpOption).toPromise();
      }
    });
  }

  // get all roles
  public getAllRoles() {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          }
          )
        };
        const url = this.global.globalUrl + '/role';
        return this.http.get<Role[]>(url, httpOption).toPromise();
      }
    });
  }

  // add role to pe
  public addRole(PeId: number, roleId: number) {
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
          'pe_ID': PeId
        };
        const url = this.global.globalUrl + '/pe/assignRole';
        return this.http.post(url, postData, httpOption).toPromise();
      }
    });
  }
  // removes a role from an pe
  public removeRole(PeId: number, roleId: number) {

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
          'pe_ID': PeId
        };
        const url = this.global.globalUrl + '/pe/unassignRole';
        return this.http.post(url, postData, httpOption).toPromise();
      }
    });
  }

}


