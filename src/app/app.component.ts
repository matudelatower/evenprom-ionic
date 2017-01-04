import {Component} from '@angular/core';
import {Platform, Events} from 'ionic-angular';
import {StatusBar} from 'ionic-native';

// import { TabsPage } from '../pages/tabs/tabs';
import {PrincipalPage} from "../pages/principal/principal";
import {LoginPage} from "../pages/login/login";
import {Facebook, NativeStorage, AppRate, BackgroundGeolocation} from "ionic-native";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    //rootPage = LoginPage;
    rootPage:any;
    user:any;
    pages = [];

    prod = false;

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
            function: 'AppRate()',
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

            // BackgroundGeolocation is highly configurable. See platform specific configuration options
            let config = {
                startOnBoot: true,
                desiredAccuracy: 10,
                stationaryRadius: 20,
                distanceFilter: 30,
                debug: true, //  enable this hear sounds for background-geolocation life-cycle.
                stopOnTerminate: false, // enable this to clear background location settings when the app terminates
            };

            BackgroundGeolocation.configure((location) => {
                console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                BackgroundGeolocation.finish(); // FOR IOS ONLY

            }, (error) => {
                console.log('BackgroundGeolocation error');
            }, config);

            // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
            BackgroundGeolocation.start();


            // NativeStorage user data
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

    AppRate(){
        AppRate.preferences.storeAppURL = {
            // ios: '<my_app_id>',
            android: 'market://details?id=com.evenprom.evenpromapp',
        };

        AppRate.promptForRating(false);
    }

    logout() {
        Facebook.logout();
        NativeStorage.remove('userData');
        this.rootPage = LoginPage;
        console.log('logout');
    }

}
