import {Component } from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {MapService} from '../../directives/map/map.service';

@Component({
    selector: 'modal-mapa',
    templateUrl: './modalMapa.component.html'
})
export class ModalMapa {

    empresas = [];
    constructor(public params:NavParams, public viewCtrl:ViewController, public mapService:MapService) {
        this.empresas = this.params.get('empresas');
    }

    ngOnInit() {

    }

    dismiss () {
        this.viewCtrl.dismiss(false);
    }




}