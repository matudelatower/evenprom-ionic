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

        this.mainService.getUser().then(
            (user) => {
                console.log('user', user);
                if (user.fbId) {
                    // Facebook.api('/' + user.fbId + '/friends?fields=installed', [])
                    // Facebook.api('/' + user.fbId + '?fields=context.field', [])
                    Facebook.api('/1608149619490148?fields=context', [])
                    // Facebook.api('/' + user.fbId + '?fields=friends{installed}', [])
                    // Facebook.api('/' + user.fbId + '?fields=context', [])
                    // Facebook.api('/1608149619490148?fields=context.fields%28friends_using_app%29', [])
                        .then(rta => {
                            console.log('rta', rta)
                            // console.log("friends", rta);
                            //
                            // console.log('context.id', rta.context.id);
                            //
                            Facebook.api('/' + rta.context.id + '/friends_using_app', [])
                                .then(rtaFriends => {
                                    console.log("rtaFriends", rtaFriends);
                                })
                                .catch(error => {
                                    console.error("context", error);
                                });
                        })
                        .catch(error => {
                            console.error("friends.error", error);
                        });
                }
            });


    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BuscarAmigosPage');
    }

}
