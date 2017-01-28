import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CallNumber, EmailComposer} from "ionic-native";
import {Config} from "../../app/config";

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

    apiUrl;
    tel;

    constructor(public navCtrl: NavController, public navParams: NavParams,
    _config: Config) {
        this.apiUrl = _config.get('apiUrl');
        this.tel = _config.get('telefono');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ContactoPage');
    }


    openUrl() {
        let url = this.apiUrl;
        window.open(url, "_system");
    }

    call() {


        CallNumber.callNumber(this.tel, true)
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
