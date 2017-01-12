import {Component, Input} from '@angular/core';
import {ToastController, NavController} from "ionic-angular";
import {MainService} from "../app/main.service";
import {SocialSharing} from 'ionic-native';
import {ModalComentario} from "../pages/principal/modal.comentario.component";
import {ModalPreviewPublicacion} from "../pages/modals/previewPublicacion";


@Component({
    selector: 'item-list-empresa',
    templateUrl: 'empresa-list.html'

})
export class ItemListEmpresa {

    @Input() publicacion;
    @Input() isFirst;


    constructor(public toastCtrl: ToastController,
                public mainservice: MainService,
                public navController: NavController) {

    }


    getMesByFecha(fecha) {

        let fechaHumana = fecha.split("-");

        var hoy = new Date();
        var fechaPubli = new Date(fechaHumana[2], fechaHumana[1] - 1, fechaHumana[1]);

        console.log(hoy.getTime() === fechaPubli.getTime()); // prints true (correct)

        if (hoy.getTime() >= fechaPubli.getTime()) {
            fecha = hoy.getDate() + '-' + hoy.getMonth() + 1 + '-' + hoy.getFullYear();
        }

        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        let arrayFecha = fecha.split("-");

        let mes = meses[parseInt(arrayFecha[1]) - 1];

        return arrayFecha[0] + " " + mes.substring(0, 3);

    }


    modalComentario(publicacion) {

        console.log(publicacion);
        let modal = this.mainservice.modalCreate(ModalComentario, {
            publicacion: publicacion
        });

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    sharedTwitter(message: string, image?: string, url?: string) {


        SocialSharing.shareViaTwitter(message, image, url).then(() => {

        }).catch(() => {
            // Error!
        });
    }

    share(message: string, subject?: string, image?: string, url?: string) {
        console.log(message, subject, image, url);

        SocialSharing.share(message, '@evenprom', image, url).then(() => {

        }).catch(() => {
            // Error!
        });
    }

    addPublicacionFav(id) {

        this.mainservice.getUser().then((user) => {

            this.mainservice.postFavPublicacion(id, user.userID).subscribe((data) => {
                let mensaje = 'Agregado a favoritos';

                if (data.publicacion.like_persona == true) {
                    this.publicacion.likes += 1;
                } else {
                    this.publicacion.likes -= 1;
                    mensaje = 'Quitado de favoritos';
                }
                this.publicacion.like_persona = data.publicacion.like_persona;
                let toast = this.toastCtrl.create({
                    message: mensaje,
                    duration: 2000,
                    position: 'bottom'
                });

                toast.present(toast);

            });
        });


    }

    pagePublicacion(publicacion) {
        console.log(publicacion)
        this.navController.push(ModalPreviewPublicacion, {publicacion: publicacion});
    }

}

