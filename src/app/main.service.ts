import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ModalController} from 'ionic-angular';
import {Observable} from 'rxjs/Rx';
import {NativeStorage} from "ionic-native";

// import 'rxjs/add/operator/map';

@Injectable()
export class MainService {

    //public ip = 'http://192.168.0.116';
    //public ip = 'http://192.168.10.134';
    //public ip = 'http://192.168.0.117';
    public ip = 'http://evenprom.com/';
    // public ip = 'http://dev.evenprom.com/';
    //public ip = 'http://192.168.1.32';

    public http;

    //public service = this.ip + '/evenprom-backend/web/app_dev.php/';
    // public service = this.ip + '/whatsoncity-backend/web/app_dev.php/';
    public service = this.ip;

    public publicaciones;

    public routeServices:any = {};

    public modalCont;


    user:any;


    constructor(http:Http, modalCont:ModalController) {

        this.publicaciones = [];

        this.http = http;

        this.modalCont = modalCont;

        this.initRouteServices();

        NativeStorage.getItem('userData')
            .then(
                data => {
                    this.user = data;
                },
                error => {
                    console.log(error);
                }
            );
    }

    //post(resource: string, params?: any): Observable<any> {
    //    return this.http.post(this.serverUri + resource, params)
    //        .map(this.extractData)
    //        .catch(this.handleError);
    //}


    setUser(user) {

        this.user = user;


    }

    getAvatar(fId, gId) {
        if (fId) {
            return "http://graph.facebook.com/" + fId + "/picture?type=large"
        } else if (gId) {

        }
    }

    getPublicaciones() {

        return this.http.get(this.routeServices.publicaciones)
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())

            //...errors if any
            .catch((error:any) => console.log(error));

    }

    getPromoCalendario() {

        return this.http.get(this.routeServices.promoCalendario)
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

    }


    getCategorias() {

        return this.http.get(this.routeServices.categorias);
    }

    getRubros() {

        return this.http.get(this.routeServices.rubros);
    }

    getEmpresasBySlug(slug) {

        return this.http.get(this.routeServices.empresasporslugs + slug);
    }

    postPerfil(user) {

        return this.http.post(this.routeServices.registrars, user)
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    postFavEmpresa(empresaId, personaId) {

        return this.http.post(this.service + 'api/favears/' + empresaId + '/empresas/' + personaId)
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    postFavPublicacion(pubId, personaId) {

        return this.http.post(this.service + 'api/favears/' + pubId + '/publicacions/' + personaId)
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    postRegistrarLlamada(empresaId, personaId) {
        return this.http.post(this.service + '/api/registros/' + empresaId + '/llamadas/' + personaId + '/empresas')
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    postRegistrarLlamadaPublicacion(publicacionId, personaId) {
        return this.http.post(this.service + '/api/registros/' + publicacionId + '/llamadas/' + personaId + '/publicacions')
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())
            //...errors if any
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }


    postComentarPublicacion(publicacionId, personaId, texto) {
        return this.http.post(this.service + 'api/comentars/' + publicacionId + '/publicacions/' + personaId, {
            texto: texto
        });
    }

    getComentariosPublicacion(publicacionId) {

        return this.http.get(this.service + 'api/comentarios/' + publicacionId + '/publicacion')
            // ...and calling .json() on the response to return data
            .map((res:Response) => res.json())

            //...errors if any
            .catch((error:any) => console.log(error));

    }


    getEmpresas() {

        return this.http.get(this.routeServices.empresas);
    }

    getNoticiasEmpresa(empresaId) {

        return this.http.get(this.service + 'api/noticias/' + empresaId + '/empresa')

    }


    modalCreate(modalClass, parameters = {}) {
        let modal = this.modalCont.create(modalClass, parameters);

        return modal;
    };


    initRouteServices():void {
        this.routeServices.publicaciones = this.service + 'api/publicaciones';
        this.routeServices.categorias = this.service + 'api/categorias';
        this.routeServices.empresasporslugs = this.service + 'api/empresasporslugs/';
        this.routeServices.empresas = this.service + 'api/empresas';
        this.routeServices.promoCalendario = this.service + 'api/promo/calendario';
        this.routeServices.registrars = this.service + 'api/registrars';
        this.routeServices.rubros = this.service + 'api/rubros';
    }

    public handleError(error:any) {
        console.error('An error occurred', error);
        return false;
    }
}