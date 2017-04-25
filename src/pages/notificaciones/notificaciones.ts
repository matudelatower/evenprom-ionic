import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController, AlertController, Events} from 'ionic-angular';
import {MainService} from "../../app/main.service";
import {OneSignal, NativeStorage} from "ionic-native";
import {TranslateService} from "@ngx-translate/core";

/*
 Generated class for the Notificaciones page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-notificaciones',
    templateUrl: 'notificaciones.html'
})
export class NotificacionesPage {

    persona: any;

    // notificaciones
    notificacionesOnda: any;
    notificacionesLocalidad: any;
    notificacionesDescuentos: any;
    notificacionesRubro: any;
    notificacionesCompras: any;
    notificacionesEntretenimiento: any;
    notificacionesGastronomia: any;
    notificacionesEmpresa: any;
    notificacionesEventos: any;
    desactivarNotificaciones = true;

    rubros = [];
    ondas = [];
    localidades = [];
    descuentos = [];
    empresas = [];
    servicios = [];
    entretenimiento = [];
    gastronomia = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public mainService: MainService,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                public events : Events,
                public translate: TranslateService,
                public toastCtrl: ToastController) {



        mainService.getUser().then(
            data => {
                this.persona = data;
                this.mainService.get('notificaciones', this.persona.userID)
                    .then(
                        (notificaciones) => {
                            this.cargarNotificaciones();
                            this.notificacionesOnda = notificaciones.onda;
                            this.notificacionesLocalidad = notificaciones.localidad;
                            this.notificacionesDescuentos = notificaciones.descuento;
                            this.notificacionesRubro = notificaciones.rubro;
                            this.notificacionesCompras = notificaciones.compra;
                            this.notificacionesEntretenimiento = notificaciones.entretenimiento;
                            this.notificacionesGastronomia = notificaciones.gastronomico;
                            this.notificacionesEmpresa = notificaciones.empresa;
                            this.notificacionesEventos = notificaciones.evento;

                            NativeStorage.getItem('notificaciones')
                                .then(
                                    (data) => {
                                        this.notificacionesCompras = data;
                                    })
                                .catch((err) => {
                                    console.log('error al obtener notificaciones', err)
                                });

                        }
                    )
                    .catch(
                        (err) => {
                            console.error(err);

                        });
            },
            error => {
                this.mainService.sinUsuario();

            });

        this.events.subscribe(this.mainService.event_change_locale, () => {

            this.cargarNotificaciones();
        });

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificacionesPage');
    }

    changeNotificaciones(item) {

        NativeStorage.setItem('notificaciones', item)
            .then(
                (data) => {
                    this.notificacionesCompras = data;
                    OneSignal.setSubscription(data);
                })
            .catch((err) => {
                console.log('error al guardar notificaciones', err)
            });


    }


    // notificaciones
    cargarNotificaciones() {
        let loader = this.loadingCtrl.create({
            content: this.mainService.getTranslate('espere'),
            // duration: 6000
        });
        loader.present();


        let params = {
            locale : this.translate.currentLang
        };

        this.mainService.getAll('localidades/publicaciones').then(
            (response) => {
                this.localidades = response;
            }
        );

        this.mainService.getAll('rubros', params).then(
            (response) => {
                this.rubros = response;
            }
        );

        this.mainService.getAll('ondas', params).then(
            (response) => {
                this.ondas = response;
            }
        );

        this.mainService.getAll('descuentos').then(
            (response) => {
                this.descuentos = response;
                loader.dismissAll();
            }
        ).catch(() => loader.dismissAll());

        // this.mainService.getAll('empresas').then(
        //     (response) => {
        //         this.empresas = response;
        //     }
        // );

        // this.mainService.getAll('subrubros/gastronomia/slugrubro').then(
        //     (response) => {
        //         this.gastronomia = response;
        //     }
        // );

        // this.mainService.getAll('subrubros/recreacion-diversion/slugrubro').then(
        //     (response) => {
        //         this.entretenimiento = response;
        //     }
        // );

        // this.mainService.getAll('subrubros/servicios/slugrubro').then(
        //     (response) => {
        //         this.servicios = response;
        //         loader.dismissAll();
        //     }
        // ).catch(() => loader.dismissAll());

    }

    guardarPerfil() {

        let params = {
            onda: this.notificacionesOnda,
            rubro: this.notificacionesRubro,
            // entretenimiento: this.notificacionesEntretenimiento,
            compras: this.notificacionesCompras,
            // gastronomia: this.notificacionesGastronomia,
            // empresa: this.notificacionesEmpresa,
            eventos: this.notificacionesEventos,
            descuentos: this.notificacionesDescuentos,
            localidad: this.notificacionesLocalidad,
        };

        console.log('notificaciones', params);

        let loader = this.loadingCtrl.create({
            content: this.mainService.getTranslate('espere'),
            // duration: 6000
        });

        this.mainService.put('notificaciones', this.persona.userID, params)
            .then(
                (ondas) => {
                    loader.dismissAll();
                    let toast = this.toastCtrl.create({
                        message: 'Perfil Guardado Correctamente',
                        duration: 2000,
                        position: 'center'
                    });

                    toast.present(toast);

                },
                (err) => {
                    console.error(err);
                    loader.dismissAll();

                }
            );
    }

    getOndas() {

        let loader = this.loadingCtrl.create({
            content: this.mainService.getTranslate('espere'),
            // duration: 6000
        });
        loader.present();

        this.mainService.getAll('ondas')
            .then(
                (response) => {
                    this.ondas = response;
                    loader.dismissAll();

                }
            ).catch(
            (err) => {
                console.error('error ondas', err);
                console.log('error timeout');
                loader.dismissAll();
            });
    }

}
