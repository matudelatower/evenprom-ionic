import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {ModalController} from 'ionic-angular';
import {Observable} from 'rxjs/Rx';
import {NativeStorage} from "ionic-native";
import {Config} from "./config";

@Injectable()
export class MainService {

    public ip;

    public http;

    public service;

    public publicaciones;

    public routeServices: any = {};

    public modalCont;

    public mensajeUserAnonimo = "Useted no puede realizar esta acción.";

    public event_location_detected = "location:detected";

    public currentLocalidad: any = false;

    user: any;


    constructor(http: Http, modalCont: ModalController,
                _config: Config) {

        this.ip = _config.get('apiUrl');

        this.service = this.ip + _config.get('apiPath');

        this.publicaciones = [];

        this.http = http;

        this.modalCont = modalCont;

        this.initRouteServices();

    }

    //post(resource: string, params?: any): Observable<any> {
    //    return this.http.post(this.serverUri + resource, params)
    //        .map(this.extractData)
    //        .catch(this.handleError);
    //}


    getUrlEmpresa(id) {
        return this.service + 'es/' + id + "/sitios";
    }

    setUser(user) {

        this.user = user;
    }

    getUser() {

        return NativeStorage.getItem('userData');

    }

    getAvatar(fId, gId) {
        if (fId) {
            return "http://graph.facebook.com/" + fId + "/picture?type=large"
        } else if (gId) {

        }
    }

    getPublicaciones(userId, fields?: any) {

        if ((typeof fields === "undefined")) {
            fields = "";
        } else {
            fields = "?" + fields;
        }

        return this.http.get(this.routeServices.publicaciones + '/' + userId + '/persona' + fields)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(7500)
            ;
    }

    getPublicacionesByEmpresa(empresaId) {

        return this.http.get(this.routeServices.publicacionesporempresas + empresaId)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(7500);

    }

    getPromoCalendario() {

        return this.http.get(this.routeServices.promoCalendario)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json());

    }


    getCategorias() {

        return this.http.get(this.routeServices.categorias);
    }

    getRubros() {

        return this.http.get(this.routeServices.rubros)
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(7500);
    }

    getSubRubros(slug?) {

        return this.http.get(this.service + 'api/subrubros/' + slug + '/slugrubro')
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(7500);
    }

    getLocalidades() {

        return this.http.get(this.routeServices.localidades)
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(7500);
    }

    getEmpresasBySlug(slug, userId) {

        // return this.http.get(this.routeServices.empresasporslugs + slug);
        return this.http.get(this.routeServices.empresasporslugs + slug + '/personas/' + userId)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(7500)
            ;
    }

    getEmpresas(userId) {
        return this.http.get(this.routeServices.empresas + '/' + userId + '/persona')
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(7500)
            ;
    }

    postPerfil(user) {

        return this.http.post(this.routeServices.registrars, user)
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(7500)
            ;
    }

    postFavEmpresa(empresaId, personaId) {

        return this.http.post(this.service + 'api/favears/' + empresaId + '/empresas/' + personaId)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postFavPublicacion(pubId, personaId) {

        return this.http.post(this.service + 'api/favears/' + pubId + '/publicacions/' + personaId)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postRegistrarLlamada(empresaId, personaId) {
        return this.http.post(this.service + '/api/registros/' + empresaId + '/llamadas/' + personaId + '/empresas')
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postRegistrarLlamadaPublicacion(publicacionId, personaId) {
        return this.http.post(this.service + '/api/registros/' + publicacionId + '/llamadas/' + personaId + '/publicacions')
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    postComentarPublicacion(publicacionId, personaId, texto) {
        return this.http.post(this.service + 'api/comentars/' + publicacionId + '/publicacions/' + personaId, {
            texto: texto
        })
            .delay(500)
            .timeout(5000);
        ;
    }

    getComentariosPublicacion(publicacionId) {

        return this.http.get(this.service + 'api/comentarios/' + publicacionId + '/publicacion')
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);

    }


    postComentarEmpresa(empresaId, personaId, texto) {
        return this.http.post(this.service + 'api/comentars/' + empresaId + '/empresas/' + personaId, {
            texto: texto
        })
            .delay(500)
            .timeout(6000);
    }

    getComentariosEmpresa(publicacionId) {

        return this.http.get(this.service + 'api/comentarios/' + publicacionId + '/empresa')
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);

    }

    getImagenesEmpresa(empresa) {

        return this.http.get(this.service + 'api/fotos/' + empresa + '/empresa')
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);

    }


    getAllEmpresas() {

        return this.http.get(this.routeServices.empresas)
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);
    }

    getNoticiasEmpresa(empresaId) {

        return this.http.get(this.service + 'api/noticias/' + empresaId + '/empresa')

    }

    getFavoritos(personaId) {
        return this.http.get(this.service + 'api/favoritos/' + personaId + '/personas')
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);
    }

    getCheckIns(personaId) {
        return this.http.get(this.service + 'api/checkins/' + personaId + '/personas')
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);
    }

    postCheckInPublicacion(pubId, personaId) {

        return this.http.post(this.service + 'api/checkins/' + pubId + '/publicacions/' + personaId)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getOndas() {
        return this.http.get(this.service + 'api/ondas')
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);
    }

    getDescuentos() {
        return this.http.get(this.service + 'api/descuentos')
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);
    }


    modalCreate(modalClass, parameters = {}) {
        let modal = this.modalCont.create(modalClass, parameters);

        return modal;
    };


    initRouteServices(): void {
        this.routeServices.publicaciones = this.service + 'api/publicaciones';
        this.routeServices.categorias = this.service + 'api/categorias';
        this.routeServices.empresasporslugs = this.service + 'api/empresasporslugs/';
        this.routeServices.empresas = this.service + 'api/empresas';
        this.routeServices.promoCalendario = this.service + 'api/promo/calendario';
        this.routeServices.registrars = this.service + 'api/registrars';
        this.routeServices.rubros = this.service + 'api/rubros';
        this.routeServices.uploadImage = this.service + 'api/fotos/';
        this.routeServices.localidades = this.service + 'api/localidades/publicaciones';
        this.routeServices.publicacionesporempresas = this.service + 'api/publicacionesporempresas/';

    }

    public handleError(error: any) {
        console.error('An error occurred', error);
        return false;
    }
}