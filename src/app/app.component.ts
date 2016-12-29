import {Component} from '@angular/core';
import {Platform, Events} from 'ionic-angular';
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

    constructor(platform:Platform, public events: Events) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();

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
            }else{
                this.rootPage = PrincipalPage;
            }

        });

        this.listenToLoginEvents();
    }


    listenToLoginEvents() {
        this.events.subscribe('user:login', (user) => {
            console.log('login');
            this.user = (true);
        });

        this.events.subscribe('user:signup', (user) => {
            console.log('login');
            console.log('userdata',user);
            this.user = user;
        });

        this.events.subscribe('user:logout', () => {
            console.log('logout');
        });
    }


    nada(){
        console.log("menu");
    }

    logout() {
        Facebook.logout();
        NativeStorage.remove('userData');
        this.rootPage = LoginPage;
        console.log('logout');
    }

}
