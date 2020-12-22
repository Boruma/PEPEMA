import { Component } from '@angular/core';

import { Platform, Events, IonRouterOutlet, AlertController  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterOutlet, Router } from '@angular/router';
import { ProviderService } from './services/provider.service';
import { CompanyService } from './services/company.service';
import { Company } from './models/company';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  pages: any;
  selected: any;


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private events: Events,
    private provider: ProviderService,
    private companyService: CompanyService,
    private alertCtrl: AlertController,
  ) {
    
    this.initializeApp();
    this.createNavEntries();

    this.events.subscribe('updateMenuSelected', () => {

      //this.provider.goBackBy = 1;

      let count = 0;
      this.pages.forEach(page => {

        if (this.router.url.includes(page.url)) {

          this.isActive(this.pages[count]);
          this.select(this.pages[count]);
        }
        count++;
      });
    });

  }

  ngOnInit() {

  }


  select(item) {
    this.selected = item;
  };
  isActive(item) {
    return this.selected === item;
  };

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  getTitle(outlet: IonRouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['title'];
  }

  getShowHeader(outlet: IonRouterOutlet) {
    return !(outlet.activatedRouteData['showHeader'] == 'false');
  }

  getShowBackButton(outlet: IonRouterOutlet) {
    return outlet.activatedRouteData['showBackButton'];
  }

  getSavedMessage(outlet: IonRouterOutlet) {
    return outlet.activatedRouteData['savedMessage'];
  }



  showMenu(outlet: IonRouterOutlet) {
    var isLogin = outlet
      && outlet.activatedRouteData
      && outlet.activatedRouteData['title'] == 'Login';

    var isSignup = outlet
      && outlet.activatedRouteData
      && outlet.activatedRouteData['title'] == 'Neues Unternehmen anlegen';

    return !isLogin && !isSignup;
  }

  createNavEntries() {
    this.pages =
      [
        {
          title: 'Lager',
          url: '/users/ppe',
          icon: '../../../assets/icon/store.svg'
        },
        {
          title: 'PSA Bestand',
          url: '/users/allppe',
            icon: '../../../assets/icon/bookOpen.svg'
        },
        {
          title: 'Bestellungen',
          url: '/users/orders',
          icon: '../../../assets/icon/order.svg'
        },
        {
          title: 'Personen',
          url: '/users/employees',
          icon: '../../../assets/icon/persons.svg'
        },
        {
          title: 'PSA Schablonen',
          url: '/users/pe',
          icon: '../../../assets/icon/template.svg'
        },
        {
          title: 'Rollen',
          url: '/users/roles',
          icon: '../../../assets/icon/roles.svg'
        },
        {
          title: 'Lieferanten',
          url: '/users/supplier',
          icon: '../../../assets/icon/supplier.svg'
        },
        {
          title: 'Einstellungen',
          url: '/users/settings',
          icon: '../../../assets/icon/settings.svg'
        },
        {
          title: 'Logout',
          url: '/users/logout',
          icon: '../../../assets/icon/logOut.svg'
        }

      ];

  }

 
}
