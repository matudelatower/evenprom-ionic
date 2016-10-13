import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

// import { Progressbar } from '../directives/progress-bar/progressbar.component';

@Component({
    selector: 'page-ranking',
    templateUrl: 'ranking.html'
})
export class RankingPage {

    primera:any = {
        empresa: "Ganadora",
        puntos: 15,
        color: "red",
    };
    rankings = [
        {
            empresa: "Empresa1",
            puntos: 15,
            color: "red",
        },
        {
            empresa: "Empresa2",
            puntos: 50,
            color: "blue",
        },
        {
            empresa: "Empresa3",
            puntos: 35,
            color: "green",
        }
    ]

    constructor(publicnavController:NavController, public viewCtrl: ViewController) {

    }
    dismiss() {
        this.viewCtrl.dismiss();
    }
}
