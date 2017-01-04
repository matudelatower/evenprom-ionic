import {ILatLng} from './latLng.interface';
// let L = require('leaflet');


export class Location implements ILatLng {
    valid: boolean;
    latitude: number;
    longitude: number;
    address: string;
    viewBounds:any;
}
