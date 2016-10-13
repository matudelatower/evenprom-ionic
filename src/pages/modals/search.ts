import {Component} from '@angular/core';
import { Platform, NavParams, ViewController} from 'ionic-angular';

import { Data } from '../../directives/toggle/data';
// import { ToggleDirective } from '../../directives/toggle/toggle';
// import { Progressbar } from '../../directives/progress-bar/progressbar.component';

@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class ModalSearch {
    character;
    public dataList:Data[];
    public demoData:Array<{id:string, title: string,icon: string, isActive: boolean}>;

    constructor(public platform:Platform,
                public params:NavParams,
                public viewCtrl:ViewController) {
        var characters = [
            {
                name: 'Gollum',
                quote: 'Sneaky little hobbitses!',
                image: 'img/avatar-gollum.jpg',
                items: [
                    {title: 'Race', note: 'Hobbit'},
                    {title: 'Culture', note: 'River Folk'},
                    {title: 'Alter Ego', note: 'Smeagol'}
                ]
            },
            {
                name: 'Frodo',
                quote: 'Go back, Sam! I\'m going to Mordor alone!',
                image: 'img/avatar-frodo.jpg',
                items: [
                    {title: 'Race', note: 'Hobbit'},
                    {title: 'Culture', note: 'Shire Folk'},
                    {title: 'Weapon', note: 'Sting'}
                ]
            },
            {
                name: 'Samwise Gamgee',
                quote: 'What we need is a few good taters.',
                image: 'img/avatar-samwise.jpg',
                items: [
                    {title: 'Race', note: 'Hobbit'},
                    {title: 'Culture', note: 'Shire Folk'},
                    {title: 'Nickname', note: 'Sam'}
                ]
            }
        ];

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

        this.character = characters[this.params.get('charNum')];
    }

    cleanAll() {
        this.dataList.forEach((v)=> {
            v.items.forEach((v)=> {
                v.active = false;
            });
        });
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