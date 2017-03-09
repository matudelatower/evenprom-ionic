import {Injectable} from '@angular/core';
import {Http, Response, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import {ModalController, Events} from 'ionic-angular';
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
    dataToken: any;

    constructor(http: Http,
                modalCont: ModalController,
                public _config: Config,
                public events: Events) {

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
    //        .catch(error => {this.handleError(error)});
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

    getUserDemo() {

        return NativeStorage.getItem('userDemo');

    }

    getAvatar(fbId, gId): Observable <any> {


        let params;

        // let options = new RequestOptions({
        //     // withCredentials: false,
        //     search: search
        // });
        let url = '/null';


        if (gId) {
            url = 'https://www.googleapis.com/plus/v1/people/' + gId;
            params = {
                fields: 'image',
                key: this._config.get('googleApiKey')
            };
        } else if (fbId) {
            // url = "https://graph.facebook.com/" + fbId + "/picture";
            url = "https://graph.facebook.com/v2.8/" + fbId + "/picture";
            params = {
                // type: 'large',
                width: 720,
                redirect: false
            };
        }

        let search = new URLSearchParams();

        for (let k in params) {
            search.set(k, params[k]);
        }

        return this.http.get(url, {search: search})
            .map(this.extractData)
            .catch(error => {
                this.handleError(error)
            })
            .delay(500)
            .timeout(7500);
    }

    getPublicaciones(userId, fields?: any): Promise <any> {

        if ((typeof fields === "undefined")) {
            fields = "";
        } else {
            fields = "?" + fields;
        }

        return this.getToken().then(
            (token) => {
                return NativeStorage.getItem('token')
                    .then(
                        data => {
                            let headers = new Headers({'Accept': 'application/json'});
                            headers.set('Authorization', 'Bearer ' + data.access_token);

                            let options = new RequestOptions({headers: headers});

                            return this.http.get(this.routeServices.publicaciones + '/' + userId + '/persona' + fields, options)
                            // ...and calling .json() on the response to return data
                                .map((res: Response) => res.json())
                                .delay(500)
                                .timeout(7500)
                                ;
                        }
                    );

            }
        );


    }

    getPublicacionesByEmpresa(empresaId) {

        return this.http.get(this.routeServices.publicacionesporempresas + empresaId)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(7500);

    }

    getPromoCalendario(): Promise <any> {

        return this.getToken().then(
            (token) => {
                return NativeStorage.getItem('token')
                    .then(
                        data => {
                            let headers = new Headers({'Accept': 'application/json'});
                            headers.set('Authorization', 'Bearer ' + data.access_token);

                            let options = new RequestOptions({headers: headers});

                            return this.http.get(this.routeServices.promoCalendario, options)
                            // ...and calling .json() on the response to return data
                                .map((res: Response) => res.json());
                        }
                    );

            }
        );


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

        return this.http.get(this.service + '/subrubros/' + slug + '/slugrubro')
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

    postFavEmpresa(empresaId, personaId) {

        return this.http.post(this.service + '/favears/' + empresaId + '/empresas/' + personaId)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postFavPublicacion(pubId, personaId) {

        return this.http.post(this.service + '/favears/' + pubId + '/publicacions/' + personaId)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postRegistrarLlamada(empresaId, personaId) {
        return this.http.post(this.service + '/registros/' + empresaId + '/llamadas/' + personaId + '/empresas')
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postRegistrarLlamadaPublicacion(publicacionId, personaId) {
        return this.http.post(this.service + '/registros/' + publicacionId + '/llamadas/' + personaId + '/publicacions')
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    postComentarPublicacion(publicacionId, personaId, texto) {
        return this.http.post(this.service + '/comentars/' + publicacionId + '/publicacions/' + personaId, {
            texto: texto
        })
            .delay(500)
            .timeout(5000);
        ;
    }

    getComentariosPublicacion(publicacionId) {

        return this.http.get(this.service + '/comentarios/' + publicacionId + '/publicacion')
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);

    }


    postComentarEmpresa(empresaId, personaId, texto) {
        return this.http.post(this.service + '/comentars/' + empresaId + '/empresas/' + personaId, {
            texto: texto
        })
            .delay(500)
            .timeout(6000);
    }

    getComentariosEmpresa(publicacionId) {

        return this.http.get(this.service + '/comentarios/' + publicacionId + '/empresa')
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);

    }

    getImagenesEmpresa(empresa) {

        return this.http.get(this.service + '/fotos/' + empresa + '/empresa')
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

        return this.http.get(this.service + '/noticias/' + empresaId + '/empresa')

    }

    getFavoritos(personaId) {
        return this.http.get(this.service + '/favoritos/' + personaId + '/personas')
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);
    }

    getCheckIns(personaId) {
        return this.http.get(this.service + '/checkins/' + personaId + '/personas')
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);
    }

    postCheckInPublicacion(pubId, personaId) {

        return this.http.post(this.service + '/checkins/' + pubId + '/publicacions/' + personaId)
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getOndas() {
        return this.http.get(this.service + '/ondas')
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);
    }

    getDescuentos() {
        return this.http.get(this.service + '/descuentos')
            .map((res: Response) => res.json())
            .delay(500)
            .timeout(6000);
    }


    modalCreate(modalClass, parameters = {}) {
        let modal = this.modalCont.create(modalClass, parameters);

        return modal;
    };


    initRouteServices(): void {
        this.routeServices.publicaciones = this.service + '/publicaciones';
        this.routeServices.categorias = this.service + '/categorias';
        this.routeServices.empresasporslugs = this.service + '/empresasporslugs/';
        this.routeServices.empresas = this.service + '/empresas';
        this.routeServices.promoCalendario = this.service + '/promo/calendario';
        this.routeServices.rubros = this.service + '/rubros';
        this.routeServices.uploadImage = this.service + '/fotos/';
        this.routeServices.localidades = this.service + '/localidades/publicaciones';
        this.routeServices.publicacionesporempresas = this.service + '/publicacionesporempresas/';

    }

    // public handleError(error: any) {
    //     console.error('An error occurred', error);
    //     return false;
    // }

    getAll(resource: string, params?: any): Observable<any> {

        let search = new URLSearchParams();

        for (let k in params) {
            if (k == 'fields' || k == 'filters') {
                search.set(k, JSON.stringify(params[k]));
            } else {
                search.set(k, params[k]);
            }
        }

        let options = new RequestOptions({
            withCredentials: false,
            search: search
        });

        return this.http.get(this.service + "/" + resource, options)
            .map(this.extractData)
            .catch(error => {
                this.handleError(error)
            })
            .delay(500)
            .timeout(7500)
            ;
    }

    get(resource: string, id: number, params?: any): Observable<any> {

        return this.http.get(this.service + "/" + resource + "/" + id, params)
            .map(this.extractData)
            .catch(error => {
                this.handleError(error)
            })
            .delay(500)
            .timeout(7500)
            ;
    }

    getSubResource(resource: string, id: number, subResource?: string, subResourceId?: number, params?: any): Observable<any> {
        let url = this.service + "/" + resource + "/" + id;
        console.log('getSubResource event', this.events);
        if (subResource) {
            if (subResourceId) {
                url = this.service + "/" + resource + "/" + id + "/" + subResource + "/" + subResourceId;
            } else {
                url = this.service + "/" + resource + "/" + id + "/" + subResource;
            }
        }
        return this.http.get(url, params)
            .map(this.extractData)
            .catch(error => {
                this.handleError(error)
            })
            .delay(500)
            .timeout(7500)
            ;
    }

    post(resource: string, params?: any): Observable<any> {
        return this.http.post(this.service + "/" + resource, params)
            .map(this.extractData)
            .catch(error => {
                this.handleError(error)
            })
            .delay(500)
            .timeout(7500);
    }

    patch(resource: any, id: number, params): Observable<any> {
        return this.http.patch(this.service + "/" + resource + "/" + id, params)
            .map(this.extractData)
            .catch(error => {
                this.handleError(error)
            })
            .delay(500)
            .timeout(7500);
    }

    put(resource: any, id: number, params): Observable<any> {
        return this.http.put(this.service + "/" + resource + "/" + id, params)
            .map(this.extractData)
            .catch(error => {
                this.handleError(error)
            })
            .delay(500)
            .timeout(7500);
    }

    private extractData(res: Response) {

        let body = res.json();
        return body;
        // return body.data || { };
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead

        if (error.status == 401) {
            this.events.publish('user:logout');
        }

        return Observable.throw(errMsg);
    }

    setSecureData(data) {

        let user_pass = {
            'username': data.username,
            'plain_password': data.plain_password,
        }

        return NativeStorage.setItem('user_pass', user_pass)
            .then(
                data => {
                    console.log(data);
                    return data;
                },
                error => console.error(error)
            );
    }

    getUserNamePassword() {
        return NativeStorage.getItem('user_pass')
    }

    requestToken(username, password) {
        // let params = {
        //     'client_id': this._config.get('epClientId'),
        //     'client_secret': this._config.get('epClientSecret'),
        //     'grant_type': 'password',
        //     'username': username,
        //     'password': password
        // };
        let body = new URLSearchParams();

        body.set('client_id', this._config.get('epClientId'));
        body.set('client_secret', this._config.get('epClientSecret'));
        body.set('grant_type', 'password');
        body.set('username', username);
        body.set('password', password);

        // let body = JSON.stringify(params);
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({headers: headers});

        return this.http.post(this.ip + "/oauth/v2/token", body, options)
            .map(this.extractData)
            .catch(error => {
                this.handleError(error)
            })
            .delay(500)
            .timeout(7500);
    }

    getToken(): Promise<any> {

        return this.getUserNamePassword().then(
            (userNameDemo) => {

                return this.requestToken(userNameDemo.username, userNameDemo.plain_password).subscribe(
                    (dataToken) => {
                        NativeStorage.setItem('token', dataToken)
                            .then(
                                data => {
                                    console.log('NativeStorage.setItem', data);
                                },
                                error => console.error(error)
                            );
                    }
                )
            }
        );

    }

    refreshToken() {

        NativeStorage.getItem('token')
            .then(
                data => {
                    console.log(data);
                    let userPass = JSON.parse(data);
                    let params = {
                        'client_id': this._config.get('epClientId'),
                        'client_secret': this._config.get('epClientSecret'),
                        'grant_type': 'refresh_token',
                        'refresh_token': userPass.refresh_token,

                    }
                    let response = this.http.post(this.ip + "/oauth/v2/token", params)
                        .map(this.extractData)
                        .catch(error => {
                            this.handleError(error)
                        })
                        .delay(500)
                        .timeout(7500);

                    response.subscribe(
                        data => {
                            NativeStorage.setItem('token', data)
                                .then(
                                    data => {
                                        console.log(data);
                                        return data;
                                    },
                                    error => console.error(error)
                                );
                        });
                },
                error => console.log(error)
            );
    }
}

