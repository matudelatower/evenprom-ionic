import {Component, ViewChild} from '@angular/core';
import {Http,HTTP_PROVIDERS} from '@angular/http';
import {Platform, ionicBootstrap, Nav, Modal, Storage, LocalStorage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {MainService} from './main.service';
import {SubTabsPage} from './pages/subtabs/subtabs';
import {TranslateService, TranslateLoader, TranslateStaticLoader, TRANSLATE_PROVIDERS} from 'ng2-translate';


// import {AboutPage} from '/about/about';
// import {ContactPage} from '/contact/contact';


@Component({
    templateUrl: 'build/app.html',

})
export class MyApp {
    @ViewChild(Nav) nav:Nav;

    private rootPage:any;
    private local:any;
    private logged:Boolean;

    pages:Array<{ title: string, tab: any, tabIndex: number }>;

    constructor(private platform:Platform, private translate:TranslateService) {

        this.local = new Storage(LocalStorage);

        this.isLogged();


        // used for an example of ngFor and navigation
        this.pages = [
            {title: 'SUB', tab: SubTabsPage, tabIndex: 1},
            {title: 'Contact', tab: TabsPage, tabIndex: 2},
        ];

        this.translationConfig();

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }


    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.push(page.tab, {id: page.tabIndex});

    }

    translationConfig() {
        var userLang = navigator.language.split('-')[0]; // use navigator lang if available
        userLang = /(es|en)/gi.test(userLang) ? userLang : 'es';


        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('es');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        //this.translate.use(userLang);
        this.translate.use('en');
    }

    logout() {
        this.local.remove('user');
        this.nav.setRoot(LoginPage);

    }

    isLogged() {
        let t = this;
        this.local.get('user').then(function (response) {
            if (response) {
                console.log('si');
                t.rootPage = TabsPage;
            } else {
                console.log('no logged');
                t.rootPage = LoginPage;

            }
        });

    }


}

ionicBootstrap(MyApp, [
    MainService,
    HTTP_PROVIDERS,
    {
        provide: TranslateLoader,
        useFactory: (http:Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
    },
    // use TranslateService here, and not TRANSLATE_PROVIDERS (which will define a default TranslateStaticLoader)
    TranslateService
]);
