import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import { Progressbar } from '../../directives/progress-bar/progressbar.component';

@Component({
    templateUrl: 'build/pages/ranking/ranking.html',
    directives: [Progressbar],
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

    constructor(private navController:NavController) {

    }
}
