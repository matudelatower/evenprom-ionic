import {Injectable} from '@angular/core';
import {Http, Response, URLSearchParams, RequestOptions, Headers} from '@angular/http';
import {ModalController, Events, AlertController, LoadingController, ToastController} from 'ionic-angular';
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
    public event_change_locale = "locale:changed";

    public currentLocalidad: any = false;
    public backLocation: any;

    public translateArray = [
        {k: 'espere', txt: 'espere'},
        {k: 'textoSalir', txt: 'textoSalir'},
        {k: 'tituloSalir', txt: 'tituloSalir'},
        {k: 'cancelar', txt: 'cancelar'},
        {k: 'si', txt: 'si'},
        {k: 'agregadoFavoritos', txt: 'agregadoFavoritos'},
        {k: 'sacadoFavoritos', txt: 'sacadoFavoritos'},
        {k: 'mensajeUserAnonimo', txt: 'mensajeUserAnonimo'},
        {k: 'irLogin', txt: 'irLogin'},
        {k: 'errorMapa', txt: ''},
        {k: 'errorDireccion', txt: ''},
        {k: 'rutaOk', txt: ''},
        {k: 'subiendoImagen', txt: ''},
        {k: 'imagenOk', txt: ''},
        {k: 'imagenError1', txt: ''},
        {k: 'imagenError2', txt: ''},
        {k: 'imagenError3', txt: ''},
        {k: 'notificacionesOk', txt: ''},
        {k: 'sitioWebError', txt: ''},
        {k: 'enviandoComentario', txt: ''},
        {k: 'comentarioOk', txt: ''},
        {k: 'comentarioError1', txt: ''},
        {k: 'comentarioError2', txt: ''},
        {k: 'abrirMapa', txt: ''},
        {k: 'perfilOk', txt: ''},
        {k: 'perfilError', txt: ''}
    ];

    headers: Headers;
    options: RequestOptions;

    user: any;

    constructor(http: Http,
                modalCont: ModalController,
                public _config: Config,
                public alertctrl: AlertController,
                public loadingctrl: LoadingController,
                public toastctrl: ToastController,
                public events: Events) {

        this.ip = _config.get('apiUrl');

        this.service = this.ip + _config.get('apiPath');

        this.publicaciones = [];

        this.http = http;

        this.modalCont = modalCont;

        this.headers = new Headers({'Content-Type': 'application/json'});
        this.options = new RequestOptions({headers: this.headers});

        this.initRouteServices();

    }


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

    getTranslate(f) {
        for (let arr of this.translateArray) {
            if (arr.k == f) {
                return arr.txt;
            }
        }

        return '';
    }

    getAvatar(fbId, gId): Observable<any> {


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

    registrar(resource: string, params?: any): Promise<any> {

        let body = JSON.stringify(params);

        return this.http.post(this.service + "/" + resource, body, this.options)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
        // ...and calling .json() on the response to return data
        //     .map(this.extractData)
        //     .catch(error => {
        //         this.handleError(error)
        //     })
        //     .delay(500)
        //     .timeout(7500)
        // ;
    }


    getAll(resource: string, params?: any): Promise<any> {

        let search = new URLSearchParams();

        for (let k in params) {
            if (k == 'fields' || k == 'filters') {
                search.set(k, JSON.stringify(params[k]));
            } else {
                search.set(k, params[k]);
            }
        }

        return this.getToken().then(
            (token) => {
                return NativeStorage.getItem('token')
                    .then(
                        data => {

                            this.headers.set('Authorization', 'Bearer ' + data.access_token);

                            this.options.merge({headers: this.headers});
                            this.options.search = search;

                            return this.http.get(this.service + "/" + resource, this.options)
                                .toPromise()
                                .then(this.extractData)
                                .catch(this.handleError);
                        }
                    );

            }
        );
    }

    get(resource: string, id: number, params?: any): Promise<any> {

        return this.getToken().then(
            (token) => {
                return NativeStorage.getItem('token')
                    .then(
                        data => {

                            this.headers.set('Authorization', 'Bearer ' + data.access_token);

                            this.options.merge({headers: this.headers});

                            return this.http.get(this.service + "/" + resource + "/" + id, this.options)
                                .timeout(2000)
                                .toPromise()
                                .then(this.extractData)
                                .catch(this.handleError);
                        }
                    );

            }
        );
    }

    getSubResource(resource: string, id: number, subResource?: string, subResourceId?: number, params?: any): Promise<any> {
        let url = this.service + "/" + resource + "/" + id;

        if (subResource) {
            if (subResourceId) {
                url = this.service + "/" + resource + "/" + id + "/" + subResource + "/" + subResourceId;
            } else {
                url = this.service + "/" + resource + "/" + id + "/" + subResource;
            }
        }
        return this.getToken().then(
            (token) => {
                return NativeStorage.getItem('token')
                    .then(
                        data => {
                            this.headers.set('Authorization', 'Bearer ' + data.access_token);

                            this.options.merge({headers: this.headers});

                            return this.http.get(url, this.options)
                                .toPromise()
                                .then(this.extractData)
                                .catch(this.handleError);
                        }
                    );

            }
        );
    }

    post(resource: string, params?: any): Promise<any> {

        return this.getToken().then(
            (token) => {
                return NativeStorage.getItem('token')
                    .then(
                        data => {
                            this.headers.set('Authorization', 'Bearer ' + data.access_token);

                            this.options.merge({headers: this.headers});

                            return this.http.post(this.service + "/" + resource, params, this.options)
                            // ...and calling .json() on the response to return data
                                .toPromise()
                                .then(this.extractData)
                                .catch(this.handleError);

                        }
                    );

            }
        );
    }

    patch(resource: any, id: number, params): Promise<any> {
        return this.http.patch(this.service + "/" + resource + "/" + id, params)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    put(resource: any, id: number, params): Promise<any> {


        return this.getToken().then(
            (token) => {
                return NativeStorage.getItem('token')
                    .then(
                        data => {
                            this.headers.set('Authorization', 'Bearer ' + data.access_token);

                            this.options.merge({headers: this.headers});

                            return this.http.put(this.service + "/" + resource + "/" + id, params, this.options)
                            // ...and calling .json() on the response to return data
                                .toPromise()
                                .then(this.extractData)
                                .catch(this.handleError);
                        }
                    );

            }
        );
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

                    let params = {
                        'client_id': this._config.get('epClientId'),
                        'client_secret': this._config.get('epClientSecret'),
                        'grant_type': 'refresh_token',
                        'refresh_token': data.refresh_token,

                    };

                    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
                    let options = new RequestOptions({headers: headers});

                    let response = this.http.post(this.ip + "/oauth/v2/token", JSON.stringify(params), options)
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

    getNavigatorLenguaje() {
        if (navigator.language.indexOf('en') > -1) {
            return 'en';
        } else if (navigator.language.indexOf('es') > -1) {
            return 'es';
        } else if (navigator.language.indexOf('pt') > -1) {
            return 'pt';
        }
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km

        console.log(d);
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    isUndefined(variable) {
        if ("undefined" === typeof variable) {
            console.log("variable is undefined");
            return true;
        } else {
            return false;
        }
    }

    sinUsuario() {
        let toast = this.toastctrl.create({
            message: this.getTranslate('mensajeUserAnonimo'),
            duration: 2500,
            position: 'bottom'
        });

        toast.present();

        let alert = this.alertctrl.create({
            title: this.getTranslate('mensajeUserAnonimo'),
            message: this.getTranslate('irLogin'),
            buttons: [{
                text: this.getTranslate('si'),
                handler: () => {
                    this.events.publish('go:login');

                }
            }, {
                text: this.getTranslate('cancelar'),
                role: 'cancel'
            }]
        });
        alert.present();
    }
}

