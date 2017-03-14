import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {MainService} from "../../app/main.service";
import {LoginPage} from "../login/login";

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
                public toastCtrl: ToastController) {

        this.cargarNotificaciones();

        mainService.getUser().then(
            data => {
                this.persona = data;
                this.mainService.get('notificaciones', this.persona.userID)
                    .then(
                        (notificaciones) => {
                            this.notificacionesOnda = notificaciones.onda;
                            this.notificacionesLocalidad = notificaciones.localidad;
                            this.notificacionesDescuentos = notificaciones.descuento;
                            this.notificacionesRubro = notificaciones.rubro;
                            this.notificacionesCompras = notificaciones.compra;
                            this.notificacionesEntretenimiento = notificaciones.entretenimiento;
                            this.notificacionesGastronomia = notificaciones.gastronomico;
                            this.notificacionesEmpresa = notificaciones.empresa;
                            this.notificacionesEventos = notificaciones.evento;

                        }
                    ).catch(
                    (err) => {
                        console.error(err);

                    });
            },
            error => {
                let alert = alertCtrl.create({
                    title: 'Aviso!',
                    subTitle: 'Primero tenes que iniciar sesión!',
                    buttons: ['OK']
                });
                alert.present();
                navCtrl.setRoot(LoginPage);
            });

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificacionesPage');
    }


    // notificaciones
    cargarNotificaciones() {

        this.mainService.getAll('localidades/publicaciones').then(
            (response) => {
                this.localidades = response;
            }
        );

        this.mainService.getAll('rubros').then(
            (response) => {
                this.rubros = response;
            }
        );

        this.mainService.getAll('ondas').then(
            (response) => {
                this.ondas = response;
            }
        );

        this.mainService.getAll('descuentos').then(
            (response) => {
                this.descuentos = response;
            }
        );

        this.mainService.getAll('empresas').then(
            (response) => {
                this.empresas = response;
            }
        );

        this.mainService.getAll('subrubros/gastronomia/slugrubro').then(
            (response) => {
                this.gastronomia = response;
            }
        );

        this.mainService.getAll('subrubros/recreacion-diversion/slugrubro').then(
            (response) => {
                this.entretenimiento = response;
            }
        );

        this.mainService.getAll('subrubros/servicios/slugrubro').then(
            (response) => {
                this.servicios = response;
            }
        );

    }

    guardarPerfil() {

        let params = {
            onda: this.notificacionesOnda,
            rubro: this.notificacionesRubro,
            entretenimiento: this.notificacionesEntretenimiento,
            compras: this.notificacionesCompras,
            gastronomia: this.notificacionesGastronomia,
            empresa: this.notificacionesEmpresa,
            eventos: this.notificacionesEventos,
            descuentos: this.notificacionesDescuentos,
            localidad: this.notificacionesLocalidad,
        };

        console.log('notificaciones', params);

        this.mainService.put('notificaciones', 3, params)
            .then(
                (ondas) => {
                    // this.ondas = ondas;
                    let toast = this.toastCtrl.create({
                        message: 'Perfil Guardado Correctamente',
                        duration: 2000,
                        position: 'center'
                    });

                    toast.present(toast);

                },
                (err) => {
                    console.error(err);

                }
            );
    }

    getOndas() {

        let loader = this.loadingCtrl.create({
            content: "Cargando...",
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
