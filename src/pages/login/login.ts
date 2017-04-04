import {Component} from '@angular/core';
import {NavController, Nav, LoadingController} from 'ionic-angular';
import {Facebook, NativeStorage, BackgroundGeolocation, GooglePlus} from 'ionic-native';
import {MainService} from "../../app/main.service";
import {PrincipalPage} from "../principal/principal";
import {UserData} from "./user-data";
import {Config} from "../../app/config";


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {

    public rootPage: any;
    public local: any;
    googleReverseClientId;

    lenguaje: String = 'Español';

    constructor(public navController: NavController,
                public nav: Nav,
                public loadingCtrl: LoadingController,
                public mainService: MainService,
                public userData: UserData,
                _config: Config) {


        this.googleReverseClientId = _config.get('googleReverseClientId');

    }

    ngOnInit() {
    }


    loginFacebook() {

        let loader = this.loadingCtrl.create({
            content: this.mainService.getTranslate('espere'),
            // duration: 6000
        });
        loader.present();

        Facebook.login(['public_profile', 'email'])
            .then(rta => {
                console.log(rta.status)
                if (rta.status == 'connected') {
                    Facebook.api('/me?fields=id,name,email,first_name,last_name,gender', [])
                        .then(rta => {
                            Facebook.api('/me/picture?type=large&redirect=false', [])
                                .then(pictureData => {
                                    let user = {
                                        avatar: pictureData.data.url,
                                        sexo: rta.gender,
                                        nombre: rta.first_name,
                                        apellido: rta.last_name,
                                        email: rta.email,
                                        fbId: rta.id
                                    };
                                    loader.dismissAll();
                                    this.crearPerfil(user);


                                })
                                .catch(error => {
                                    loader.dismissAll();
                                    console.error("fbpicture", error);
                                });
                        })
                        .catch(error => {
                            loader.dismissAll();
                            console.error('api', error);
                        });
                }
                ;
            })
            .catch(error => {
                loader.dismissAll();
                console.error(error);
            });
    }

    crearPerfil(user) {

        let loader = this.loadingCtrl.create({
            content: "Ingresando a EvenProm",
            // duration: 6000
        });
        loader.present();

        this.mainService.registrar('registrars', user)
            .then(
                data => {
                    console.log("Register Data", data);

                    this.mainService.setSecureData(data).then(
                        (dataSecureData) => {

                            user = {
                                avatar: user.avatar,
                                nombre: user.nombre,
                                apellido: user.apellido,
                                email: user.email,
                                fbId: user.fbId,
                                gId: user.gId,
                                userID: data.id,
                                sexo: data.sexo

                            };

                            NativeStorage.setItem('userData', user)
                                .then(
                                    () => {
                                        //envia a la pantalla principal
                                        // this.redirectPrincipal(setDataValues.isNew);


                                        loader.dismissAll();
                                        this.userData.signup(user);
                                        this.nav.setRoot(PrincipalPage);


                                    },
                                    error => {
                                        console.error('error crearPerfil', error)
                                    }
                                );
                        }
                    )

                },
                error => {
                    console.error('error login', error);
                    if (user.fbId) {
                        Facebook.logout();
                    }
                    if (user.gId) {
                        GooglePlus.logout();
                    }
                    NativeStorage.remove('userData');
                    BackgroundGeolocation.stop();
                    loader.dismissAll();
                    this.rootPage = LoginPage;
                }
            );

    }

    loginGoogle() {
        // GooglePlus.trySilentLogin();

        let loader = this.loadingCtrl.create({
            content: this.mainService.getTranslate('espere'),
            // duration: 6000
        });
        loader.present();

        GooglePlus.login({
            'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
            'webClientId': this.googleReverseClientId,
            'offline': true
        })
            .then(
                rta => {
                    let user = {
                        avatar: rta.imageUrl,
                        sexo: rta.gender,
                        nombre: rta.givenName,
                        apellido: rta.familyName,
                        email: rta.email,
                        gId: rta.userId

                    };
                    loader.dismissAll();

                    this.crearPerfil(user);

                }
            )
            .catch(error => {
                loader.dismissAll();
                console.error(error);
            })
        ;
    }

    omitir() {

        let loader = this.loadingCtrl.create({
            content: this.mainService.getTranslate('espere'),
            // duration: 6000
        });
        loader.present();

        let userDemo = {
            "sexo": "M",
            "nombre": "demo",
            "apellido": "demo",
            "email": "demo@evenprom.com"
        }

        this.mainService.registrar('registrars', userDemo)
            .then(
                data => {
                    console.log("Register Data", data);

                    this.mainService.setSecureData(data).then(
                        (demoSecureData) => {

                            let user = {
                                // avatar: user.avatar,
                                nombre: data.nombre,
                                apellido: data.apellido,
                                email: data.email,
                                userID: data.id,
                                sexo: data.sexo

                            }

                            NativeStorage.setItem('userDemo', user)
                                .then(
                                    () => {
                                        //envia a la pantalla principal
                                        this.userData.signup(user);
                                        loader.dismissAll();
                                        this.nav.setRoot(PrincipalPage);
                                    },
                                    error => console.error(error)
                                );
                        }
                    );

                }
            );


    }
}
