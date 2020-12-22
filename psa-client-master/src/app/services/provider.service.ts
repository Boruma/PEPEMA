import {Injectable} from '@angular/core';
import {Events} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ProviderService {

    //public globalUrl = "http://192.168.178.222/PSA/psa-server/public/api";
    public globalUrl = 'http://localhost/PSA/psa-server/public/api';
    public goBackBy = 1;

    constructor(private events: Events) {
    }
}
