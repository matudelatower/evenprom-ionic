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
        let data = [
            {
                active: false,
                id: 1,
                text: "Gastronomía",

            },
            {
                active: false,
                id: 2,
                text: "Hoteles",

            }
        ];

        let data1 = [
            {
                active: false,
                id: 2,
                text: "Onda 1",

            },
            {
                active: false,
                id: 2,
                text: "Onda 2",

            }
        ];
        this.dataList = [
            new Data('Categorias', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', 'ondas', 'ios-add-circle-outline', false, data),
            new Data('Ondas', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', 'categorias', 'ios-add-circle-outline', true, data1),
        ];

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
