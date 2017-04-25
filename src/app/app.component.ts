import {Component, ViewChild} from '@angular/core';
import {Platform, Events, LoadingController, Nav, AlertController, Select} from 'ionic-angular';
import {
    StatusBar, BackgroundGeolocation, Facebook, NativeStorage, AppRate,
    GooglePlus, Market, GoogleAnalytics, Splashscreen, OneSignal, Deeplinks
} from 'ionic-native';
import {PrincipalPage} from "../pages/principal/principal";
import {LoginPage} from "../pages/login/login";
import {FavoritosPage} from "../pages/favoritos/favoritos";
import {TuEmpresaAquiPage} from "../pages/tu-empresa-aqui/tu-empresa-aqui";
import {ContactoPage} from "../pages/contacto/contacto";
import {MainService} from "./main.service";
import {CheckInPage} from "../pages/check-in/check-in";
import {BuscarAmigosPage} from "../pages/buscar-amigos/buscar-amigos";
import {CalendarioPage} from "../pages/calendario/calendario";
import {Config} from "./config";
import {TranslateService} from "@ngx-translate/core";
import {EditarPerfilPage} from "../pages/editar-perfil/editar-perfil";
import {ModalPreviewPublicacion} from "../pages/modals/previewPublicacion";


@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) navChild: Nav;
    @ViewChild('selectLenguaje') selectLenguaje: Select;


    //rootPage = LoginPage;
    rootPage: any;
    user: any;
    personaOndas: any;
    pages = [];

    prod = true;
    googleReverseClientId: any;
    googleAnalyticsTrackId: any;
    pushSenderID: any;
    lenguaje: any;

    menues: any = [
        {
            function: function () {
                this.openPage(PrincipalPage)
            }.bind(this),
            icono: 'home',
            nombre: 'inicio',
        },
        {
            function: function () {
                this.openPage(FavoritosPage)
            }.bind(this),
            icono: 'star',
            nombre: 'favoritos',
        },
        {
            function: this.recomiendanos,
            icono: 'notifications',
            // icono: 'icono manito',
            nombre: 'recomiendanos',
        },

        {
            function: function () {
                this.openPage(CheckInPage)
            }.bind(this),
            icono: 'checkmark-circle-outline',
            nombre: 'Check In',
        },
        {
            function: function () {
                this.openPage(BuscarAmigosPage)
            }.bind(this),
            icono: 'people',
            nombre: 'buscarAmigos',
        },
        {
            function: function () {
                this.openPage(CalendarioPage)
            }.bind(this),
            icono: 'calendar',
            nombre: 'calendario',
        },
        {
            function: this.AppRate,
            icono: 'create',
            nombre: 'calificacionGP',
        },
        {
            function: function () {
                this.openPage(TuEmpresaAquiPage)
            }.bind(this),
            icono: 'open',
            nombre: 'registraEmpresa',
        },
        {
            function: function () {
                this.openPage(ContactoPage)
            }.bind(this),
            icono: 'mail',
            nombre: 'contactanos',
        },
    ];

    constructor(private platform: Platform,
                public events: Events,
                public alert: AlertController,
                public loadingCtrl: LoadingController,
                public mainService: MainService,
                public translate: TranslateService,
                public _config: Config) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

            NativeStorage.getItem('lenguaje')
                .then((data) => {
                    if (data) {
                        this.lenguaje = data;
                        this.translate.setDefaultLang(this.lenguaje);
                        this.translate.use(this.lenguaje);
                    } else {
                        this.lenguaje = this.mainService.getNavigatorLenguaje();
                        this.translate.setDefaultLang(this.lenguaje);
                        this.translate.use(this.lenguaje);
                    }

                    this.cambiarLenguaje();
                })
                .catch((err) => {
                    this.lenguaje = this.mainService.getNavigatorLenguaje();
                    this.translate.setDefaultLang(this.lenguaje);
                    this.translate.use(this.lenguaje);
                    this.cambiarLenguaje();
                });


            this.googleReverseClientId = _config.get('googleReverseClientId');

            this.pushSenderID = _config.get('pushSenderID');

            if (this.prod) {

                this.initAnalytics();

                this.initGeolocation(platform);

                this.listenToLoginEvents();

                let loader = this.loadingCtrl.create({
                    content: "Ingresando a EvenProm " + new Date().toISOString(),
                    // duration: 6000
                });
                loader.present();

                // NativeStorage user data
                mainService.getUser().then(
                    data => {
                        this.user = data;
                        this.mainService.setUser(data);

                        this.initOneSignal();

                        if (data.fbId) {
                            // Facebook login
                            Facebook.getLoginStatus()
                                .then(
                                    rtaLoginStatus => {
                                        if (rtaLoginStatus.status == 'connected') {
                                            this.loadOndas();
                                            this.rootPage = PrincipalPage;

                                        } else {
                                            this.rootPage = LoginPage;
                                        }
                                        loader.dismissAll();
                                    })
                                .catch(error => {
                                    console.error(error);
                                    loader.dismissAll();
                                });
                        } else if (data.gId) {
                            // Google login
                            GooglePlus.trySilentLogin({
                                'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                                'webClientId': this.googleReverseClientId,
                                'offline': true
                            })
                                .then(
                                    rta => {
                                        this.loadOndas();
                                        this.rootPage = PrincipalPage;
                                        loader.dismissAll();
                                    }
                                )
                                .catch(error => {
                                    console.error(error);
                                    loader.dismissAll();
                                    this.rootPage = LoginPage;
                                })
                            ;
                        } else {
                            loader.dismissAll();
                            this.rootPage = LoginPage;
                        }


                    }
                ).catch(error => {
                    console.error(error);
                    loader.dismissAll();
                    this.rootPage = LoginPage;
                });


            } else {
                this.rootPage = PrincipalPage;
            }

        });

    }

    ngAfterViewInit() {
        this.platform.ready().then(() => {
            /*
             IonicDeeplink.route({
             '/about-us': AboutPage,
             '/universal-links-test': AboutPage,
             '/products/:productId': ProductPage
             }, function(match) {
             // Handle the route manually
             }, function(nomatch) {
             // No match
             })
             */

            // Convenience to route with a given nav
            Deeplinks.routeWithNavController(this.navChild, {
                '/publicacion/:id': ModalPreviewPublicacion,
                '/favoritos': FavoritosPage
            }).subscribe((match) => {
                console.log('Successfully routed', match);
            }, (nomatch) => {
                console.warn('Unmatched Route', nomatch);
            });
        })
    }

    listenToLoginEvents() {
        this.events.subscribe('user:login', (user) => {
            console.log('login');
            this.user = (true);
        });

        this.events.subscribe('user:signup', (user) => {
            console.log('signup');
            this.user = user;
        });

        this.events.subscribe('user:logout', () => {
            console.log('logout');
            this.logout();
        });

        this.events.subscribe('user:updateOndas', () => {
            console.log('updateOndas');
            this.loadOndas();
        });

        this.events.subscribe('go:login', () => {
            console.log('go:login');
            this.navChild.push(LoginPage);
            this.rootPage = LoginPage;
        });
    }

    loadOndas() {
        this.mainService.getSubResource('personas', this.user.userID, 'ondas')
            .then(
                (personaOnda) => {
                    this.personaOndas = personaOnda;
                },
                (err) => {
                    console.error(err);
                }
            );
    }


    nada() {
        console.log("menu");
    }

    AppRate() {
        AppRate.preferences.storeAppURL = {
            // ios: '<my_app_id>',
            android: 'market://details?id=com.evenprom.evenpromapp',
        };

        AppRate.preferences.useLanguage = this.lenguaje;

        AppRate.promptForRating(true);

    }

    recomiendanos() {
        Market.open('com.evenprom.evenpromapp');
    }

    salir() {

        let alert = this.alert.create({
            title: this.mainService.getTranslate('tituloSalir'),
            message: this.mainService.getTranslate('textoSalir'),
            buttons: [{
                text: this.mainService.getTranslate('si'),
                handler: () => {
                    this.logout();
                    this.exitApp();
                }
            }, {
                text: this.mainService.getTranslate('cancelar'),
                role: 'cancel'
            }]
        });
        alert.present();
    }

    exitApp() {
        this.platform.exitApp();
    }

    logout() {

        this.mainService.getUser().then(
            data => {

                if (data.nombre == "demo"){
                    this.stopBackgroundService();
                }else{
                    if (data.fbId) {
                        Facebook.logout().then(function (response) {
                            NativeStorage.clear();
                            this.stopBackgroundService();
                        }, function (error) {
                            console.log(error);
                        });
                    }
                    else if (data.gId) {
                        GooglePlus.logout()
                            .then(function (response) {
                                NativeStorage.clear();
                                this.stopBackgroundService();
                            }, function (error) {
                                console.log(error);
                            });
                    }
                }

            });


        console.log('logout');
    }

    stopBackgroundService () {
        BackgroundGeolocation.stop();
        OneSignal.setSubscription(false);

    }

    openPage(page) {
        this.rootPage = page;
    }

    openCambiarLenguaje () {
        this.selectLenguaje.open();
    }

    cambiarLenguaje() {

        NativeStorage.setItem('lenguaje', this.lenguaje);
        this.translate.use(this.lenguaje).subscribe(() => {
            this.events.publish(this.mainService.event_change_locale);
            for (let arr of this.mainService.translateArray) {
                this.translate.get(arr.k).subscribe(
                    value => {
                        console.log(value);
                        // value is our translated string
                        arr.txt = value;
                    }
                );
            }
        });

    }

    initGeolocation(platform) {
        // BackgroundGeolocation is highly configurable. See platform specific configuration options
        let config = {
            url: 'http://192.168.0.117:3000/locations',
            startOnBoot: true,
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            startForeground: false,
            debug: false, //  enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false, // enable this to clear background location settings when the app terminates
        };

        BackgroundGeolocation.configure((location) => {
            console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

            NativeStorage.setItem('location', location);

            this.mainService.backLocation = location;

            this.events.publish(this.mainService.event_location_detected, location);

            if (platform.is('ios')) {
                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                BackgroundGeolocation.finish(); // FOR IOS ONLY
            }

        }, (error) => {
            console.log('BackgroundGeolocation error');
        }, config);

        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
        BackgroundGeolocation.start();
    }

    initAnalytics() {
        this.googleAnalyticsTrackId = this._config.get('googleAnalyticsTrackId');
        GoogleAnalytics.startTrackerWithId(this.googleAnalyticsTrackId)
            .then(() => {
                console.log('Google analytics is ready now');
                // Tracker is ready
                // You can now track pages or set additional information such as AppVersion or UserId
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    initOneSignal() {

        OneSignal.startInit(this._config.get('oneSignalAppId'), this._config.get('googleProjectId'));

        OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.InAppAlert);

        OneSignal.handleNotificationReceived().subscribe(() => {
            // do something when notification is received
        });

        OneSignal.handleNotificationOpened().subscribe(() => {
            // do something when a notification is opened
        });

        OneSignal.endInit();

        OneSignal.getIds().then(
            data => {
                console.log("os data", data);
                let params = {
                    "player_id": data.userId
                }

                this.mainService.post("dispositivos/" + this.user.userID, params)
                    .then(
                        data => {
                            console.log('dispositivos', data);
                            NativeStorage.setItem('notificaciones', true)
                                .then(
                                    () => {
                                        console.log('ok')
                                    })
                                .catch((err) => {
                                    console.log('error al guardar notificaciones', err)
                                });
                        },
                        error => {
                            console.error('dispositivos', error);
                        }
                    )

            },
            error => {
                console.error('oneSignal', error);
            }
        );
    }

    editarPerfil() {
        this.openPage(EditarPerfilPage);
    }

}
