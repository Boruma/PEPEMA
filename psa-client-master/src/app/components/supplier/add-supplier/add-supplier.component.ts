import { Component, OnInit } from '@angular/core';
import { Events, LoadingController } from '@ionic/angular';
import { ErrorhandlingService } from '../../../services/errorhandling.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../../services/supplier.service';
import { Address } from '../../../models/address';
import { Supplier } from '../../../models/supplier';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-supplier',
    templateUrl: './add-supplier.component.html',
    styleUrls: ['./add-supplier.component.scss'],
})
export class AddSupplierComponent implements OnInit {

    createForm: FormGroup;
    supplier: Supplier = {} as Supplier;


    attemptedSubmit = false;
    supplierAdded = false;

    constructor(public formBuilder: FormBuilder,
        private supplierService: SupplierService,
        private errorService: ErrorhandlingService,
        private loadingController: LoadingController,
        private router: Router,
        private events: Events) {
        this.createForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(40),
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            street: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
            housenumber: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
            postcode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
            place: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
            address_additional: ['', [Validators.minLength(2), Validators.maxLength(30)]]
        });

        this.supplier.address = new Address();
    }

    createSupplier() {

        this.attemptedSubmit = true;
        if (this.createForm.valid) {
            let loading: HTMLIonLoadingElement;
            this.loadingController.create({

            }).then(res => {
                loading = res;
                loading.present();
                this.supplierService.createSupplier(this.supplier)
                    .then(newSupplier => {

                        this.attemptedSubmit = false;
                        this.markFieldsReset();
                        loading.dismiss();

                        this.supplier = {} as Supplier;
                        this.events.publish('reloadSuppliers');
                        this.router.navigate(['users/supplier']);
                    })
                    .catch(error => {
                        // Errorhandling
                        this.errorService.error(error);
                        loading.dismiss();
                    });
            });
        } else {
            this.markFieldsDirty();
        }
    }

    markFieldsDirty() {
        for (const field in this.createForm.controls) {
            this.createForm.controls[field].markAsDirty();
        }
    }

    markFieldsReset() {
        for (const field in this.createForm.controls) {
            this.createForm.controls[field].reset();
        }
    }

    ngOnInit() {
    }

    // error messages for different errors
    validation_messages = {
        name: [
            { type: 'required', message: 'Bitte ein gültigen Namen eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 50 Zeichen bestehen.' }
        ],
        email: [
            { type: 'required', message: 'Bitte eine gültige Email eintragen.' },
            { type: 'email', message: 'Die Email Adresse muss gültig sein.' },
            { type: 'pattern', message: 'Die Email Adresse muss folgendes Format haben: xxxx@xx.xx' },
            { type: 'maxlength', message: 'Die Email darf maximal aus 40 Zeichen bestehen.' }
        ],
        street: [
            { type: 'required', message: 'Bitte eine gültige Straße eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 20 Zeichen bestehen.' }
        ],
        housenumber: [
            { type: 'required', message: 'Bitte eine gültige Hausnummer eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 1 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 10 Zeichen bestehen.' }
        ],
        postcode: [
            { type: 'required', message: 'Bitte eine gültige PLZ eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 10 Zeichen bestehen.' }
        ],
        place: [
            { type: 'required', message: 'Bitte einen gültigen Ort eintragen.' },
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 30 Zeichen bestehen.' }
        ],
        address_additional: [
            { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
            { type: 'maxlength', message: 'Der Name darf maximal aus 30 Zeichen bestehen.' }
        ]
    };

}
