import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorhandlingService {

  constructor(private ts: ToastService) { }

  async error(error: any
  ) {
    if (error.status) {
      let error_message: string;
      switch (error.status) {
        case 400: {
          error_message = "Die Anfrage an den Server ist nicht gültig. (" + error.status + ")";
          break;
        }
        case 401: {
          error_message = "Du bist nicht authorisiert für diese Anfrage. (" + error.status + ")";
          break;
        }
        case 404: {
          error_message = "Ein notwendiges Objekt für die Anfrage ist nicht vorhanden. (" + error.status + ")";
          break;
        }
        default: {
          error_message = "Es ist ein Fehler aufgetreten. (" + error.name + ": " + error.status + ")";
          break;
        }
      }
      this.ts.presentToast(error_message);
    }
  }
}
