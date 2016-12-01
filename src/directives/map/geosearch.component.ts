import {Component, Output, EventEmitter} from '@angular/core';
import {GeocodingService} from './geocode.service.ts';
import {MapService} from './map.service.ts';
import {Location} from './location.class.ts';
import {Map} from 'leaflet';

@Component({
    selector: 'geosearch',
    templateUrl: './geosearch.component.html'
})
export class GeosearchComponent {
    address: string;

    private geocoder: GeocodingService;
    private map: Map;
    private mapService: MapService;
    @Output() locationFound = new EventEmitter();

    constructor(geocoder: GeocodingService, mapService: MapService) {
        this.address = '';
        this.geocoder = geocoder;
        this.mapService = mapService;
    }

    ngOnInit() {
        //this.mapService.disableMouseEvent('goto');
        this.mapService.disableMouseEvent('place-input');
    }

    goto() {

        this.mapService.remove();


        if (!this.address) { return; }

        this.geocoder.geocode(this.address)
        .subscribe(location => {
            this.address = location.address;
            
            var newBounds = location.viewBounds;
            this.mapService.changeBounds(newBounds);

            
            let  latlng =  new Array();
            let lat = (newBounds._northEast.lat + newBounds._southWest.lat) / 2;
            let lng = (newBounds._northEast.lng + newBounds._southWest.lng) / 2;
            latlng.push(lat);
            latlng.push(lng);
            this.mapService.addMaker(latlng);
        }, error => console.error(error));
    }
}