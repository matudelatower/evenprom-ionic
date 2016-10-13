import {Injectable} from '@angular/core';
// import {Headers, Http, Response} from '@angular/http';
import { Http } from '@angular/http';

// import {ModalSearch} from './pages/modals/search';
// import {ModalPreviewPublicacion} from './pages/modals/previewPublicacion';

import {ModalController} from 'ionic-angular';
import {ModalPreviewPublicacion} from "../pages/modals/previewPublicacion";

// import 'rxjs/add/operator/map';

@Injectable()
export class MainService {

    //public ip = 'http://192.168.0.116';
    //public ip = 'http://192.168.10.134';
    // public ip = 'http://localhost';
    // public ip = 'http://evenprom.com';
    public ip = 'http://192.168.56.101';

    public http;

    // public service = this.ip + '/woc/web/app_dev.php/';
    // public service = this.ip ;
    public service = this.ip + '/whatsoncity-backend/web/';

    public publicaciones;

    public routeServices: any = {};

    public modalCont;


    constructor(http: Http, modalCont: ModalController) {

        this.publicaciones = [];

        this.http = http;

        this.modalCont = modalCont;

        this.initRouteServices();
    }

    getPublicaciones() {

        return this.http.get(this.routeServices.publicaciones);
    }

    getCategorias() {

        return this.http.get(this.routeServices.categorias);
    }

    getEmpresasBySlug(slug) {

        return this.http.get(this.routeServices.empresasporslugs + slug);
    }
    getEmpresas() {

        return this.http.get(this.routeServices.empresas);
    }


    modalCreate(modalClass, parameters = {}) {
        let modal = this.modalCont.create(modalClass, parameters);

        return modal;
    };


    modalPublicacion(publicacion) {
        let modal = this.modalCont.create(ModalPreviewPublicacion, {publicacion: publicacion});

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            console.log(data);
            if (data) {
                console.log(data);
            }
        });


    }


    initRouteServices(): void {
        this.routeServices.publicaciones = this.service + 'api/publicaciones';
        this.routeServices.categorias = this.service + 'api/categorias';
        this.routeServices.empresasporslugs = this.service + 'api/empresasporslugs/';
        this.routeServices.empresas = this.service + 'api/empresas';
    }

    public handleError(error: any) {
        console.error('An error occurred', error);
        return false;
    }
}