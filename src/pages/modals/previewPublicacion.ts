import {Component,Output,EventEmitter} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';
import {MapService} from "../../directives/map/map.service";

import {GeosearchComponent} from '../../directives/map/geosearch.component';
import {GeocodingService} from "../../directives/map/geocode.service";
import {Subscription} from "rxjs/Subscription";


@Component({
    selector: 'page-previewPublicacion',
    templateUrl: 'previewPublicacion.html'
})
export class ModalPreviewPublicacion {
    public publicacion:any;
    subscription:Subscription;
    @Output() mapLoaded = new EventEmitter();
    map:any;

    lat:any;
    lng:any;

    constructor(public platform:Platform,
                public params:NavParams,
                public viewCtrl:ViewController,
                public mapService:MapService,
                public geocoder:GeocodingService) {

        this.publicacion = this.params.get('publicacion');


    }

    ngOnInit() {


        document.getElementById('contenedor-mapa-publicacion').innerHTML = "<div style='height:150px;' id='map-publicacion'></div>";

        this.map = this.mapService.createMap('map-publicacion');


        if (this.publicacion.direccion_empresa.length != 0) {

            let location = this.geocoder.geocode(this.publicacion.direccion_empresa.calle + " " + this.publicacion.direccion_empresa.altura + ", " + this.publicacion.direccion_empresa.localidad);

            location.subscribe(location => {
                console.log(location);
                if (!location.valid) {
                    return;
                }
                let address = location.address;

                var newBounds = location.viewBounds;
                //this.mapService.changeBounds(newBounds);


                let latlng = new Array();
                this.lat = (newBounds._northEast.lat + newBounds._southWest.lat) / 2;
                this.lng = (newBounds._northEast.lng + newBounds._southWest.lng) / 2;
                latlng.push(this.lat);
                latlng.push(this.lng);

                this.mapService.addMarker(latlng, this.publicacion.nombre_empresa);

                this.mapService.setPosition(this.lat,  this.lng);
                this.mapService.setBound(this.lat - 0.02, this.lng - 0.02, this.lat + 0.02, this.lng + 0.02);

            }, error => console.error(error));
        }
    }

    openUrl (url){
        window.open('//:'+url, "_system");
    }

    dismiss() {
        this.map.remove();
        this.viewCtrl.dismiss();
    }
}