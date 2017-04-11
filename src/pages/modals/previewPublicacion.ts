import {Component, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {Platform, NavParams, ViewController, LoadingController, ToastController, NavController} from 'ionic-angular';
import {MapService} from "../../directives/map/map.service";
import {GeocodingService} from "../../directives/map/geocode.service";
import {Subscription} from "rxjs/Subscription";
import {CallNumber, Geolocation} from 'ionic-native';
import {MainService} from "../../app/main.service";


@Component({
    selector: 'page-previewPublicacion',
    templateUrl: 'previewPublicacion.html'
})
export class ModalPreviewPublicacion {

    @Output() mapLoaded = new EventEmitter();
    @ViewChild('contenedorMapa') contenedorMapa: ElementRef;
    publicacion: any;
    comentarios: any;
    subscription: Subscription;
    comentario: any;

    map: any;
    lat: any;
    lng: any;

    faveada: any;
    usuario: any;

    color = "#5c666f";

    constructor(public platform: Platform,
                public params: NavParams,
                public viewCtrl: ViewController,
                public nav: NavController,
                public mapService: MapService,
                public geocoder: GeocodingService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public mainService: MainService) {


        this.mainService.getUser().then(
            (user) => {
                this.usuario = user;

                let publiacionId = this.params.get('id');

                if (publiacionId) {

                    let resource = 'publicacions/' + this.usuario.userID + '/personas/' + publiacionId.id;
                    this.mainService.getAll(resource)
                        .then(
                            (data) => {
                                this.publicacion = data;
                                if (this.publicacion.premium) {
                                    this.color = this.publicacion.color;

                                }
                                this.triggerPublicacion();
                            })
                        .catch((ex) => {

                            let toast = this.toastCtrl.create({
                                message: "Error al obtener publicacion.",
                                duration: 3250,
                                position: 'center'
                            });

                            toast.present(toast);
                        });
                } else {
                    this.publicacion = this.params.get('publicacion');
                    if (this.publicacion.premium) {
                        this.color = this.publicacion.color;
                    }
                    this.triggerPublicacion();
                }

            }, (error) => {

                this.mainService.sinUsuario();
                this.nav.pop();

            });


    }

    ngOnInit() {


    }

    triggerPublicacion() {
        let loader = this.loadingCtrl.create({
            content: this.mainService.getTranslate('espere'),
            // duration: 6000
        });
        loader.present();
        this.getComentarios(this.publicacion.id, loader);

        if (this.publicacion.direccion_empresa) {

            let location = this.geocoder.geocode(this.publicacion.direccion_empresa.calle + " " + this.publicacion.direccion_empresa.altura + ", " + this.publicacion.direccion_empresa.localidad);

            location.subscribe(location => {
                console.log(location);
                if (!location.valid) {
                    return;
                }

                let mapId = 'map-id';

                this.contenedorMapa.nativeElement.innerHTML = '<div style="height:150px;" id="' + mapId + '"></div>';

                let latlng = new Array();
                var newBounds = location.viewBounds;
                this.lat = (newBounds._northEast.lat + newBounds._southWest.lat) / 2;
                this.lng = (newBounds._northEast.lng + newBounds._southWest.lng) / 2;
                latlng.push(this.lat);
                latlng.push(this.lng);
                this.map = this.mapService.createMap(mapId,this.lat, this.lng);

                this.mapService.addMarker(latlng, this.publicacion.nombre_empresa);


            }, error => console.error(error));
        }
    }

    openUrl(url) {
        if (!url) {
            let toast = this.toastCtrl.create({
                message: this.mainService.getTranslate('sitioWebError'),
                duration: 3000,
                position: 'center'
            });

            toast.present();
            return false;
        }
        window.open(url, "_system");
    }

    comentar() {
        if (this.comentario) {
            let loader = this.loadingCtrl.create({
                content: this.mainService.getTranslate('enviandoComentario'),
                // duration: 6000
            });
            loader.present();

            this.mainService.getUser().then(
                (user) => {
                    this.comentarPublicacion(user, loader);
                }, (error) => {
                    console.log(error);
                    loader.dismissAll();
                    let toast = this.toastCtrl.create({
                        message: this.mainService.mensajeUserAnonimo,
                        duration: 3250,
                        position: 'center'
                    });

                    toast.present();
                });

        }

    }

    comentarPublicacion(user, loader) {


        let param = {
            'texto': this.comentario
        };

        // this.mainService.postComentarPublicacion(this.publicacion.id, user.userID, this.comentario).subscribe((data) => {
        this.mainService.post('comentars/' + this.publicacion.id + '/publicacions/' + user.userID, param).then(
            (data) => {
                this.comentario = '';
                loader.dismissAll();
                console.log('comente', this.comentario);
                loader = this.loadingCtrl.create({
                    content: this.mainService.getTranslate('espere'),
                    // duration: 6000
                });
                loader.present();
                this.getComentarios(this.publicacion.id, loader);
            }, (error) => {
                let toast = this.toastCtrl.create({
                    message: this.mainService.getTranslate('comentarioError1'),
                    duration: 3250,
                    position: 'center'
                });

                toast.present(toast);
                loader.dismissAll();
            });
    }

    getComentarios(publicacionId, loader) {
        let resource = 'comentarios/' + publicacionId + '/publicacion';
        this.mainService.getAll(resource)
            .then((data) => {
                this.comentarios = data;
                loader.dismissAll();
            })
            .catch((ex) => {
                console.error('comentarios', ex);
                loader.dismissAll();
                let toast = this.toastCtrl.create({
                    message: this.mainService.getTranslate('comentarioError2'),
                    duration: 3250,
                    position: 'center'
                });

                toast.present(toast);
            });
    }

    call(publicacionId, tel) {

        if (tel) {
            CallNumber.callNumber(tel, true)
                .then(() => {
                        console.log('Launched dialer!');
                        let personaId = this.mainService.user.id;

                        let resource = 'registros/' + publicacionId + '/llamadas/' + personaId + '/publicacions';
                        this.mainService.post(resource)
                            .then((data) => {
                                console.log('Llamada registrada');
                            });


                    }
                )
                .catch(() => console.log('Error launching dialer'));
        }

    }

    dismiss() {
        this.map.remove();
        this.viewCtrl.dismiss();
    }

    addPublicacionFav(id) {


        this.mainService.getUser()
            .then((user) => {
                let resource = 'favears/' + id + '/publicacions/' + user.userID;
                this.mainService.post(resource)
                    .then(
                        (data) => {

                            let mensaje = this.mainService.getTranslate('agregadoFavoritos');
                            if (data.publicacion.like_persona == true) {
                                this.publicacion.likes += 1;
                            } else {
                                this.publicacion.likes -= 1;
                                mensaje = this.mainService.getTranslate('sacadoFavoritos');
                            }
                            this.publicacion.like_persona = data.publicacion.like_persona;
                            let toast = this.toastCtrl.create({
                                message: mensaje,
                                duration: 2000,
                                position: 'bottom'
                            });

                            toast.present(toast);

                        });
            });


    }

    checkInPublicacion(id) {


        this.mainService.getUser()
            .then((user) => {
                let resource = 'checkins/' + id + '/publicacions/' + user.userID;

                this.mainService.post(resource)
                    .then(
                        (data) => {

                            let mensaje = this.mainService.getTranslate('checkIn');
                            if (data.publicacion.checkin_persona == true) {
                                this.publicacion.checkins += 1;
                            } else {
                                this.publicacion.checkins -= 1;
                                mensaje = this.mainService.getTranslate('checkOut');
                            }
                            this.publicacion.checkin_persona = data.publicacion.checkin_persona;
                            let toast = this.toastCtrl.create({
                                message: mensaje,
                                duration: 2000,
                                position: 'bottom'
                            });

                            toast.present(toast);


                        });
            });


    }

    comoLlegar() {
        if (!this.publicacion.direccion_empresa) {
            let toast = this.toastCtrl.create({
                message: this.mainService.getTranslate('errorDireccion'),
                duration: 1500,
                position: 'center'
            });

            toast.present(toast);

            return false;
        }

        let loader = this.loadingCtrl.create({
            content: "Abriendo mapa",
            // duration: 6000
        });
        loader.present();

        Geolocation.getCurrentPosition()
            .then((resp) => {
                // resp.coords.latitude
                // resp.coords.longitude

                let actual = resp.coords.latitude + ", " + resp.coords.longitude;

                let location = this.geocoder.geocode(this.publicacion.direccion_empresa.calle + " " + this.publicacion.direccion_empresa.altura + ", " + this.publicacion.direccion_empresa.localidad);

                location.subscribe(location => {

                    loader.dismissAll();
                    if (!location.valid) {
                        let toast = this.toastCtrl.create({
                            message: this.mainService.getTranslate('errorDireccion'),
                            duration: 1500,
                            position: 'center'
                        });

                        toast.present(toast);
                        return;
                    }
                    // let address = location.address;

                    var newBounds = location.viewBounds;
                    //this.mapService.changeBounds(newBounds);


                    let lat = (newBounds._northEast.lat + newBounds._southWest.lat) / 2;
                    let lng = (newBounds._northEast.lng + newBounds._southWest.lng) / 2;

                    let destino = lat + ", " + lng;

                    let toast = this.toastCtrl.create({
                        message: this.mainService.getTranslate('rutaOk'),
                        duration: 1500,
                        position: 'center'
                    });

                    toast.present(toast);

                    let url = "https://www.google.com/maps/dir/" + actual + "/" + destino;


                    window.open(url, "_system");

                }, error => {
                    loader.dismissAll();
                    let toast = this.toastCtrl.create({
                        message: this.mainService.getTranslate('errorMapa'),
                        duration: 1500,
                        position: 'center'
                    });

                    toast.present(toast);
                });

            }).catch((error) => {
            loader.dismissAll();
            let toast = this.toastCtrl.create({
                message: this.mainService.getTranslate('errorMapa'),
                duration: 1500,
                position: 'center'
            });

            toast.present(toast);
        });

    }
}