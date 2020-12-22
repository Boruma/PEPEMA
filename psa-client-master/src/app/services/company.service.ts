import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProviderService } from "./provider.service";
import { Storage } from "@ionic/storage";
import { Company } from '../models/company';

const TOKEN_KEY = 'auth-token';

@Injectable({
    providedIn: 'root'
})

export class CompanyService {

    companyUrl: string = this.global.globalUrl + '/company';

    constructor(private http: HttpClient, public global: ProviderService, private storage: Storage) {
    }

    getCompanies(): Promise<Company[]> {
        const url = this.global.globalUrl + '/companies';;
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.http.get<Company[]>(url, httpOption).toPromise();
    }

    getUserCompany(): Promise<Company> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = `${this.companyUrl}`;
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                return this.http.get<Company>(url, httpOption).toPromise();
            }
        });
    }

    // creates a company
    createCompany(company: Company): Promise<any> {
        const httpOption = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        let postData = {
            "company": company
        };
        return this.http.post(this.companyUrl, postData, httpOption).toPromise();
    }

    //delete company
    deleteEntity(id: number) {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = `${this.companyUrl}/${id}`;
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

    //returns the stock of the company
    getStock() {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = this.global.globalUrl + '/stock';
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
