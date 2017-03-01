import {Component, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {Platform, NavParams, ViewController, LoadingController, ToastController} from 'ionic-angular';
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

    constructor(public platform: Platform,
                public params: NavParams,
                public viewCtrl: ViewController,
                public mapService: MapService,
                public geocoder: GeocodingService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public mainService: MainService) {

        this.publicacion = this.params.get('publicacion');


    }

    ngOnInit() {


        let loader = this.loadingCtrl.create({
            content: "Cargando comentarios",
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

                this.map = this.mapService.createMap(mapId);

                // let address = location.address;

                var newBounds = location.viewBounds;
                //this.mapService.changeBounds(newBounds);


                let latlng = new Array();
                this.lat = (newBounds._northEast.lat + newBounds._southWest.lat) / 2;
                this.lng = (newBounds._northEast.lng + newBounds._southWest.lng) / 2;
                latlng.push(this.lat);
                latlng.push(this.lng);

                this.mapService.addMarker(latlng, this.publicacion.nombre_empresa);

                this.mapService.setPosition(this.lat, this.lng);
                this.mapService.setBound(this.lat - 0.02, this.lng - 0.02, this.lat + 0.02, this.lng + 0.02);

            }, error => console.error(error));
        }
    }

    openUrl(url) {
        if (!url) {
            let toast = this.toastCtrl.create({
                message: "La empresa no tiene sitio web cargado",
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
                content: "Enviando comentario",
                // duration: 6000
            });
            loader.present();

            this.mainService.getUser().then((user) => {
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


        this.mainService.postComentarPublicacion(this.publicacion.id, user.userID, this.comentario).subscribe((data) => {
            this.comentario = '';
            loader.dismissAll();
            console.log('comente', this.comentario);
            loader = this.loadingCtrl.create({
                content: "Cargando comentarios",
                // duration: 6000
            });
            loader.present();
            this.getComentarios(this.publicacion.id, loader);
        }, (error) => {
            let toast = this.toastCtrl.create({
                message: "No se ha podido enviar el comentario. Intentelo nuevamente a la brevedad.",
                duration: 3250,
                position: 'center'
            });

            toast.present(toast);
            loader.dismissAll();
        });
    }

    getComentarios(publicacionId, loader) {
        this.mainService.getComentariosPublicacion(publicacionId).subscribe((data) => {
            this.comentarios = data;
            loader.dismissAll();
        }, (error) => {
            loader.dismissAll();
            let toast = this.toastCtrl.create({
                message: "No se han podido cargar los comentarios.",
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

                        this.mainService.postRegistrarLlamadaPublicacion(publicacionId, personaId).subscribe((data) => {
                            console.log('Llamada registrada');
                        });
                        ;

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


        this.mainService.getUser().then((user) => {

            this.mainService.postFavPublicacion(id, user.userID).subscribe(
                (data) => {

                    let mensaje = 'Agregado a favoritos';
                    if (data.publicacion.like_persona == true) {
                        this.publicacion.likes += 1;
                    } else {
                        this.publicacion.likes -= 1;
                        mensaje = 'Quitado de favoritos';
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


        this.mainService.getUser().then((user) => {

            this.mainService.postCheckInPublicacion(id, user.userID).subscribe(
                (data) => {

                    let mensaje = 'Hiciste CheckIn';
                    if (data.publicacion.checkin_persona == true) {
                        this.publicacion.checkins += 1;
                    } else {
                        this.publicacion.checkins -= 1;
                        mensaje = 'Eliminaste el CheckIn';
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
                message: "La empresa no tiene cargada la dirección",
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

        Geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude

            let actual = resp.coords.latitude + ", " + resp.coords.longitude;

            let location = this.geocoder.geocode(this.publicacion.direccion_empresa.calle + " " + this.publicacion.direccion_empresa.altura + ", " + this.publicacion.direccion_empresa.localidad);

            location.subscribe(location => {

                loader.dismissAll();
                if (!location.valid) {
                    let toast = this.toastCtrl.create({
                        message: "La empresa no tiene cargada la dirección",
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
                    message: "Ruta encontrada.",
                    duration: 1500,
                    position: 'center'
                });

                toast.present(toast);

                let url = "https://www.google.com/maps/dir/" + actual + "/" + destino;


                window.open(url, "_system");

            }, error => {
                loader.dismissAll();
                let toast = this.toastCtrl.create({
                    message: "No se ha podido abrir el mapa.",
                    duration: 1500,
                    position: 'center'
                });

                toast.present(toast);
            });

        }).catch((error) => {
            loader.dismissAll();
            let toast = this.toastCtrl.create({
                message: "No se ha podido abrir el mapa.",
                duration: 1500,
                position: 'center'
            });

            toast.present(toast);
        });

    }
}