import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";
import { LoadingController, MenuController, Platform } from "@ionic/angular";
import { UserService } from "../../services/user.service";
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { ToastService } from 'src/app/services/toast.service';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  user: User = <User>{};
  attemptedSubmit: boolean = false;
  password: string;
  companyExists: boolean = true;
  android: boolean = false;
  ios: boolean = false;


  constructor(public fb: FormBuilder, private authService: AuthenticationService,
    private router: Router, public plt: Platform, private userService: UserService,
    private loadingController: LoadingController, private errorHandler: ErrorhandlingService,
    private menuCtrl: MenuController, private ts: ToastService, private companyService: CompanyService) {
      //Defeniert die Validierung der Eingabefelder
    this.loginForm = fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

      //Schaut, ob bereits ein Benutzer existiert und wenn, dann loggt sich damit ein
    this.plt.ready().then(() => {
        this.loadUser();
    });

    this.android = this.plt.is('android');
    this.ios = this.plt.is('ios');

  }

  ngOnInit() {
      //Verhindern, dass ein zweiten Unternehmen angelegt werden kann.
      //Das führt noch zu Probleme, da z.B SN der PPE und Rollenname Unique sind
      //Und ein weitere Unternehmen nicht die selben haben kann
    this.companyService.getCompanies().then(companies => {
      if (companies.length > 0) {
        this.companyExists = true;
      }
      else {
        this.companyExists = false;
      }
    }).catch(res => {
      this.companyExists = false;
    });
  }


    ionViewWillEnter() {
        //Verhindern, dass ein zweiten Unternehmen angelegt werden kann.
        //Das führt noch zu Probleme, da z.B SN der PPE und Rollenname Unique sind
        //Und ein weitere Unternehmen nicht die selben haben kann
    this.companyService.getCompanies().then(companies => {
      if (companies.length > 0) {
        this.companyExists = true;
      }
      else {
        this.companyExists = false;
      }
    }).catch(res => {
      this.companyExists = false;
    });
  }

    //Prüft ob User schon angemeldet ist
  loadUser() {
    let loading: HTMLIonLoadingElement;
    this.loadingController.create({
    }).then(res => {
      loading = res;
      loading.present();
        //1. Informationen über User holen
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['users/ppe']);
        loading.dismiss();
      } else {
        loading.dismiss();
      }
    });
  }

    //Loggt User in Laravel ein, dann setzt lokale Daten, dann leitet weiter auf Home Seite
  loginUser() {
    let loading: HTMLIonLoadingElement;
    this.loadingController.create({
    }).then(res => {
      loading = res;
      loading.present();
    });
      //1. Login in Laravel
    this.userService.loginUser(this.user.email, this.password).then((res) => {
        //2. User Rechte geben
      this.authService.login(res.success.token).then(() => {
          //3. Loginprozess starten
          //alert("erfolgreich"); // Test, Dev
        this.router.navigate(['users/ppe']);
        if (loading != null) loading.dismiss();
      }).catch((error) => {
        this.errorHandler.error(error);
        if (loading != null) loading.dismiss();
      });
    }).catch(error => {
      if (error.status == 401) {
        this.ts.presentToast("Email oder Passwort falsch!");
        this.password = "";
      } else {
        this.errorHandler.error(error);
      }
      if (loading != null) loading.dismiss();
    });
  }

    //wird durch LogIn Button aufgerufen
  logIn() {
    this.attemptedSubmit = true;
    if (this.loginForm.valid) {
      this.loginUser();
    } else {
      this.markFieldsDirty();
    }
  }

    //Markiert die invaliden Eingabefelder
  markFieldsDirty() {
    for (var field in this.loginForm.controls) {
      this.loginForm.controls[field].markAsDirty();
    }
  }

    //Fehlermeldungen anhand der verschiedenen Fehler:
  validation_messages = {
    'email': [
      { type: 'required', message: 'Bitte geben Sie eine gültige Email Adresse ein.' },
      { type: 'email', message: 'Korrekte Email muss angegeben werden.' }
    ],
    'password': [
      { type: 'required', message: 'Bitte geben Sie ein gültiges Passwort ein.' },
        {type: 'minlength', message: 'Das Passwort muss mindestens 6 Zeichen lang sein.'},
    ]
  }

}
