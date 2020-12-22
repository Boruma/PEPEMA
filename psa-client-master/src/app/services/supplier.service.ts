import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Supplier } from '../models/supplier';
import { Pe } from '../models/pe';
import { Observable } from 'rxjs';


const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  supplierUrl: string = this.global.globalUrl + '/supplier';

  public _updateSupplierMobile: any = null;
  public _removeSupplierMobile: any = null;
  public updateObservable;
  public removeObservable;

  constructor(private http: HttpClient, public global: ProviderService, private storage: Storage) {
    this._updateSupplierMobile = Observable.create(observer => {
      this.updateObservable = observer;
    });

    this._removeSupplierMobile = Observable.create(observer => {
      this.removeObservable = observer;
    });
  }

  public updateSupplierMobile() {
    this.updateObservable.next();
  }

  public removeSupplierMobile() {
    this.removeObservable.next();
  }

  //returns all pes of a supplier
  getAllPEBySupplier(id): Promise<Pe[]> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const url = `${this.supplierUrl}/pes/${id}`;
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

  // creates a supplier
  createSupplier(supplier: Supplier): Promise<Supplier> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        const postData = {

          'name': supplier.name,
          'email': supplier.email,
          'address':
          {
            "place": supplier.address.place,
            "street": supplier.address.street,
            "housenumber": supplier.address.housenumber,
            "postcode": supplier.address.postcode,
            "address_additional": supplier.address.address_additional
          }

        };
        return this.http.post<Supplier>(this.supplierUrl, postData, httpOption).toPromise();
      }
    });
  }

  createAndGetSupplier(supplier: Supplier): Promise<any> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        let postData = {
          'name': supplier.name,
          'email': supplier.email,
          'address':
          {
            "place": supplier.address.place,
            "street": supplier.address.street,
            "housenumber": supplier.address.housenumber,
            "postcode": supplier.address.postcode,
            "address_additional": supplier.address.address_additional
          }

        };
        return this.http.post(this.supplierUrl, postData, httpOption).toPromise();
      }
    });


  }

  // gets the values of a supplier from the db
  getSupplier(id: number): Promise<Supplier> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const url = `${this.supplierUrl}/${id}`;
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        return this.http.get<Supplier>(url, httpOption).toPromise();
      }
    });

  }

  // gets the values of all suppliers from the db
  getSuppliers(): Promise<Supplier[]> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        return this.http.get<Supplier[]>(this.supplierUrl, httpOption).toPromise();
      }
    });
  }

  // Changes the values of supplier
  editSupplier(supplier: Supplier): Promise<Supplier> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const httpOption = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + res
          })
        };
        let postData = {
          'supplier_ID': supplier.supplier_ID,
          'name': supplier.name,
          'email': supplier.email,
          'address':
          {
            "place": supplier.address.place,
            "street": supplier.address.street,
            "housenumber": supplier.address.housenumber,
            "postcode": supplier.address.postcode,
            "address_additional": supplier.address.address_additional
          }

        };
        return this.http.put<Supplier>(this.supplierUrl, postData, httpOption).toPromise();
      }
    });
  }

  //delete one supplier
  deleteSupplier(id: number) {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        const url = `${this.supplierUrl}/${id}`;
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

  public copySupplier(supplier: Supplier): Supplier {
    const copy: Supplier = <Supplier>{};
    copy.supplier_ID = supplier.supplier_ID;
    copy.name = supplier.name;
    return copy;
  }
}
