import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
// import {FormBuilder, Validators, ControlGroup} from '@angular/common';
import {Validators, FormBuilder} from '@angular/forms';
import {TranslateService} from 'ng2-translate';
import {TabsPage} from '../tabs/tabs';
import {Storage} from '@ionic/storage';
import { Facebook,NativeStorage } from 'ionic-native';
import {MainService} from "../../app/main.service";
import {PrincipalPage} from "../principal/principal";
import {MyApp} from "../../app/app.component";
import {UserData} from "./user-data";


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




    lenguaje: String = 'Español';

    constructor(public navController: NavController, public nav: Nav, form: FormBuilder,
                public translate: TranslateService, public mainService:MainService, public userData: UserData) {
        this.loginForm = form.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: ['', Validators.required]
        });

        this.translate.setDefaultLang('en');
        this.translate.use('es');

        // this.local = new Storage(LocalStorage);
        this.local = Storage;

        console.log(translate);
    }

    ngOnInit () {
        NativeStorage.getItem('userData')
            .then(
                data => {
                    if (data){

                    }
                },
                error => {

                }
            );
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


    loginFacebook() {
        Facebook.login(['public_profile', 'email'])
            .then(rta => {
                console.log(rta.status)
                if (rta.status == 'connected') {
                    Facebook.api('/me?fields=id,name,email,first_name,last_name,gender', [])
                        .then(rta=> {
                            console.log("rta", JSON.stringify(rta));
                            console.log("userid", rta.id);
                            Facebook.api('/me/picture?type=large&redirect=false', [])
                                .then(pictureData=> {
                                    console.log("pictureData", JSON.stringify(pictureData));
                                    let user = {
                                        avatar: pictureData.data.url,
                                        sexo: rta.gender,
                                        nombre: rta.first_name,
                                        apellido: rta.last_name,
                                        email: rta.email,
                                        fbId: rta.id

                                    };

                                    NativeStorage.setItem('userData', user)
                                        .then(
                                            () => {
                                                console.log('Stored item!');
                                                this.crearPerfil();
                                                this.userData.signup(user);

                                            },
                                            error => console.error('Error storing item', error)
                                        )
                                    ;


                                })
                                .catch(error => {
                                    console.error("fbpicture", error);
                                    console.error("fbpicture", JSON.stringify(error));
                                });
                        })
                        .catch(error => {
                            console.error('api', JSON.stringify(error));
                        });
                }
                ;
            })
            .catch(error => {
                console.error(error);
                console.error('login', JSON.stringify(error));
            });
    }

    crearPerfil() {

        let user = {
            avatar: '',
            sexo: '',
            nombre: '',
            apellido: '',
            email: '',
            fbId: '',
            facebookAccessToken:''
        };

        NativeStorage.getItem('userData')
            .then(
                data => {
                    user.avatar = data.avatar;
                    user.sexo = data.sexo;
                    user.nombre = data.nombre;
                    user.apellido = data.apellido;
                    user.email = data.email;
                    user.fbId = data.fbId;
                    console.log('user', JSON.stringify(user));
                    this.mainService.postPerfil(user).subscribe(
                        data => {
                            console.log("Register Data", JSON.stringify(data));
                            NativeStorage.setItem('userData', {
                                    avatar: user.avatar,
                                    nombre: user.nombre,
                                    apellido: user.apellido,
                                    email: user.email,
                                    fbId: user.fbId,
                                    userID: data.id,
                                    sexo: data.sexo

                                })
                                .then(
                                    (setDataValues) => {
                                        //envia a la pantalla principal
                                       // this.redirectPrincipal(setDataValues.isNew);


                                        alert(JSON.stringify(setDataValues));

                                        this.nav.setRoot(PrincipalPage );



                                    },
                                    error =>alert(JSON.stringify(error))
                                );


                        },
                        error => alert(JSON.stringify(error)));

                },
                error => console.error(error)
            );

    }
}
