import {Component, Output, EventEmitter, ViewChild} from '@angular/core';
import {ToastController, Slides} from "ionic-angular";
import {ModalSearch} from '../../pages/modals/search';
import {MainService} from "../../app/main.service";
import 'leaflet';
import {NavController, LoadingController, Searchbar} from 'ionic-angular';
import {Empresas} from "../empresas/empresas";
import {MapService} from './../../directives/map/map.service';
import {GeosearchComponent} from './../../directives/map/geosearch.component';
import {ModalMapa} from './modalMapa.component';


@Component({
    selector: 'page-principal',
    templateUrl: 'principal.html'
})
export class PrincipalPage {

    @Output() locationFound = new EventEmitter();
    @ViewChild('mySlider') slider: Slides;


    tabs = "0";
    tabBody = 0;

    tipoPublicacion = "all";

    errorNoConexion = false;

    publicaciones: any[];

    promoCalendario: any;

    myDate = new Date();

    // notificaciones
    notificacionesOnda: any;
    notificacionesLocalidad: any;
    notificacionesDescuentos: any;
    notificacionesRubro: any;
    notificacionesCompras: any;
    notificacionesEntretenimiento: any;
    notificacionesGastronomia: any;
    notificacionesEmpresa: any;
    notificacionesEventos: any;

    rubros = [];
    ondas = [];
    localidades = [];
    descuentos = [];
    empresas = [];
    servicios = [];
    entretenimiento = [];
    gastronomia = [];

    showSearch: Boolean = false;

    search = "";

    @ViewChild('searchP') searchP: Searchbar;

    constructor(private navController: NavController,
                public mainservice: MainService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public mapService: MapService) {
        this.mapService = mapService;

        this.doRefresh(false);

    }

    ngOnInit() {

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
            this.cargarNotificaciones();
        }
    }

    selectedTab() {
        this.slider.slideTo(+this.tabs, 500);
        this.tabBody = +this.tabs;
    }

    cancelarBusqueda() {
        console.log('cencelar');
        this.showSearch = false;
    }

    mostrarBusqueda() {
        this.showSearch = true;

        console.log(this.searchP);

        setTimeout(() => {
            this.searchP.setFocus();
        }, 150);

    }


    doRefresh(refresher, fields?) {

        let loader = this.loadingCtrl.create({
            content: "Cargando Promos",
            // duration: 6000
        });
        loader.present();

        this.mainservice.getUser().then((user) => {
            this.mainservice.getPublicaciones(user.userID, fields).subscribe((data) => {
                    this.publicaciones = data;
                    this.errorNoConexion = false;

                }, (err) => {
                    console.log('error timeout');

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
                },
                () => {
                    loader.dismissAll();
                    this.errorNoConexion = false;
                    if (refresher) {
                        refresher.complete();
                    }

                }
            );
        }, () => {

            this.mainservice.getPublicaciones(null, fields).subscribe((data) => {
                    this.publicaciones = data;
                    this.errorNoConexion = false;

                }, (err) => {
                    console.log('error timeout');

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
                },
                () => {
                    loader.dismissAll();
                    this.errorNoConexion = false;
                    if (refresher) {
                        refresher.complete();
                    }

                }
            );

        });


        this.mainservice.getPromoCalendario().subscribe((data) => {
            if (data) {
                this.promoCalendario = data[0];
            } else {
                this.promoCalendario = false;
            }


        }, (err) => {
            console.log('error timeout');

        });


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
        this.navController.push(Empresas);
    }

    toastPromo(promo) {


        let toast = this.toastCtrl.create({
            message: promo.titulo + " Te lo desea: " + promo.nombre_empresa.toUpperCase(),
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

        this.mainservice.getAllEmpresas()
            .subscribe(
                (response) => {
                    let param = {
                        empresas: response
                    }

                    let modal = this.mainservice.modalCreate(ModalMapa, param);

                    loader.dismissAll();
                    modal.present();

                    modal.onDidDismiss((data: any[]) => {
                        if (data) {
                        }
                    });
                });

    }

    getOndas() {

        let loader = this.loadingCtrl.create({
            content: "Cargando...",
            // duration: 6000
        });
        loader.present();

        this.mainservice.getOndas()
            .subscribe(
                (response) => {
                    this.ondas = response;
                    loader.dismissAll();

                },
                (err) => {
                    console.log('error timeout');
                    loader.dismissAll();
                }
            );
    }


    // notificaciones
    cargarNotificaciones() {

        this.mainservice.getLocalidades().subscribe(
            (response) => {
                this.localidades = response;
            }
        );

        this.mainservice.getRubros().subscribe(
            (response) => {
                this.rubros = response;
            }
        );


        this.mainservice.getOndas().subscribe(
            (response) => {
                this.ondas = response;
            }
        );

        this.mainservice.getDescuentos().subscribe(
            (response) => {
                this.descuentos = response;
            }
        );

        this.mainservice.getAllEmpresas().subscribe(
            (response) => {
                this.empresas = response;
            }
        );

        this.mainservice.getSubRubros('gastronomia').subscribe(
            (response) => {
                this.gastronomia = response;
            }
        );

        this.mainservice.getSubRubros('recreacion-diversion').subscribe(
            (response) => {
                this.entretenimiento = response;
            }
        );

        this.mainservice.getSubRubros('servicios').subscribe(
            (response) => {
                this.servicios = response;
            }
        );

    }

    guardarPerfil() {
        console.log(this.notificacionesDescuentos)
    }

}
