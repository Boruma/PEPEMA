import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {
  }
  
  //shows a toast with the given message
  async presentToast(toast_string: string) {
      const toast = await this.toastController.create({
          message: toast_string,
          duration: 4000
      });
      toast.present();
  }
}
