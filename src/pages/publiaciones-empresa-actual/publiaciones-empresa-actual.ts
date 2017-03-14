import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {MainService} from "../../app/main.service";

/*
 Generated class for the PubliacionesEmpresaActual page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-publiaciones-empresa-actual',
    templateUrl: 'publiaciones-empresa-actual.html'
})
export class PubliacionesEmpresaActualPage {

    publicaciones: any[];
    empresa: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public mainservice: MainService) {

    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad PubliacionesEmpresaActualPage');

        this.empresa = this.navParams.get('empresa');

        this.cargarPublicaciones();

    }

    cargarPublicaciones() {

        let loader = this.loadingCtrl.create({
            content: "Cargando evenproms de la empresa",
            // duration: 6000
        });
        loader.present();


        this.mainservice.getAll('publicacionesporempresas/' + this.empresa.id)
            .then(
                (data) => {
                    this.publicaciones = data;
                    loader.dismissAll();

                },
                (err) => {
                    console.log('error timeout');

                    loader.dismissAll();

                    let toast = this.toastCtrl.create({
                        message: "Error en la conexión a internet",
                        duration: 2000,
                        position: 'center'
                    });

                    toast.present(toast);
                }
            );


    };


}
