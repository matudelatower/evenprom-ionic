import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
// import {FormBuilder, Validators, ControlGroup} from '@angular/common';
import {Validators, FormBuilder} from '@angular/forms';
import { TranslateService} from 'ng2-translate/ng2-translate';
import {TabsPage} from '../tabs/tabs';
import {Storage} from '@ionic/storage';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    providers: [Storage]

})

export class LoginPage {

    public rootPage: any;
    public local: any;

    public user: String = '';
    public pass: String = '';
    public loginForm;

    public translate;


    lenguaje: String = 'Español';

    constructor(public navController: NavController, public nav: Nav, form: FormBuilder, translate: TranslateService) {
        this.loginForm = form.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: ['', Validators.required]
        });

        translate.setDefaultLang('en');

        // this.local = new Storage(LocalStorage);
        this.local = Storage;
    }

    login() {
        console.log(this.user + ' ' + this.pass);
        if (this.user == 'admin' && this.pass == '1') {
            //alert('si');
            console.log('si');

            this.local.set('user', true);
            this.nav.setRoot(TabsPage);
        } else {
            console.log(this.user + ' ' + this.pass);
        }

    }

    cambiarLeguaje() {
        if (this.lenguaje == 'Español') {
            this.translate.use('es');
            this.lenguaje = 'English';
        } else {
            this.translate.use('en');
            this.lenguaje = 'Español';
        }

    }
}
