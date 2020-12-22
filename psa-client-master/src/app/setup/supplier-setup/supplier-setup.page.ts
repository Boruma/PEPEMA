import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SetupService } from '../../services/setup.service';
import { PsatemplateService } from '../../services/psatemplate.service';
import { RoleService } from '../../services/role.service';
import { SupplierService } from '../../services/supplier.service';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Supplier } from '../../models/supplier';
import { Address } from 'src/app/models/address';
import { LoadingController, Events } from "@ionic/angular";
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-supplier-setup',
  templateUrl: './supplier-setup.page.html',
  styleUrls: ['./supplier-setup.page.scss'],
})
export class SupplierSetupPage implements OnInit {

  file: any;

  supplierForm: FormGroup;

  allSelected: boolean = true;

  public dropdownOptions = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private setupService: SetupService,
    private templateService: PsatemplateService,
    private roleService: RoleService,
    private supplierService: SupplierService,
    private errorService: ErrorhandlingService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private companyService: CompanyService,
    private events: Events) {

    this.file = setupService.file;


    //Get Suppliers for Dropdown via Supplier Service
    let loading: HTMLIonLoadingElement;
    this.loadingController.create({

    }).then(res => {
      loading = res;
      loading.present();
      this.supplierService.getSuppliers().then(data => {
        this.dropdownOptions.push({
          id: 0,
          val: " "
        });
        for (let supp of data) {

          this.dropdownOptions.push({
            id: supp.supplier_ID,
            val: supp.name
          });

        }

      })
        .catch(error => {
          //Errorhandling
          this.errorService.error(error);
          loading.dismiss();
        });
      loading.dismiss();
    });

    this.file.templates.forEach(pe => {

      let countSups = 0;

      pe.supplier.address = new Address();

    });

    this.supplierForm = this.formBuilder.group({

      suplID: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(11)]],

    });

  }

  validation_messages = {

    suplID: [
      { type: 'minlength', message: 'Der Name muss mindesten aus 2 Zeichen bestehen.' },
      { type: 'maxlength', message: 'Der Name darf maximal aus 11 Zeichen bestehen.' }
    ],
    supplier: [
      { message: "Bitte für jede Schablone einen Lieferanten auswählen" }
    ]
  }

  ngOnInit() {
  }

  public dropdownFunction($event, id) {
    this.file.templates[id].supplier_ID = $event.detail.value;
  }

  public setup() {
    this.allSelected = true;
    this.file.templates.forEach(pe => {

      if (pe.supplier_ID == null || pe.supplier_ID == " " || pe.supplier_ID == "") {
        this.allSelected = false;
      }
    });

    if (this.supplierForm.valid && this.allSelected) {
      let loading: HTMLIonLoadingElement;
      this.loadingController.create({

      }).then(res => {
        loading = res;
        loading.present();

        let countRoles = 1;
        this.file.roles.forEach(role => {
          this.roleService.createRole(role.name).then(res => {

            if (countRoles >= this.file.roles.length) {
              this.events.publish('createRolesFinished');
            }
            countRoles++;
          })
            .catch(error => {
              //Errorhandling here
              this.errorService.error(error);
            });
        });

        this.events.subscribe('createRolesFinished', () => {
          let count = 1;
          this.file.templates.forEach(pe => {

            pe.supplier.supplier_ID = pe.supplier_ID;

            this.templateService.createPsaTemplate(pe).then(res => {

              if (count >= this.file.templates.length) {
                this.router.navigate(['users/pe']);
              }
              count++;
            })
              .catch(error => {
                //Errorhandling here
                this.errorService.error(error);
              });

          });
        });
        loading.dismiss();
      });
    }
  }

}
