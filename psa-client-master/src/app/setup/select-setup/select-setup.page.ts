import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ErrorhandlingService } from 'src/app/services/errorhandling.service';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { SetupService } from '../../services/setup.service';
import { LoadingController } from "@ionic/angular";


@Component({
  selector: 'app-select-setup',
  templateUrl: './select-setup.page.html',
  styleUrls: ['./select-setup.page.scss'],
})
export class SelectSetupPage implements OnInit {

  setupForm: FormGroup;

  errorService: ErrorhandlingService;

  file: any;

  public dropdownOptions = [
    { id: 0, val: 'Feuerwehr' }
  ];

  constructor(public fb: FormBuilder, private http: HttpClient, private router: Router, private setupService: SetupService, private loadingController: LoadingController, ) {
    this.setupForm = fb.group({

      file: ['', []],

    });
  }

  ngOnInit() {
  }

  public dropdownFunction($event) {
    for (var entry of this.dropdownOptions) {

      if (entry.val == $event.detail.value) {
        const name = entry.val;

        let loading: HTMLIonLoadingElement;
        this.loadingController.create({

        }).then(res => {
          loading = res;
          loading.present();

          this.getData(name).then(data => {
            this.file = data;

            this.setup();
          }).catch(error => {

            this.errorService.error(error);
          });

          loading.dismiss();
        });

      }
    }
  }

  public getData(name: String) {

    return this.http.get("assets/presets/" + name + ".json").toPromise();
  }

  public setup() {


    this.setupService.file = this.file;

    let navigationExtras: NavigationExtras = {
      state: {
        setup: true
      }
    };
    this.router.navigate(['users/supplier'], navigationExtras);
  }

  fileSelected(ev) {
    let myFile = ev.target.files[0];
    let reader = new FileReader();
    reader.readAsText(myFile);
    reader.onload = (ev) => {
      this.file = reader.result;
      this.file = JSON.parse(this.file);
      this.setup();
    }
  }
}