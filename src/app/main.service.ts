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

    headers: Headers;
    options: RequestOptions;

    user: any;

    constructor(http: Http,
                modalCont: ModalController,
                public _config: Config,
                public events: Events) {

        this.ip = _config.get('apiUrl');

        this.service = this.ip + _config.get('apiPath');

        this.publicaciones = [];

        this.http = http;

        this.modalCont = modalCont;

        this.headers = new Headers({'Content-Type': 'application/json'});
        this.options = new RequestOptions({headers: this.headers});

        // this.initRouteServices();

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
}

