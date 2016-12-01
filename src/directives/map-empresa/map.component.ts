import {Component, ElementRef, OnInit, Output, Input, EventEmitter, ElementRef} from '@angular/core';
import {BrowserDomAdapter} from '@angular/platform-browser/src/browser/browser_adapter';
import {ViewController} from 'ionic-angular';
import {MapService} from '../map/map.service';
import {GeocodingService} from '../map/geocode.service';
import {GeosearchComponent} from '../map/geosearch.component';
import {Subscription} from 'rxjs/Subscription';
import forEach = ts.forEach;
import { Geolocation } from 'ionic-native';
import {EmpresaPerfilPage} from "../../pages/empresaPerfil/empresaPerfil";
import {MainService} from "../../app/main.service";


@Component({
    selector: 'empresas-map',
    templateUrl: 'map.component.html'
})
export class MapaEmpresaComponent {
    @Output() mapLoaded = new EventEmitter();
    @Input() empresas;
    private mapService:MapService;
    private geocoder:GeocodingService;
    domAdapter:BrowserDomAdapter =  new BrowserDomAdapter();
    public touchScreen:Boolean = true;
    map:any;
    options:Object;

    bounds:any;
    subscription:Subscription;

    error:any;
    sub:any;
    navigated = false; // true if navigated here

    constructor(private elRef:ElementRef, mapService:MapService,
                geocoder:GeocodingService,
                public viewCtrl:ViewController,
                public mainService:MainService,
                public elementRef:ElementRef) {
        this.mapService = mapService;
        this.geocoder = geocoder;
    }


    ngOnInit() {
        // create the map

        //    this.map = this.mapService.createMap('map');
        this.map = this.mapService.createMap(this.elRef.nativeElement.firstChild);
        this.mapLoaded.next(this.map);

        this.subscription = this.mapService.geosearchBounds$.subscribe(
            //do the fitbounds operation here
            newBounds => this.map.fitBounds(newBounds)
        );

        this.createMakers();


    }

    createMakers() {
        for (let e of this.empresas) {
            console.log(e.direccion.length);
            if (e.direccion.length != 0) {

                let location = this.geocoder.geocode(e.direccion.calle + " " + e.direccion.altura + ", " + e.direccion.localidad);
                location.subscribe(location => {
                    let address = location.address;

                    var newBounds = location.viewBounds;
                    //this.mapService.changeBounds(newBounds);


                    let latlng = new Array();
                    let lat = (newBounds._northEast.lat + newBounds._southWest.lat) / 2;
                    let lng = (newBounds._northEast.lng + newBounds._southWest.lng) / 2;
                    latlng.push(lat);
                    latlng.push(lng);
                    //let data = '<img src="' + e.image_name + '">';

                    let img = this.domAdapter.createElement('img');
                    img.src = e.image_name;
                    this.domAdapter.on(img, 'click', this.goToPerfil.bind(this, e));
                    this.domAdapter.appendChild(this.elementRef.nativeElement, img);


                    let data = '<img  src="' + e.image_name + '" (click)="goToPerfil(' + e.id + ')">';
                    this.mapService.addMaker(latlng, img);
                    //this.mapService.addText(e.nombre);
                }, error => console.error(error));
            }

        }

        Geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude

            console.log(resp);


            this.mapService.setPosition(resp.coords.latitude, resp.coords.longitude);
            this.mapService.setBound(resp.coords.latitude - 0.02, resp.coords.longitude - 0.02, resp.coords.latitude + 0.02, resp.coords.longitude + 0.02);
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    goToPerfil(empresa) {
        //console.log('soyyo', id);
        let modal = this.mainService.modalCreate(EmpresaPerfilPage, {
            empresa: empresa,
            icono: 'pizza'
        });

        modal.present();

        modal.onDidDismiss((data:any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }
}