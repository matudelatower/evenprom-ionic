import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

// import { TabsPage } from '../pages/tabs/tabs';
import {PrincipalPage} from "../pages/principal/principal";
import {LoginPage} from "../pages/login/login";
import {Facebook, NativeStorage} from "ionic-native";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    //rootPage = LoginPage;
    rootPage:any;
    user:any;
    pages = [];

    prod = true;

    menues:any = [
        {
            function: 'nada()',
            icono: 'star',
            nombre: 'Favoritos',
        },
        {
            function: 'nada()',
            icono: 'notifications',
            nombre: 'Recomendados',
        },

        {
            function: 'nada()',
            icono: 'checkmark-circle-outline',
            nombre: 'Check In',
        },
        {
            function: 'nada()',
            icono: 'people',
            nombre: 'Buscar Amigos',
        },
        {
            function: 'nada()',
            icono: 'calendar',
            nombre: 'Calendario',
        },
        {
            function: 'nada()',
            icono: 'create',
            nombre: 'CALIFICANOS EN GOOGLE PLAY',
        },
        {
            function: 'nada()',
            icono: 'pin',
            nombre: 'Geolocalización',
        },
        {
            function: 'nada()',
            icono: 'call',
            nombre: 'Tu empresa aquí',
        },
        {
            function: 'nada()',
            icono: 'mail',
            nombre: 'Contactanos',
        },
    ];

    constructor(platform:Platform) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            this.rootPage = PrincipalPage;
            NativeStorage.getItem('userData')
                .then(
                    data => {
                        this.user = data;
                    },
                    error => {
                        console.log(error);
                    }
                );

            if (this.prod) {
                Facebook.getLoginStatus()
                    .then(rtaLoginStatus => {
                        console.log("rtaLoginStatus", JSON.stringify(rtaLoginStatus));
                        if (rtaLoginStatus.status == 'connected') {
                            this.rootPage = PrincipalPage;

                        } else {
                            this.rootPage = LoginPage;
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        console.error('login', JSON.stringify(error));
                    });
            }

        });
    }

    logout() {
        Facebook.logout();
        NativeStorage.remove('userData');
        this.rootPage = LoginPage;
        console.log('logout');
    }

}
