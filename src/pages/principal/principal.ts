import {Component, Output, EventEmitter} from '@angular/core';
// import {Nav, Modal} from 'ionic-angular/index';
// import {MainService} from '../main.service';
// import {ModalPreviewPublicacion} from '../modals/previewPublicacion';
// import {ItemListEmpresa} from '../../directives/empresa-list.directive';
import {ModalSearch} from '../../pages/modals/search';
import {MainService} from "../../app/main.service";

import 'leaflet';

import {NavController, LoadingController} from 'ionic-angular';
import {RankingPage} from "../ranking/ranking";
import {Empresas} from "../empresas/empresas";
import {FilterPublicaciones} from "../../filters/filter-publicaciones";


import {GeocodingService} from './../../directives/map/geocode.service.ts';
import {MapService} from './../../directives/map/map.service.ts';
import {Location} from './../../directives/map/location.class.ts';
import {Map} from 'leaflet';
import {MapComponent} from './../../directives/map/map.component.ts';
import {GeosearchComponent} from './../../directives/map/geosearch.component.ts';
import {ModalMapa} from './modalMapa.component';
import {MapaEmpresaComponent} from '../../directives/map-empresa/map.component';


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
    private map:Map;
    private mapService:MapService;
    @Output() locationFound = new EventEmitter();


    tipoPublicacion = "all";

    public publicaciones:any[];

    public myDate = new Date();


    constructor(private navController:NavController,
                private mainservice:MainService,
                public loadingCtrl:LoadingController,
                geocoder:GeocodingService, mapService:MapService) {
        this.address = '';
        this.geocoder = geocoder;
        this.mapService = mapService;
        let loader = this.loadingCtrl.create({
            content: "Cargando Promos",
            // duration: 6000
        });
        loader.present();

        mainservice.getPublicaciones().toPromise()
            .then(response => {
                this.publicaciones = response.json();
                loader.dismissAll();
            });

        //console.log(this.public aciones);


    }

    ngOnInit() {
//         var map = L.map('map').setView([51.505, -0.09], 13);

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// L.marker([51.5, -0.09]).addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();
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


    modalUbicaciones() {

        this.mainservice.getEmpresas().toPromise()
            .then(response => {
                let param = {
                    empresas: response.json()
                }

                console.log(param);
                let modal = this.mainservice.modalCreate(ModalMapa, param);

                modal.present();

                modal.onDidDismiss((data:any[]) => {
                    if (data) {
                        console.log(data);
                    }
                });
            });

    }

}
