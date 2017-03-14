import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import {MainService} from "../../app/main.service";
import {LoginPage} from "../login/login";
import {ModalPreviewPublicacion} from "../modals/previewPublicacion";

/*
 Generated class for the CheckIn page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-check-in',
    templateUrl: 'check-in.html'
})
export class CheckInPage {

    checkIns: any[];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public loadingCtrl: LoadingController,
                public mainService: MainService,
                public alertCtrl: AlertController) {

        let loader = this.loadingCtrl.create({
            content: "Cargando CheckIns",
            // duration: 6000
        });
        loader.present();
        mainService.getUser().then(
            (userData) => {

                this.mainService.getAll('checkins/' + userData.userID + '/personas')
                    .then(
                        (response) => {
                            this.checkIns = response;
                            loader.dismissAll();

                        },
                        (err) => {
                            console.log('error timeout');
                            loader.dismissAll();
                        }
                    );
            },
            error => {
                console.error('checkIns.error', error);
                loader.dismissAll();
                let alert = this.alertCtrl.create({
                    title: 'Aviso!',
                    subTitle: 'Para ver tus checkIns, tenes que iniciar sesión!',
                    buttons: ['OK']
                });
                alert.present();
                navCtrl.setRoot(LoginPage);
            }
        )

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CheckInPage');
    }

    itemSelected(item) {
        if (item.publicacion) {
            this.navCtrl.push(ModalPreviewPublicacion, {publicacion: item.publicacion});
        }
        console.log('selected')
    }

}
