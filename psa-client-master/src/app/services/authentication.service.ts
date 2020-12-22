import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { ProviderService } from "./provider.service";

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  urlUser: string = this.global.globalUrl;
  authenticationState = new BehaviorSubject(false);

  constructor(private storage: Storage, private plt: Platform, public global: ProviderService) {
    this.plt.ready().then(() => {
      this.checkToken();
    });

  }

  //get authtoken from storage
  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }

  //checks if user is logged in
  isLoggedIn(): Promise<boolean> {
    return this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        return true;
      } else {
        return false;
      }
    });
  }

  logged(): boolean {
    return true;
  }

  //sets user as logged in
  login(authtoken: string) {
    return this.storage.set(TOKEN_KEY, authtoken).then(() => {
      this.authenticationState.next(true);
    });
  }

  //logouts user -> deletes user key from storage
  logout() {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  //called by authguard, checks if user is authorized
  isAuthenticated() {
    this.checkToken();
    return this.authenticationState.value;
  }
}
