import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CallNumber, EmailComposer} from "ionic-native";

/*
 Generated class for the Contacto page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-contacto',
    templateUrl: 'contacto.html'
})
export class ContactoPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ContactoPage');
    }


    openUrl(url) {
        window.open(url, "_system");
    }

    call() {


        CallNumber.callNumber('+5493757518400', true)
            .then(() => {
                    console.log('Launched dialer!');

                    ;

                }
            )
            .catch(() => console.log('Error launching dialer'));


    }

    sendMail() {

        let mail = 'evenpromapp@gmail.com'

        EmailComposer.isAvailable().then((available: boolean) => {
            if (available) {
                //Now we know we can send
            }
        });

        let email = {
            to: mail,
            subject: 'Contacto desde EvenProm',
            body: 'Via EvenPromApp',
            isHtml: true
        };

// Send a text message using default options
        EmailComposer.open(email);
    }

}
