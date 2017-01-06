import {Component, Output, EventEmitter} from '@angular/core';
import {ToastController} from "ionic-angular";
// import {Nav, Modal} from 'ionic-angular/index';
// import {MainService} from '../main.service';
// import {ModalPreviewPublicacion} from '../modals/previewPublicacion';
// import {ItemListEmpresa} from '../../directives/empresa-list.directive';
import {ModalSearch} from '../../pages/modals/search';
import {MainService} from "../../app/main.service";

import 'leaflet';

import {NavController, LoadingController} from 'ionic-angular';
// import {RankingPage} from "../ranking/ranking";
import {Empresas} from "../empresas/empresas";
// import {FilterPublicaciones} from "../../filters/filter-publicaciones";

import {MapService} from './../../directives/map/map.service';
// import {Location} from './../../directives/map/location.class';
// import {MapComponent} from './../../directives/map/map.component';
import {GeosearchComponent} from './../../directives/map/geosearch.component';
import {ModalMapa} from './modalMapa.component';
// import {MapaEmpresaComponent} from '../../directives/map-empresa/map.component';
// import {DefaultImageDirective} from "../../directives/image-default.directive";

@Component({
    selector: 'page-principal',
    templateUrl: 'principal.html'
})
export class PrincipalPage {

    @Output() locationFound = new EventEmitter();


    tipoPublicacion = "all";

    errorNoConexion = false;

    publicaciones:any[];

    promoCalendario:any;

    myDate = new Date();


    constructor(private navController:NavController,
                public mainservice:MainService,
                public loadingCtrl:LoadingController,
                public toastCtrl:ToastController,
                public mapService:MapService) {
        this.mapService = mapService;

        this.doRefresh(false);




    }

    ngOnInit() {

    }

    doRefresh(refresher) {

        let loader = this.loadingCtrl.create({
            content: "Cargando Promos",
            // duration: 6000
        });
        loader.present();

        this.mainservice.getUser().then((user)=>{
            this.mainservice.getPublicaciones(user.userID).subscribe((data)=> {
                    this.publicaciones = data;
                    this.errorNoConexion = false;

                }, (err)=> {
                    console.log('error timeout');

                    this.errorNoConexion = true;
                    //this.publicaciones = [];
                    loader.dismissAll();
                    if (refresher) {
                        refresher.complete();
                    }

                    let toast = this.toastCtrl.create({
                        message: "Error en la conección a internet",
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
        }, ()=>{

            this.mainservice.getPublicaciones(null).subscribe((data)=> {
                    this.publicaciones = data;
                    this.errorNoConexion = false;

                }, (err)=> {
                    console.log('error timeout');

                    this.errorNoConexion = true;
                    //this.publicaciones = [];
                    loader.dismissAll();
                    if (refresher) {
                        refresher.complete();
                    }

                    let toast = this.toastCtrl.create({
                        message: "Error en la conección a internet",
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


        this.mainservice.getPromoCalendario().subscribe((data)=> {
            if (data) {
                this.promoCalendario = data[0];
            } else {
                this.promoCalendario = false;
            }


        }, (err)=> {
            console.log('error timeout');

        });


    }


    modalSearch(characterNum) {

        console.log(characterNum);

        let modal = this.mainservice.modalCreate(ModalSearch);

        modal.present();

        modal.onDidDismiss((data:any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    modalRanking() {
        let modal = this.mainservice.modalCreate(GeosearchComponent);

        modal.present();

        modal.onDidDismiss((data:any[]) => {
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

        modal.onDidDismiss((data:any[]) => {
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

        this.mainservice.getEmpresas().toPromise()
            .then(response => {
                let param = {
                    empresas: response.json()
                }

                console.log(param);
                let modal = this.mainservice.modalCreate(ModalMapa, param);

                loader.dismissAll();
                modal.present();

                modal.onDidDismiss((data:any[]) => {
                    if (data) {
                        console.log(data);
                    }
                });
            });

    }

}
