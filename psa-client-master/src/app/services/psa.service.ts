import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ProviderService } from "./provider.service";
import { PPE } from 'src/app/models/ppe';
import { Storage } from "@ionic/storage";


const TOKEN_KEY = 'auth-token';

@Injectable({
    providedIn: 'root'
})
export class PsaService {

    apiUrl: string = this.global.globalUrl + "/ppe";
    peUrl: string = this.global.globalUrl + "/pe";
    private ppeCount: number;

    constructor(public http: HttpClient, public global: ProviderService, private storage: Storage) {
        this.ppeCount = 0;
    }

    public resetPpeCount() {
        this.ppeCount = 0;
    }

    //set ppe as delivered
    deliveredPPE(toChangePPE: PPE, newPPE_sn: string): Promise<any> {
        toChangePPE['newSN'] = newPPE_sn;
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = this.apiUrl + '/delivered';
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    "ppe": toChangePPE
                };

                return this.http.post(url, postData, httpOption).toPromise();
            }
        });
    }

    //get pes of a company
    getPes(): Promise<any> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = `${this.peUrl}`;
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

    //get one psa
    getPsa(id): Promise<any> {
        return this.storage.get(TOKEN_KEY).then(res => {

            if (res) {
                const url = `${this.apiUrl}/${id}`;
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

    //get one pe
    getPe(id): Promise<any> {
        return this.storage.get(TOKEN_KEY).then(res => {

            if (res) {
                const url = `${this.peUrl}/${id}`;
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

    //get all psas of a stock
    getPsas(stock_id): Promise<PPE[]> {
        return this.storage.get(TOKEN_KEY).then(res => {

            if (res) {
                const url = this.apiUrl + '/all';
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    "stock_ID": stock_id
                };

                return this.http.post<PPE[]>(url, postData, httpOption).toPromise();
            }
        });

    }

    //get all psas of a stock
    getPsasCompany(): Promise<PPE[]> {
        return this.storage.get(TOKEN_KEY).then(res => {

            if (res) {
                const url = this.apiUrl + '/allCompany';
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                };
                return this.http.post<PPE[]>(url, postData, httpOption).toPromise();
            }
        });

    }

    //get all psas of a employee
    getPsasToEmployee(employee_id): Promise<PPE[]> {
        return this.storage.get(TOKEN_KEY).then(res => {
            if (res) {
                const url = this.apiUrl + '/all';
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    "employee_ID": employee_id
                };

                return this.http.post<PPE[]>(url, postData, httpOption).toPromise();
            }
        });
    }

    //create a psa
    createPsa(psa: PPE): Promise<any> {
        if (psa.order_ID != null && psa.order_ID != 0) {
            let date: Date = new Date();
            let sn: string;

            sn = "order:" + psa.order_ID + "_" + date.getTime() + ++this.ppeCount;
            psa.sn = sn;
        }
        return this.storage.get(TOKEN_KEY).then(res => {

            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    "psa": psa
                };
                return this.http.post(this.apiUrl, postData, httpOption).toPromise();
            }
        });

    }

    //update one psa
    updatePsa(psa: PPE): Promise<any> {

        return this.storage.get(TOKEN_KEY).then(res => {

            if (res) {
                const httpOption = {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + res
                    })
                };
                let postData = {
                    "psa": psa
                };


                return this.http.put(this.apiUrl, postData, httpOption).toPromise();
            }
        });

    }

    //delete one psa
    deletePsa(id) {
        return this.storage.get(TOKEN_KEY).then(res => {

            if (res) {
                const url = `${this.apiUrl}/${id}`;
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
}
