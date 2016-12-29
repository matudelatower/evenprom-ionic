import { Component, Input } from '@angular/core';
import {ToastController,NavController} from "ionic-angular";
import {MainService} from "../app/main.service";
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

    // ngOnInit() {
    //     this.empersa = 
    // }

    //modalPreviewPublicacion(publicacion) {
    //    this.mainservice.modalPublicacion(publicacion);
    //}

    getMesByFecha(fecha) {
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        let arrayFecha = fecha.split("-");

        let mes = meses[parseInt(arrayFecha[1]) - 1];

        return arrayFecha[1] + " " + mes.substring(0, 3);
        ;

    }


    pagePublicacion(publicacion) {
        console.log(publicacion)
        this.navController.push(ModalPreviewPublicacion, {publicacion: publicacion});
    }


    sharePublicacion() {
        let toast = this.toastCtrl.create({
            message: 'Compartido',
            duration: 2000,
            position: 'bottom'
        });

        toast.present(toast);
    }

    comentPublicacion() {
        let toast = this.toastCtrl.create({
            message: 'Comentario',
            duration: 2000,
            position: 'bottom'
        });

        toast.present(toast);
    }

    addPublicacionFav() {
        let toast = this.toastCtrl.create({
            message: 'Agregado a favoritos',
            duration: 2000,
            position: 'bottom'
        });

        toast.present(toast);
    }

}

