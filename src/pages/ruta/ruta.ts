import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MapService} from "../../directives/map/map.service";

/*
 Generated class for the Ruta page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-ruta',
    templateUrl: 'ruta.html'
})
export class RutaPage {

    @ViewChild('contenedorMapa') contenedorMapa: ElementRef;

    map:any;

    constructor(public navCtrl: NavController,
                public mapService: MapService,
                public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RutaPage');
        let ways = this.navParams.get('ways');
        let msgs = this.navParams.get('msgs');


        let mapId = 'contenedor-mapa';

        this.contenedorMapa.nativeElement.innerHTML = '<div class="angular-leaflet-map" id="' + mapId + '"></div>';

        this.map = this.mapService.createMap(mapId);

        let wayPoints = this.mapService.createWayPoints(ways);

        this.mapService.createRoute(wayPoints, msgs);
    }

}
