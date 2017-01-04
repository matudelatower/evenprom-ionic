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


import {GeocodingService} from './../../directives/map/geocode.service';
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


    empresa:any = {
        id: 1,
        color: 'red',
        nombre: 'FREEDO',
    };

    address:string;
    private geocoder:GeocodingService;
    @Output() locationFound = new EventEmitter();


    tipoPublicacion = "all";

    public publicaciones:any[];

    promoCalendario:any;

    public myDate = new Date();


    constructor(private navController:NavController,
                public mainservice:MainService,
                public loadingCtrl:LoadingController,
                public toastCtrl:ToastController,
                geocoder:GeocodingService,
                public mapService:MapService) {
        this.address = '';
        this.geocoder = geocoder;
        this.mapService = mapService;
        let loader = this.loadingCtrl.create({
            content: "Cargando Promos",
            // duration: 6000
        });
        loader.present();

        this.mainservice.getPublicaciones().subscribe((data)=> {
            this.publicaciones = data;
            loader.dismissAll();
        });

        this.mainservice.getPromoCalendario().subscribe((data)=> {
            if (data){
                this.promoCalendario = data[0];
            }else{
                this.promoCalendario = false;
            }


        });

        //console.log(this.public aciones);


    }

    ngOnInit() {

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

    favPublicacion (id) {

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
            message: promo.titulo+ " Te lo desea: "+ promo.nombre_empresa.toUpperCase() ,
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
