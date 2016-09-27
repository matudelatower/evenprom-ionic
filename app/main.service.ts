import { Injectable} from '@angular/core';
import { Headers, Http , Response} from '@angular/http';

import {ModalSearch} from './pages/modals/search';
import {ModalPreviewPublicacion} from './pages/modals/previewPublicacion';

import {NavController, ModalController, Nav} from 'ionic-angular';

@Injectable()
export class MainService {

    //private ip = 'http://192.168.0.116';
    //private ip = 'http://192.168.10.134';
    private ip = 'http://localhost';



    private service = this.ip + '/woc/web/app_dev.php/';

    private publicaciones;

    private routeServices:any = {};


    constructor(private navController:NavController, private http:Http, public modalCont:ModalController) {

        this.publicaciones = [];

        this.initRouteServices();
    }

    getPublicaciones() {

        return this.http.get(this.routeServices.publicaciones);
    }

    getCategorias() {

        return this.http.get(this.routeServices.categorias);
    }

    getEmpresasBySlug(slug) {

        return this.http.get(this.routeServices.empresasporslugs+slug);
    }


    getEjempl() {
        if (!this.publicaciones.length) {
            this.publicaciones = this.http.get('http://www.w3schools.com/website/customers_mysql.php')
                .toPromise()
                .then(response => response.json())
                .catch(this.handleError)
            ;
        }

        return this.publicaciones;
    }

    modalCreate (modalClass, parameters = {}) {
        let modal = this.modalCont.create(modalClass, parameters);

        return modal;
    };



    modalPublicacion(publicacion) {
        let modal = this.modalCont.create(ModalPreviewPublicacion, {publicacion: publicacion});

        modal.present();

        modal.onDidDismiss((data:any[]) => {
            console.log(data);
            if (data) {
                console.log(data);
            }
        });


    }




    initRouteServices():void {
        this.routeServices.publicaciones = this.service + 'api/publicaciones';
        this.routeServices.categorias = this.service + 'api/categorias';
        this.routeServices.empresasporslugs = this.service + 'api/empresasporslugs/';
    }

    private handleError(error:any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
