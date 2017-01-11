import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ViewController} from "ionic-angular/index";
import {NavParams} from "ionic-angular/index";
import { Data } from '../../../directives/toggle/data';

/*
 Generated class for the ConfigNotificaciones page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-config-notificaciones',
    templateUrl: 'config-notificaciones.html'
})
export class ConfigNotificaciones {

    dataList:any;

    constructor(public navCtrl:NavController,
                public params:NavParams,
                public viewCtrl:ViewController) {
    }

    ngOnInit() {


    }

    ionViewDidLoad() {
        console.log('Hello ConfigNotificaciones Page');
    }

    dismiss(buscar) {

        var params = [];

        if (buscar) {

            this.dataList.forEach((v, k)=> {
                let filtros = v.items.filter(c => c.active).map(c => c.id);

                params.push({
                    filtros
                })
            });


            this.viewCtrl.dismiss(params);
        } else {

            this.viewCtrl.dismiss(false);
        }

    }

}
