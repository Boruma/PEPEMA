import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { CompanyService } from 'src/app/services/company.service';
import { PsaService } from "../../../services/psa.service";
import { SupplierService } from "../../../services/supplier.service";
import { OrderService } from "../../../services/order.service";
import { PPE } from 'src/app/models/ppe';
import { Property } from 'src/app/models/property';
import { size } from 'src/app/models/size';
import { size_range } from 'src/app/models/size_range';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { Events } from '@ionic/angular';
import { Supplier } from 'src/app/models/supplier';
import { Pe } from 'src/app/models/pe';
import { Role } from 'src/app/models/role';
import { AddOrderComponent } from '../../order/add-order/add-order.component';
import { Order } from 'src/app/models/order';
import { PopoverController } from '@ionic/angular';
import { AddPropertyComponent } from '../../psatemplate/add-property/add-property.component';

@Component({
  selector: 'app-create-psa',
  templateUrl: './create-psa.component.html',
  styleUrls: ['./create-psa.component.scss'],
})
export class CreatePsaComponent implements OnInit {


  //übergebene Daten
  private incomingUrl: string;
  private stockOrOrder: number = -1; //0=Stock,  1=Order 
  supplier: Supplier = <Supplier>{}; //for finding possible pe
  private addOrderComponent: AddOrderComponent;

  private stock: boolean = true;

  pes: Pe[] = new Array<Pe>(); //selection of alle possible items
  private pesIsEmpty: boolean = true;

  public psaForm: FormGroup;
  private size: size;
  private sn: any;
  ppe: PPE = new PPE();
  peIsChoosed = false;

  constructor(

    public formBuilder: FormBuilder,
    private psaService: PsaService,
    private supplierService: SupplierService,
    private orderService: OrderService,
    private errorService: ErrorhandlingService,
    public alertController: AlertController,
    public router: Router,
    private events: Events,
    private loadingController: LoadingController,
    private companyService: CompanyService,
    public popoverController: PopoverController
  ) {

    this.getRoutingData();
    if (this.supplier.supplier_ID != null) {
      this.getPesForSupplier();
    }
    this.preparePpe();

    this.ppe.properties = Array<Property>();
    this.ppe.size_ranges = Array<size_range>();
    this.psaForm = this.formBuilder.group({

      comment: new FormControl('', Validators.compose([
        Validators.maxLength(150),
      ])),

      properties: new FormArray([]),
    });

    this.events.subscribe('updateProperty', (obj) => {
      let properties = this.ppe.properties[obj.index];
      if (properties != null) {
        if (properties.text != null && properties.text != "") {
          this.ppe.properties[obj.index].text = obj.psaForm.value.text;
        }
        if (properties.minValue != null) {
          this.ppe.properties[obj.index].minValue = obj.psaForm.value.minValue;
        }
        if (properties.maxValue != null) {
          this.ppe.properties[obj.index].maxValue = obj.psaForm.value.maxValue;
        }
        if (properties.date != null) {
          this.ppe.properties[obj.index].date = obj.psaForm.value.date;
        }
        if (properties.intervall != null) {
          this.ppe.properties[obj.index].intervall = obj.psaForm.value.intervall;

        }
      }
    });

  }

  ngOnInit() {
  }

