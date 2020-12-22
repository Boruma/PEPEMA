import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { ProviderService } from "./provider.service";

const TOKEN_KEY = 'auth-token';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  urlUser: string = this.global.globalUrl;

  constructor(private http: HttpClient, private storage: Storage, public global: ProviderService) {
  }

  //login a user in the db
  loginUser(email: string, password: string): Promise<any> {
    const url = `${this.urlUser}/login`;
    let postData = {
      "email": email,
      "password": password,
    };
    return this.http.post(url, postData, httpOptions).toPromise();
  }

  //register a user in the db
  registerUser(name: string, email: string, password: string, role: string, phonenumber: string, company_ID: number = null): Promise<any> {
    const url = `${this.urlUser}/register`;
    let postData = {
      "name": name,
      "email": email,
      "password": password,
      "role": role,
      "phonenumber": phonenumber,
      "company_ID": company_ID
    };
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };
    return this.http.post(url, postData, httpOption).toPromise();
  }

  //get one user from the db
  getUserDetails(): Promise<any> {
    const url = `${this.urlUser}/user`;
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
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
}
