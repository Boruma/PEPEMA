import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoadingController, MenuController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { CompanyService } from 'src/app/services/company.service';
import { Address } from 'src/app/models/address';
import { Company } from 'src/app/models/company';

@Component({
    selector: 'app-init-signup',
    templateUrl: './init-signup.page.html',
    styleUrls: ['./init-signup.page.scss'],
})
export class InitSignupPage implements OnInit {

    signupForm: FormGroup;
    addressForm: FormGroup;

    attemptedSubmit: boolean = false;
    name: string;
    email: string;
    password: string;
    phonenumber: string;
    c_password: string;
    user: User = {} as User;
    company: Company = {} as Company;

    addressToggle: boolean = false;
    showAddressDeleted: boolean = false;
    private showAdrDelActivate: boolean = null;

    constructor(public fb: FormBuilder, private userService: UserService,
        private errorHandler: ErrorhandlingService, private authService: AuthenticationService,
        private loadingController: LoadingController,
        private router: Router, private menuCtrl: MenuController,
        private companyService: CompanyService) {

        this.company.address = <Address>{};
        this.signupForm = fb.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
            email: ['', [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.maxLength(40)]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
            c_password: ['', Validators.required],
            phonenumber: ['', [Validators.minLength(7), Validators.maxLength(20)]],
            companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
            toggleAddress: ['',]
        },
            {
                validator: this.matchingPasswords('password', 'c_password'),
            }
        );
        this.addressForm = fb.group({
            place: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            street: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            housenumber: ['', [Validators.required, Validators.maxLength(10)]],
            postcode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
            address_additional: ['', [Validators.minLength(2), Validators.maxLength(30)]]
        });

        this.addressForm.disable();
    }

    ngOnInit() {
    }

   //register user in db
    signUp() {
        this.attemptedSubmit = true;
        if (this.signupForm.valid && (!this.addressToggle || this.addressForm.valid)) {
            let loading: HTMLIonLoadingElement;
            this.loadingController.create({}).then(res => {
                loading = res;
                loading.present();

                //create company
                this.companyService.createCompany(this.company).then(resComp => {
                    //1. register user
                    this.userService.registerUser(this.name, this.email, this.password, 'admin', this.phonenumber, resComp.company_ID).then(() => {
                        //2. login User
                        this.userService.loginUser(this.email, this.password).then((res) => {
                            //3. auth user
                            this.authService.login(res.success.token).then(() => {
                                this.router.navigate(['users/setup']);
                                loading.dismiss();
                            }).catch((error) => {
                                this.errorHandler.error(error);
                                loading.dismiss();
                            });
                        }).catch(error => {
                            this.errorHandler.error(error);
                            loading.dismiss();
                        });
                    }).catch(error => {
                        this.errorHandler.error(error);
                        loading.dismiss();
                    });
                }).catch((error) => {
                    this.errorHandler.error(error);
                    loading.dismiss();
                });
            });
        } else {
            this.markFieldsDirty();
        }
    }

    toggleAddressForm() {
        if (this.addressToggle) {
            if (this.showAdrDelActivate == null) {
                this.showAdrDelActivate = true;
            }
            this.addressForm.disable();
        } else {
            this.addressForm.enable();
        }
    }

    toggleDeleteMessage() {
        if (this.showAdrDelActivate === true) {
            if (this.showAddressDeleted) {
                this.showAddressDeleted = false;
            } else {
                this.showAddressDeleted = true;
            }
        }
    }

    //are the passwords matching
    matchingPasswords(passwordKey: string, c_passwordKey: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[c_passwordKey];

            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }

    //Error Messages
    validation_messages = {
        'email': [
            { type: 'required', message: 'Bitte eine gültige Email eintragen.' },
            { type: 'email', message: 'Die Email Adresse muss gültig sein.' },
            { type: 'pattern', message: 'Die Email Adresse muss folgendes Format haben: xxxx@xx.xx' },
            { type: 'maxlength', message: 'Die Email darf maximal aus 40 Zeichen bestehen.' }
        ],
        'name': [
            { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 20 Zeichen bestehen.' }
        ],
        'phonenumber': [
            { type: 'minlength', message: 'Die Telefonnummer muss mindestens aus 7 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Die Telefonnummer darf maximal aus 20 Zeichen bestehen.' }
        ],
        'password': [
            { type: 'required', message: 'Bitte ein gültges Passwort eintragen' },
            { type: 'minlength', message: 'Das Passwort muss mindestens 6 Zeichen haben.' },
            { type: 'maxlength', message: 'Das Passwort darf maximal aus 50 Zeichen bestehen.' }
        ],
        'c_password': [
            { type: 'required', message: 'Bitte das Passwort bestätigen' },
            { type: 'mismatchedPasswords', message: 'Die Passwörter stimmen nicht überein!' },
        ],
        'companyName': [
            { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 150 Zeichen bestehen.' }
        ],
        'place': [
            { type: 'required', message: 'Bitte ein gültigen Ort eintragen.' },
            { type: 'minlength', message: 'Der Ortsname muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Ortsname darf maximal aus 30 Zeichen bestehen.' }
        ],
        'street': [
            { type: 'required', message: 'Bitte eine gültige Straße eintragen.' },
            { type: 'minlength', message: 'Der Straßenname muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Straßenname darf maximal aus 50 Zeichen bestehen.' }
        ],
        'housenumber': [
            { type: 'required', message: 'Bitte eine gültige Hausnummer eintragen.' },
            { type: 'maxlength', message: 'Die Hausnummer darf maximal aus 10 Zeichen bestehen.' }
        ],
        'postcode': [
            { type: 'required', message: 'Bitte eine gültige PLZ eintragen.' },
            { type: 'minlength', message: 'Der PLZ muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Die PLZ darf maximal aus 10 Zeichen bestehen.' }
        ],
        'address_additional': [
            { type: 'minlength', message: 'Der Addresszusatz muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Addresszusatz darf maximal aus 30 Zeichen bestehen.' }
        ],
    }

    markFieldsDirty() {
        for (var field in this.signupForm.controls) {
            this.signupForm.controls[field].markAsDirty();
        }
        if (this.addressToggle) {
            for (var field2 in this.addressForm.controls) {
                this.addressForm.controls[field2].markAsDirty();
            }
        }
    }
}
