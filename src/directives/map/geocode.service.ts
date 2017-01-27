import {Http} from '@angular/http';
import {Location} from './location.class';
import {Address} from "./address.class";
import {Injectable} from '@angular/core';

let L = require('leaflet');

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class GeocodingService {
    private http:Http;

    constructor(http:Http) {
        this.http = http;
    }

    geocode(address:string) {
        return this.http
            .get('http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address))
            .map(res => res.json())
            .map(result => {
                //if (result.status !== 'OK') { throw new Error('unable to geocode address'); }

                var location = new Location();
                if (result.status == 'OK') {
                    location.valid = true;
                } else {

                    location.valid = false;
                    return location;
                }
                location.address = result.results[0].formatted_address;
                location.latitude = result.results[0].geometry.location.lat;
                location.longitude = result.results[0].geometry.location.lng;

                var viewPort = result.results[0].geometry.viewport;
                location.viewBounds = new L.LatLngBounds(
                    {lat: viewPort.southwest.lat, lng: viewPort.southwest.lng},
                    {lat: viewPort.northeast.lat, lng: viewPort.northeast.lng});

                return location;
            });
    }

    getCitys(latlng) {

        //garupa
        //latlng = "-27.4338563,-55.8643096";

        return this.http
            .get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + encodeURIComponent(latlng))
            .map(res => res.json())
            .map(result => {
                //if (result.status !== 'OK') { throw new Error('unable to geocode address'); }

                let addr = new Address();

                let address = "";
                if (result.status == 'OK') {
                    addr.valid = true;

                    let addrC = result.results[0].address_components;
                    /**
                     * 4, 5 y 8 es la precision basada en la cantidad de datos que devuelve google
                     */
                    if (addrC.length == 5) {
                        if (isNaN(addrC[0].long_name)){
                            address = addrC[1].long_name;
                        }else{
                            address = addrC[2].long_name;
                        }

                    } else if (addrC.length == 4) {
                        address = addrC[1].long_name;
                    } else if (addrC.length == 8) {
                        address = addrC[2].long_name;
                    } else if (addrC.length == 6) {
                        address = addrC[2].long_name;
                    } else {
                        addr.valid = false;
                    }

                } else {

                    addr.valid = false;
                    return addr;
                }

                 address =  address.replace(/á/gi,"a");
                 address =  address.replace(/é/gi,"e");
                 address =  address.replace(/í/gi,"i");
                 address =  address.replace(/ó/gi,"o");
                 address =  address.replace(/ú/gi,"u");
                 address =  address.replace(/ñ/gi,"n");
                addr.address = address;

                return addr;
            });
    }
}