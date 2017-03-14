import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import {MainService} from "../../app/main.service";
import {ModalPreviewPublicacion} from "../modals/previewPublicacion";
import {LoginPage} from "../login/login";

/*
 Generated class for the Favoritos page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-favoritos',
    templateUrl: 'favoritos.html'
})
export class FavoritosPage {

    favoritos: any[];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public mainService: MainService,
                public alertCtrl: AlertController) {

        let loader = this.loadingCtrl.create({
            content: "Cargando Favoritos",
            // duration: 6000
        });
        loader.present();
        mainService.getUser().then(
            (userData) => {

                this.mainService.getAll('favoritos/' + userData.userID + '/personas')
                    .then(
                        (response) => {
                            this.favoritos = response;
                            loader.dismissAll();

                        },
                        (err) => {
                            console.log('error timeout');
                            loader.dismissAll();
                        }
                    );
            },
            error => {
                console.error('favoritos.error', error);
                loader.dismissAll();
                let alert = this.alertCtrl.create({
                    title: 'Aviso!',
                    subTitle: 'Para ver tus favoritos, tenes que iniciar sesión!',
                    buttons: ['OK']
                });
                alert.present();
            }
        )


        console.log('favoritos', this.favoritos)

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FavoritosPage');
    }

    itemSelected(item) {
        if (item.publicacion) {
            this.navCtrl.push(ModalPreviewPublicacion, {publicacion: item.publicacion});
        }
        console.log('selected')
    }

}
