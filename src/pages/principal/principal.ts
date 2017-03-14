import {Component, Output, EventEmitter, ViewChild} from '@angular/core';
import {ToastController, Slides, Events, Content} from "ionic-angular";
import {ModalSearch} from '../../pages/modals/search';
import {MainService} from "../../app/main.service";
import 'leaflet';
import {NavController, LoadingController, Searchbar} from 'ionic-angular';
import {Empresas} from "../empresas/empresas";
import {MapService} from './../../directives/map/map.service';
import {GeosearchComponent} from './../../directives/map/geosearch.component';
import {ModalMapa} from './modalMapa.component';
import {Geolocation} from 'ionic-native';
import {GeocodingService} from "../../directives/map/geocode.service";


@Component({
    selector: 'page-principal',
    templateUrl: 'principal.html'
})
export class PrincipalPage {

    @Output() locationFound = new EventEmitter();
    @ViewChild('mySlider') slider: Slides;
    @ViewChild(Content) content: Content;


    tabs = "0";
    tabBody = 0;

    tipoPublicacion = "all";

    errorNoConexion = false;

    publicaciones: any[];

    promoCalendario: any;

    myDate = new Date();

    showSearch: Boolean = false;

    search = "";

    @ViewChild('searchP') searchP: Searchbar;

    constructor(private navController: NavController,
                public mainservice: MainService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public geoService: GeocodingService,
                public events: Events,
                public mapService: MapService) {
        this.mapService = mapService;

        this.doRefresh(false);


        this.events.subscribe(this.mainservice.event_location_detected, (location) => {

            this.setCurrentLocalidad(location.latitude, location.longitude);
        });

    }

    ngOnInit() {
        if (!this.mainservice.currentLocalidad) {
            Geolocation.getCurrentPosition().then((location) => {
                this.setCurrentLocalidad(location.coords.latitude, location.coords.longitude);
                //this.setCurrentLocalidad(-27.4338563, -55.8643096);
            }, error => console.log("error al consultar ciudad actual"));
        } else {
            this.search = this.mainservice.currentLocalidad;
        }

    }

    setCurrentLocalidad(lat, lng) {
        let latlng = lat + ',' + lng;
        this.geoService.getCitys(latlng).subscribe(addr => {

            console.log(location);
            if (addr.valid) {
                this.search = addr.address;
                this.mainservice.currentLocalidad = addr.address;
            }
        }, error => console.log("error al consultar ciudad actual"));

    }

    onSlideChanged() {
        let currentIndex = this.slider.getActiveIndex();
        console.log("Current index is", currentIndex);
        this.tabBody = currentIndex;
        this.tabs = currentIndex.toString();
        if (this.tabs == "1") {
            this.pageEmpresas();
        }
        else if (this.tabs == "2") {
            this.pageNotificaciones();
        }
        this.content.scrollToTop();
    }

    selectedTab() {
        // this.slider.slideTo(+this.tabs, 500);
        this.tabBody = +this.tabs;
    }

    cancelarBusqueda() {
        this.mainservice.currentLocalidad = this.search;
        this.showSearch = false;
    }

    mostrarBusqueda() {
        this.showSearch = true;

        console.log(this.searchP);

        setTimeout(() => {
            this.searchP.setFocus();
        }, 150);

    }

    getPublicaciones(userID, fields, loader, refresher) {
        let resource = 'publicaciones/' + userID + '/persona'
        this.mainservice.getAll(resource, fields)
            .then(
                (data) => {
                    this.publicaciones = data;
                    this.errorNoConexion = false;
                    loader.dismissAll();
                    if (refresher) {
                        refresher.complete();
                    }
                })
            .catch(
                (ex) => {
                    console.error('error publicaciones', ex);

                    this.errorNoConexion = true;
                    //this.publicaciones = [];
                    loader.dismissAll();
                    if (refresher) {
                        refresher.complete();
                    }

                    let toast = this.toastCtrl.create({
                        message: "Error en la conexión a internet",
                        duration: 2000,
                        position: 'center'
                    });

                    toast.present(toast);
                }
            )
    }


    doRefresh(refresher, fields?) {
        
        let loader = this.loadingCtrl.create({
            content: "Cargando evenproms",
            // duration: 6000
        });
        loader.present();

        this.mainservice.getUser().then(
            (user) => {
                this.getPublicaciones(user.userID, fields, loader, refresher);
            },
            () => {
                this.mainservice.getUserDemo().then(
                    (user) => {
                        this.getPublicaciones(user.userID, fields, loader, refresher);
                    },
                    () => {
                        this.getPublicaciones(null, fields, loader, refresher);
                    }
                );
            }
        );

        this.mainservice.getAll('promo/calendario')
            .then(
                (data) => {
                    if (data) {
                        this.promoCalendario = data[0];
                    } else {
                        this.promoCalendario = false;
                    }
                }
            );
        this.tabs = '0';

    }


    modalSearch() {

        let modal = this.mainservice.modalCreate(ModalSearch);

        modal.present();

        modal.onDidDismiss((data) => {

            if (data) {
                let fields = "fields=" + JSON.stringify(data);

                this.doRefresh(false, fields);
            }


        });
    }

    modalRanking() {
        let modal = this.mainservice.modalCreate(GeosearchComponent);

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    favPublicacion(id) {

    }


    modalEmpresas() {
        let modal = this.mainservice.modalCreate(Empresas);

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    pageEmpresas() {
        // this.navController.push(Empresas);
    }

    pageNotificaciones() {
        // this.navController.push(Empresas);
    }

    toastPromo(promo) {


        let toast = this.toastCtrl.create({
            message: promo.titulo + " BY: " + promo.nombre_empresa.toUpperCase(),
            duration: 2000,
            position: 'center'
        });

        toast.present(toast);
    }


    modalUbicaciones() {

        let loader = this.loadingCtrl.create({
            content: "Cargando empresas",
            // duration: 6000
        });
        loader.present();

        let resource = 'empresas'

        this.mainservice.getAll(resource)
            .then(response => {
                let param = {
                    empresas: response
                };

                loader.dismissAll();

                this.navController.push(ModalMapa, param);

            })
            .catch((ex) => {

                console.error('error ubicaciones', ex)

                let toast = this.toastCtrl.create({
                    message: "Error en la conexión a internet",
                    duration: 2000,
                    position: 'center'
                });

                toast.present(toast)
            });

    }

}
