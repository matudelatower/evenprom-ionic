import { Component, Input } from '@angular/core';
import {ToastController} from "ionic-angular";
import {MainService} from "../app/main.service";


@Component({
    selector: 'item-list-empresa',
    templateUrl: 'empresa-list.html'

})
export class ItemListEmpresa {

    @Input() empresa ;


    constructor(public toastCtrl: ToastController,
                public mainservice: MainService) {

    }

    // ngOnInit() {
    //     this.empersa = 
    // }

    modalPreviewPublicacion(publicacion) {
        this.mainservice.modalPublicacion(publicacion);
    }

    sharePublicacion(){
        let toast = this.toastCtrl.create({
            message: 'Compartido',
            duration: 2000,
            position: 'bottom'
        });

        toast.present(toast);
    }

    comentPublicacion(){
        let toast = this.toastCtrl.create({
            message: 'Comentario',
            duration: 2000,
            position: 'bottom'
        });

        toast.present(toast);
    }

    addPublicacionFav(){
        let toast = this.toastCtrl.create({
            message: 'Agregado a favoritos',
            duration: 2000,
            position: 'bottom'
        });

        toast.present(toast);
    }

}

