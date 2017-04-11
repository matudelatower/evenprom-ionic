import {Component, ElementRef, ViewChild} from '@angular/core';
import {LoadingController, NavController, NavParams, Select} from 'ionic-angular';
import {MapService} from '../../directives/map/map.service';
import {GeocodingService} from "../../directives/map/geocode.service";
import {MainService} from "../../app/main.service";
import {BrowserDomAdapter} from "@angular/platform-browser/src/browser/browser_adapter";
import {Geolocation} from 'ionic-native';
import {EmpresaPerfilPage} from "../empresaPerfil/empresaPerfil";

@Component({
    selector: 'modal-mapa',
    templateUrl: './modalMapa.component.html'
})
export class ModalMapa {

    @ViewChild('contenedorMapaEmpresas') contenedorMapa: ElementRef;
    @ViewChild('searchKm') searchKm: Select;

    domAdapter: BrowserDomAdapter = new BrowserDomAdapter();
    empresas = [];
    kms = 5;
    map: any;

    distancias = [
        {
            km: 5,
            descripcion: 'Menos de 5 kms.',
        },
        {
            km: 10,
            descripcion: 'Menos de 10 kms.',
        },
        {
            km: 50,
            descripcion: 'Menos de 50 kms.',
        },
        {
            km: 100,
            descripcion: 'Menos de 100 kms.',
        },
        {
            km: 300,
            descripcion: 'Menos de 300 kms.',
        },
        {
            km: -1,
            descripcion: 'Más de kms.',
        }

    ]

    constructor(public params: NavParams,
                public mainService: MainService,
                public navCtrl: NavController,
                public loadCtrl: LoadingController,
                public mapService: MapService,
                public elementRef: ElementRef,
                public geocoder: GeocodingService) {
        this.empresas = this.params.get('empresas');
    }


    ngOnInit() {

        console.log('MapaEmpresaComponent');


        this.rangeChange();


    }

    opensearchKm() {
        this.searchKm.open();
    }

    rangeChange() {

        var loader = this.loadCtrl.create({
            content: this.mainService.getTranslate('espere')
        });

        loader.present();

        Geolocation.getCurrentPosition().then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude

            console.log(resp);

            this.createMakers(resp.coords.latitude, resp.coords.longitude, this.kms, loader);

            this.mapService.setPosition(resp.coords.latitude, resp.coords.longitude);
            this.mapService.setBound(resp.coords.latitude - 0.02, resp.coords.longitude - 0.02, resp.coords.latitude + 0.02, resp.coords.longitude + 0.02);
        }).catch((error) => {
            console.log('Error getting location', error);
            console.log(error);


            console.log(this.mainService.backLocation, this.mainService.backLocation);
            if (this.mainService.isUndefined(this.mainService.backLocation)) {
                this.createMakers(-25.59751, -54.57, this.kms, loader);

            } else {
                this.mapService.setPosition(this.mainService.backLocation.latitude, this.mainService.backLocation.latitude);
                this.createMakers(this.mainService.backLocation.latitude, this.mainService.backLocation.longitude, this.kms, loader);

                // this.mapService.setPosition(-27.3871313,-55.8968868);
            }


        });
    }

    createMakers(latD, lonD, km, loader) {

        let mapId = 'mapa-empresas-id';
        let zoom = 14;

        if (!this.mainService.isUndefined(this.map)) {
            zoom = this.map.getZoom();

        }

        this.contenedorMapa.nativeElement.innerHTML = '<div class="angular-leaflet-map" id="' + mapId + '"></div>';

        this.map = this.mapService.createMap(mapId, latD, lonD);

        this.map.setZoom(zoom);

        this.mapService.createCircle(latD, lonD, km);

        for (let e of this.empresas) {

            if (this.empresas[this.empresas.length - 1] == e) {
                loader.dismissAll();
            }

            if (e.direccion.length != 0) {


                let location = this.geocoder.geocode(e.direccion.calle + " " + e.direccion.altura + ", " + e.direccion.localidad);

                location.subscribe(location => {
                    console.log(location);
                    if (!location.valid) {

                        return;
                    }
                    // let address = location.address;

                    var newBounds = location.viewBounds;
                    //this.mapService.changeBounds(newBounds);


                    let latlng = new Array();
                    let lat = (newBounds._northEast.lat + newBounds._southWest.lat) / 2;
                    let lng = (newBounds._northEast.lng + newBounds._southWest.lng) / 2;
                    latlng.push(lat);
                    latlng.push(lng);

                    let kms = this.mainService.getDistanceFromLatLonInKm(latD, lonD, lat, lng);

                    if (km > 0 && kms > km) {
                        return;
                    }


                    let newDiv: HTMLDivElement;
                    newDiv = document.createElement("div");
                    let newContent = document.createTextNode(e.nombre.toUpperCase());


                    let img: HTMLImageElement;
                    img = document.createElement('img');
                    newDiv.style.color = e.color;
                    newDiv.appendChild(newContent);
                    newDiv.appendChild(img);

                    console.log(newDiv);

                    console.log(e.image_name)
                    img.src = e.image_name ? e.image_name : 'assets/img/icono_empresa.png';
                    //img.src = "http://www.goleamos.com/post/boca.png";
                    this.domAdapter.on(newDiv, 'click', this.goToPerfil.bind(this, e));
                    this.domAdapter.appendChild(this.elementRef.nativeElement, newDiv);

                    this.mapService.addMarker(latlng, newDiv);

                    //this.mapService.addText(e.nombre);
                }, error => {
                    console.error(error);
                });
            }

        }


    }

    goToPerfil(empresa) {

        this.navCtrl.push(EmpresaPerfilPage, {
            empresa: empresa,
            icono: 'pizza'
        });

    }


}