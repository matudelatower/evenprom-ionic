import {Component, ElementRef, Output, EventEmitter} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {MapService} from './map.service';
import {GeocodingService} from './geocode.service';
// import {GeosearchComponent} from './geosearch.component';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'fev-map',
    templateUrl: 'map.component.html'
})
export class MapComponent {
    @Output() mapLoaded = new EventEmitter();
    private mapService:MapService;
    private geocoder:GeocodingService;
    public touchScreen:Boolean = true;
    map:any;
    options:Object;

    bounds:any;
    subscription:Subscription;

    error:any;
    sub:any;
    navigated = false; // true if navigated here

    constructor(private elRef:ElementRef, mapService:MapService, geocoder:GeocodingService, public viewCtrl:ViewController) {
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
    }

    willEnter() {

    }

    goToPerfil(id) {
        console.log('soyyo', id);
    }


}