import {Component} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';
import {NativeStorage} from 'ionic-native';
import {Data} from '../../directives/toggle/data';
import {MainService} from "../../app/main.service";

@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class ModalSearch {
    character;
    public dataList: Data[];
    public demoData: Array<{id: string, title: string, icon: string, isActive: boolean}>;

    constructor(public platform: Platform,
                public params: NavParams,
                public mainService: MainService,
                public viewCtrl: ViewController) {

        let rubros = [];

        let ondas = [];

        let localidades = [];

        NativeStorage.getItem('filterPublicaciones').then(
            (listas) => {
                console.log(listas);
                this.cargarParametros(listas, rubros, ondas, localidades);
            },
            (error) => {

                this.cargarParametros(false, rubros, ondas, localidades);

            }
        );


        this.dataList = [
            new Data('rubro', '', 'ios-add-circle-outline', 'rubro', true, rubros, false),
            new Data('onda', ' ', 'ios-add-circle-outline', 'onda', true, ondas, false),
            new Data('localidad', ' ', 'ios-add-circle-outline', 'localidad', true, localidades, true),
        ];

    }

    cleanAll() {
        this.dataList.forEach((v) => {
            v.items.forEach((v) => {
                v.active = false;
            });
        });
    }

    buscarItemBusqueda(id, listas, clase) {
        for (let list of listas) {
            if (list.clase == clase) {
                for (let item of list.data) {
                    if (item == id) {
                        return true;
                    }
                }
            }
        }

        return false;
    }


    cargarParametros(listas, rubros, ondas, localidades) {
        this.mainService.getAll('rubros')
            .then(
                (response) => {
                    for (let r of response) {
                        rubros.push({
                            id: r.id,
                            text: r.nombre,
                            icon: r.icon,
                            active: listas ? this.buscarItemBusqueda(r.id, listas, 'rubro') : false
                        });
                    }
                }
            );


        this.mainService.getAll('ondas')
            .then(
                (response) => {
                    for (let r of response) {
                        ondas.push({
                            id: r.id,
                            text: r.nombre,
                            icon: r.icon,
                            active: listas ? this.buscarItemBusqueda(r.id, listas, 'onda') : false
                        });
                    }
                }
            );


        this.mainService.getAll('localidades/publicaciones').then(
            (response) => {
                for (let r of response) {
                    localidades.push({
                        id: r.id,
                        text: r.descripcion,
                        icon: "",
                        active: listas ? this.buscarItemBusqueda(r.id, listas, 'localidad') : false
                    });
                }
            }
        );

    }

    dismiss(buscar) {

        var params = [];

        if (buscar) {

            this.dataList.forEach((v, k) => {
                let filtros = v.items.filter(c => c.active).map(c => c.id);

                params.push({
                    clase: v.slug,
                    data: filtros
                })
            });


            NativeStorage.setItem('filterPublicaciones', params)
                .then(
                    () => {
                        this.viewCtrl.dismiss(params);
                    },
                    error => {
                    });


        } else {

            this.viewCtrl.dismiss(false);
        }

    }
}