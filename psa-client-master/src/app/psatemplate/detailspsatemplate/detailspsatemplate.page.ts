import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pe } from '../../models/pe';
import { PsatemplateService } from '../../services/psatemplate.service';
import { Events } from '@ionic/angular';

@Component({
    selector: 'app-detailspsatemplate',
    templateUrl: './detailspsatemplate.page.html',
    styleUrls: ['./detailspsatemplate.page.scss'],
})
export class DetailspsatemplatePage implements OnInit {

    data: any;
    private Pe = <Pe>{};

    constructor(private route: ActivatedRoute, private router: Router, private templateService: PsatemplateService, private events: Events) {
        //Get Parameters of Routing
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.Pe = this.router.getCurrentNavigation().extras.state.template;
            } else {
                this.router.navigate(['users/employees']);
            }
        });
        this.events.publish('updateMenuSelected');
    }

    public updateTemplate() {
        this.templateService.updateTemplateobile();
    }

    public deleteTemplate() {
        this.templateService.removeTemplateMobile();
    }

    ngOnInit() {
        let testempty = new Pe();
        if (this.Pe == testempty) {
            this.router.navigate(['users/pe']);
        }
    }
}
