import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { Company } from 'src/app/models/company';

@Component({
    selector: 'app-add-company',
    templateUrl: './add-company.page.html',
    styleUrls: ['./add-company.page.scss'],
})

export class AddCompanyPage implements OnInit {
    createForm: FormGroup;
    company: Company = <Company>{};
    name: String;

    constructor(public formBuilder: FormBuilder,
        private companyService: CompanyService,
        private errorService: ErrorhandlingService) {
        this.createForm = this.formBuilder.group({
            name: new FormControl('', Validators.compose([
                Validators.required,
                Validators.minLength(2)
            ]))
        });
    }

    ngOnInit() {
    }

    //creates a new company
    createCompany() {
        this.companyService.createCompany(this.company)
            .catch(error => {
                this.errorService.error(error);
            });
    }
}
