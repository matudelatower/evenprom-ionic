import { Component, Input } from '@angular/core';
import {ToastController,NavController} from "ionic-angular";
import {MainService} from "../app/main.service";
import { SocialSharing } from 'ionic-native';
import {ModalComentario} from "../pages/principal/modal.comentario.component";
import {ModalPreviewPublicacion} from "../pages/modals/previewPublicacion";


@Component({
    selector: 'item-list-empresa',
    templateUrl: 'empresa-list.html'

})
export class ItemListEmpresa {

    @Input() empresa;
    @Input() isFirst;


    constructor(public toastCtrl:ToastController,
                public mainservice:MainService,
                public navController:NavController) {

    }


    getMesByFecha(fecha) {
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        let arrayFecha = fecha.split("-");

        let mes = meses[parseInt(arrayFecha[1]) - 1];

        return arrayFecha[1] + " " + mes.substring(0, 3);
        ;

    }


    modalComentario(publiacion) {

        console.log(publiacion);
        let modal = this.mainservice.modalCreate(ModalComentario, {
            publicacion: publiacion
        });

        modal.present();

        modal.onDidDismiss((data:any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    sharedTwitter(message:string, image?:string, url?:string) {


        SocialSharing.shareViaTwitter(message, image, url).then(() => {
            let toast = this.toastCtrl.create({
                message: 'Comentario',
                duration: 2000,
                position: 'bottom'
            });

            toast.present(toast);
        }).catch(() => {
            // Error!
        });
    }

    share(message:string, subject?:string, image?:string, url?:string) {
        console.log(message, subject, image, url);

        SocialSharing.share(message, '@evenprom', image, url).then(() => {
            let toast = this.toastCtrl.create({
                message: 'Comentario',
                duration: 2000,
                position: 'bottom'
            });

            toast.present(toast);
        }).catch(() => {
            // Error!
        });
    }

    addPublicacionFav(id) {


        this.mainservice.getUser().then((user)=> {

            alert( JSON.stringify(user));
            this.mainservice.postFavPublicacion(id, user.id).subscribe((data)=> {
                let toast = this.toastCtrl.create({
                    message: 'Agregado a favoritos',
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

