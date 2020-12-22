import { Component, OnInit } from '@angular/core';
import { PsatemplateService } from '../../../services/psatemplate.service';
import { Events, LoadingController, AlertController } from '@ionic/angular';
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { Router, NavigationExtras } from '@angular/router';
import { ProviderService } from '../../../services/provider.service';

@Component({
    selector: 'app-list-psatemplate',
    templateUrl: './list-psatemplate.component.html',
    styleUrls: ['./list-psatemplate.component.scss'],
})
export class ListPsatemplateComponent implements OnInit {

    public templates = [];
    public alltemplateforSearch = [];
    listIndex: any;
    constructor(private psatemplateService: PsatemplateService,
        private loadingController: LoadingController,
        private errorService: ErrorhandlingService,
        private router: Router,
        private alertCtrl: AlertController,
        private events: Events,
        private provider: ProviderService) {
        this.alltemplateforSearch = this.templates;

        this.events.subscribe('updateTemplates', () => {
            this.getAllPsaTemplates();
        });
        this.events.subscribe('addTemplate', () => {
            this.openAddWithState();
        });

    }

    sortasc() {
        this.templates.sort((a, b) => (a.name > b.name) ? 1 : -1);
    }

    sortdesc() {
        this.templates.sort((a, b) => (a.name < b.name) ? 1 : -1);
    }

    sortupdateasc() {
        this.templates.sort((a, b) => (a.updated_at > b.updated_at) ? 1 : -1);
    }

    sortupdatedesc() {
        this.templates.sort((a, b) => (a.updated_at < b.updated_at) ? 1 : -1);
    }

    sortdateasc() {
        this.templates.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1);
    }

    sortdatedesc() {
        this.templates.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1);
    }

    setListIndex(i) {
        this.listIndex = i;
    }


    onSearchTerm(ev: CustomEvent) {
        this.templates = this.alltemplateforSearch;

        const val = ev.detail.value;
        if (val.trim() !== '') {
            this.templates = this.templates.filter(term => {
                return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
            });
        }
    }

    //Array to fill the Dropdown List
    public dropdownOptions = [
        { id: 0, val: 'Schablonen sortieren' },
        { id: 1, val: 'A-Z' },
        { id: 2, val: 'Z-A' },
        { id: 3, val: 'Änderung aufsteigend' },
        { id: 4, val: 'Änderung absteigend' },
        { id: 5, val: 'Erstellung aufsteigend' },
        { id: 6, val: 'Erstellung absteigend' }
    ];

    //change this for the default value of the Dropdown
    public dropdownDefault = 0;

    //Function that is called when the value of the dropDown changes
    public dropdownFunction($event) {
        switch ($event.detail.value) {
            case '1':
                this.sortasc();
                break;
            case '2':
                this.sortdesc();
                break;
            case '3':
                this.sortupdateasc();
                break;
            case '4':
                this.sortupdatedesc();
                break;
            case '5':
                this.sortdateasc();
                break;
            case '6':
                this.sortdatedesc();
                break;
            default:
                break;
        }

    }

    deltePsaTemplate(id) {
        let templateToChange;
        this.templates.forEach((item, index) => {
            if (item.pe_ID == id) {
                templateToChange = index;
            }
        });
        this.templates.splice(templateToChange, 1);
        this.alltemplateforSearch = this.templates;
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({

        }).then(res => {
            loading = res;
            loading.present();
            this.psatemplateService.deltePsaTemplate(id)
                .catch(error => {
                    //Errorhandling
                    this.errorService.error(error);
                    loading.dismiss();
                });
            loading.dismiss();
        });

    }


    getAllPsaTemplates() {
        let loading: HTMLIonLoadingElement;
        this.loadingController.create({

        }).then(res => {
            loading = res;
            loading.present();
            this.psatemplateService.getPsaTemplates().then(data => {
                this.templates.length = 0;
                for (let psatemplate of data) {
                    this.templates.push(psatemplate);
                }
                loading.dismiss();
            }).catch(error => {
                //Errorhandling
                this.errorService.error(error);
                loading.dismiss();
            });
        });
    }


    openDetailsWithState(template) {
        let navigationExtras: NavigationExtras = {
            state: {
                template: template
            }
        };
        this.router.navigate(['users/pe/details'], navigationExtras);
    }

    updateDetails(template) {
        this.events.publish('showPsa', (template));
    }

    openUpdateWithState(template) {
        let navigationExtras: NavigationExtras = {
            state: {
                template: template
            }
        };
        this.router.navigate(['users/pe/edit'], navigationExtras);
    }

    openAddWithState() {
        let navigationExtras: NavigationExtras = {
            state: {}
        };
        this.router.navigate(['users/pe/add'], navigationExtras);
    }

    ngOnInit() {
        this.getAllPsaTemplates();
    }

    ionViewDidEnter() {
        this.getAllPsaTemplates();
    }

    ionViewDidLeave() {
        this.templates = [];
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

}
