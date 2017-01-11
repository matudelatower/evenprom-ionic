import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Facebook} from "ionic-native";
import {MainService} from "../../app/main.service";

/*
 Generated class for the BuscarAmigos page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-buscar-amigos',
    templateUrl: 'buscar-amigos.html'
})
export class BuscarAmigosPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public mainService: MainService) {

        this.mainService.getUser().then((user) => {
            Facebook.api('/' + user.fbId + '?fields=context.fields%28mutual_friends%29', [])
                .then(rta => {
                    console.log("friends", JSON.stringify(rta));
                })
                .catch(error => {
                    console.error("friends.error", error);
                    console.error("friends.error", JSON.stringify(error));
                });
            ;
        });


    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BuscarAmigosPage');
    }

}
