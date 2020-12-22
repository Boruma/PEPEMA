import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Pe } from '../../../models/pe';
import { Supplier } from '../../../models/supplier';
import { Events, LoadingController, AlertController } from '@ionic/angular';
import { PsatemplateService } from '../../../services/psatemplate.service';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { ProviderService } from '../../../services/provider.service';
import { SupplierService } from '../../../services/supplier.service';

@Component({
    selector: 'app-show-psatemplate',
    templateUrl: './show-psatemplate.component.html',
    styleUrls: ['./show-psatemplate.component.scss'],
})
export class ShowPsatemplateComponent implements OnInit {

    data: any;
    public suppliers: Supplier[] = <Supplier[]>{};
    public Pe: Pe = <Pe>{};


    constructor(private route: ActivatedRoute, private router: Router, private events: Events,
        private alertCtrl: AlertController,
        private loadingController: LoadingController,
        private psatemplateService: PsatemplateService,
        private errorService: ErrorhandlingService,
        private provider: ProviderService,
        private supplierService: SupplierService) {
        //Get Parameters of Routing
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.Pe = this.router.getCurrentNavigation().extras.state.template;

            }
        });

        this.supplierService.getSuppliers().then(sups => {
            this.suppliers = sups;
        });

        this.events.subscribe('showPsa', (template) => {
            this.Pe = template;
            this.suppliers.forEach(sup => {
                if (sup.supplier_ID == this.Pe.supplier_ID) {
                    this.Pe.supplier = sup;
                }
            });

        });

        this.psatemplateService._updateTemplateMobile.subscribe(() => {
            this.openUpdateWithState(this.Pe);
        });

        this.psatemplateService._removeTemplateMobile.subscribe(() => {
            this.presentAlertConfirm(this.Pe);
        });
    }

    ngOnInit() {
    }

    openUpdateWithState(template) {
        let navigationExtras: NavigationExtras = {
            state: {
                template: template
            }
        };
        this.router.navigate(['users/pe/edit'], navigationExtras);
    }

    async presentAlertConfirm(template) {
        const alert = await this.alertCtrl.create({
            header: 'Schablone löschen',
            message: template.name + ' wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {

                    }
                }, {
                    text: 'Löschen',
                    handler: () => {
                        this.deltePsaTemplate(template.pe_ID);
                    }
                }
            ]
        });
        await alert.present();
        let result = await alert.onDidDismiss();
    }

    deltePsaTemplate(template) {


        let loading: HTMLIonLoadingElement;
        this.loadingController.create({}).then(res => {
            loading = res;
            loading.present();
            this.psatemplateService.deltePsaTemplate(template).then(res => {
                this.router.navigate(['users/pe']);
                this.events.publish('updateTemplates');
            })
                .catch(error => {
                    //Errorhandling
                    this.errorService.error(error);
                    loading.dismiss();
                });
            loading.dismiss();
        });

    }

}