  //Caller has to transfer infos
  private getRoutingData() {
    if (this.router.getCurrentNavigation() != null && this.router.getCurrentNavigation().extras.state != null) {

      this.stockOrOrder = this.router.getCurrentNavigation().extras.state.stockType;
      this.supplier = this.router.getCurrentNavigation().extras.state.supplier;
      //order_ID = null if add-order is calling; order_ID = 139 (e.g.) if show-order is calling
      this.ppe.order_ID = this.router.getCurrentNavigation().extras.state.order_ID;
      this.incomingUrl = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  private preparePpe() {
    if (this.stockOrOrder == 0) {
      this.companyService.getStock().then(res => {

        this.ppe.stock_ID = res['stock_ID'];

        this.stock = true;
      })
        .catch(res => {
        });
    }
    //add PPE to Order 
    else if (this.stockOrOrder == 1) {
      this.ppe.stock_ID = null;
      this.stock = false;
    }
  }

  //selection of PSA for the User - in createPsa
  private getPesForSupplier() {
    let loading: HTMLIonLoadingElement;
    this.loadingController.create({
    }).then(res => {
      loading = res;
      loading.present();
      this.supplierService.getAllPEBySupplier(this.supplier.supplier_ID).then(resPes => {
        this.pes = resPes;
        if (this.pes.length != 0) {
          this.pesIsEmpty = false;
        }
        loading.dismiss();
      }).catch(error => {
        //Errorhandling here
        this.errorService.error(error);
        loading.dismiss();
      });
    });
  }

  async addPropertyMobile(show: boolean, data: any, index: any) {

    let properties = this.ppe.properties[index];
    let name, text, minValue, maxValue, date, intervall, type;
    let namedisabled, textdisabled, minvaluedisabled, maxvaluedisabled, datedisable, intervalldisabled, typedisabled;
    if (properties.name != null && properties.name != "") {
      name = properties.name;
      namedisabled = false;
    }
    else {
      name = '';
      namedisabled = true;
    }
    if (properties.text != null) {
      text = properties.text;
      textdisabled = false;
    }
    else {
      text = '';
      textdisabled = true;
    }
    if (properties.minValue != null) {
      minValue = properties.minValue;
      minvaluedisabled = false;
    }
    else {
      minValue = '';
      minvaluedisabled = true;
    }

    if (properties.maxValue != null) {
      maxValue = properties.maxValue;
      maxvaluedisabled = false;
    }
    else {
      maxValue = '';
      maxvaluedisabled = true;
    }
    if (properties.date != null) {
      date = properties.date;
      datedisable = false;
    }
    else {
      date = '';
      datedisable = true;
    }
    if (properties.intervall != null) {
      intervall = properties.intervall;
      intervalldisabled = false;
    }
    else {
      intervall = '';
      intervalldisabled = true;
    }
    if (properties.type != null && properties.type != "") {
      type = properties.type;
      typedisabled = false;
    }
    else {
      type = '';
      typedisabled = true;
    }
    let prop: FormGroup = this.formBuilder.group({
      name: [{ value: name, disabled: namedisabled }, [Validators.required, Validators.min(2), Validators.max(50)]],
      text: [{ value: text, disabled: textdisabled }, [Validators.required, Validators.min(2), Validators.max(50)]],
      minValue: [{ value: minValue, disabled: minvaluedisabled }, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
      maxValue: [{ value: maxValue, disabled: maxvaluedisabled }, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1)]],
      date: { value: date, disabled: datedisable },
      intervall: { value: intervall, disabled: intervalldisabled },
      type: { value: type, disabled: typedisabled },
    });
    const popover = await this.popoverController.create({
      component: AddPropertyComponent,

      translucent: true,
      cssClass: 'custom_popover',
      componentProps: { 'data': prop, 'show': show, 'index': index, 'ppe': true },
    });
    this.events.subscribe('addPropertyToPe', (pe) => {
      popover.dismiss();
    });
    this.events.subscribe('updateProperty', (pe) => {
      popover.dismiss();
    });
    return await popover.present();
  }

  addTemplateToPpe($event) {
    let loading: HTMLIonLoadingElement;
    this.loadingController.create({
    }).then(res => {
      loading = res;
      loading.present();
      this.ppe.pe = this.getPeById($event.detail.value);
      if (this.ppe.pe != null) {
        this.ppe.pe_ID = this.ppe.pe.pe_ID;
        //add Properties
        if (this.ppe.pe.properties != null && this.ppe.pe.properties.length != 0) {
          this.ppe.pe.properties.forEach(property => {
            this.addProperty(property);
          });
        }
        //empty Properties
        else {
          this.ppe.properties = Array<Property>();
          this.properties.clear();
        }
        //add Sizes
        if (this.ppe.pe.size_ranges != null && this.ppe.pe.size_ranges.length != 0) {
          this.ppe.pe.size_ranges.forEach(sr => {
            this.ppe.size_ranges.push(new size_range(sr.sizes[0], sr.sizer_ID, sr.name));
          });
        }
        //empty sizes
        else {
          this.ppe.size_ranges = Array<size_range>();
        }
      }
      this.peIsChoosed = true;
      loading.dismiss();
    });
  }

  private getPeById(id): Pe {
    for (var pe of this.pes) {
      if (pe.pe_ID == id) {
        return pe;
      }
    }
    return null;
  }

  get properties(): FormArray {
    return this.psaForm.get('properties') as FormArray;
  }

  createProperty(property: Property): FormControl {
    switch (property.type) {
      case 'upValueRange':
        return new FormControl('', Validators.compose([
          Validators.min(0)
        ]));
        break;
      case 'downValueRange':
        return new FormControl('', Validators.compose([
          Validators.min(0)
        ]));
        break;
      case 'value':
        return new FormControl('', Validators.compose([
          Validators.min(0)
        ]));
        break;
      case 'date':
        return new FormControl('', Validators.compose([

        ]));
        break;
      case 'text':
        return new FormControl('', Validators.compose([
          Validators.minLength(2)
        ]));
        break;
      case 'intervall':
        return new FormControl('', Validators.compose([
          Validators.min(1)
        ]));
        break;
    }
  }

  addProperty(property: Property) {
    if (property != null) {
      this.properties.push(this.createProperty(property));
    }
    if (property != null) {
      this.ppe.properties.push(new Property(property));
    }
  }

  addSizeToPsa($event) {
    let range_id = $event.srcElement.id;
    let ppe_range: size_range;
    let range: size_range;
    this.ppe.pe.size_ranges.forEach(sr => {
      if (sr.sizer_ID == range_id) {
        range = sr;
      }
    });
    this.ppe.size_ranges.forEach(sr => {
      if (sr.sizer_ID == range_id) {
        ppe_range = sr;
      }
    });
    for (var s of range.sizes) {
      if (s.size_ID == $event.detail.value) {
        if (ppe_range != null) {
          ppe_range.sizes[0] = s;
        }
        else {
          this.ppe.size_ranges.push(new size_range(s, range.sizer_ID, range.name));
        }
      }
    }
  }

  addPsa() {
    //add PPE to tmpOrder
    if (this.stockOrOrder == 1) {
      this.orderService.addNewPpe(this.ppe);
      //creates ppe in db and go back to caller page with the Order
      if (this.ppe.order_ID != null) {
        this.getOrderGoBack(this.ppe.order_ID);
      }
      //go back to caller page without params
      else {
        this.router.navigate([this.incomingUrl]); //back to caller Page
      }
    }
  }

  //creates ppe in db and go back to caller page with the Order
  async getOrderGoBack(id) {
    const loading = await this.loadingController.create({
    });
    await loading.present();
    //create ppe
    this.psaService.createPsa(this.ppe).then(() => {
      //go back with order
      this.orderService.getOrder(id).then(order => {
        let navigationExtras: NavigationExtras = {
          state: {
            order: order,
            url: this.router.url,
          }
        };
        this.router.navigate([this.incomingUrl], navigationExtras);
        loading.dismiss();

      }, err => {
        loading.dismiss();
      });

    }, err => {
      loading.dismiss();
    });
  }

  validation_messages = {
    'sn': [
      { type: 'required', message: 'Bitte eine gültige SN eintragen.' },
      { type: 'minlength', message: 'Die SN muss mindesten aus 2 Zeichen bestehen.' }
    ],
    'comment': [
      { type: 'maxlength', message: 'Der Kommentar darf maximal aus 150 Zeichen bestehen.' }
    ],
    'commissioningdate': [
    ],
    'state': [
      { type: 'maxlength', message: 'Der Status darf maximal aus 30 Zeichen bestehen.' }
    ],

  }

}
