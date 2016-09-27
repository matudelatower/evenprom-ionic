import {Component} from '@angular/core';
import {NavController, Nav, Storage, LocalStorage} from 'ionic-angular';
import {FormBuilder, Validators, ControlGroup} from '@angular/common';
import {TranslatePipe, TranslateService} from 'ng2-translate/ng2-translate';
import {TabsPage} from '../tabs/tabs';


@Component({
    templateUrl: 'build/pages/login/login.html',
    pipes: [TranslatePipe]

})
export class LoginPage {

    private rootPage:any;
    private local:any;

    private user:String = '';
    private pass:String = '';
    private loginForm:ControlGroup;


    lenguaje:String = 'Español';

    constructor(private navController:NavController, private nav:Nav, form:FormBuilder, private translate:TranslateService) {
        this.loginForm = form.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: ['', Validators.required]
        });

        this.local = new Storage(LocalStorage);
    }

    login() {
        console.log(this.user+' '+ this.pass);
        if (this.user == 'admin' && this.pass == '1') {
            //alert('si');
            console.log('si');

            this.local.set('user', true);
            this.nav.setRoot(TabsPage);
        } else {
            console.log(this.user+' '+ this.pass);
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
