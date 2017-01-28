import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Config} from "../../app/config";

/*
 Generated class for the TuEmpresaAqui page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-tu-empresa-aqui',
    templateUrl: 'tu-empresa-aqui.html'
})
export class TuEmpresaAquiPage {

    apiUrl;

    constructor(public navCtrl: NavController, public navParams: NavParams, _config: Config) {
        this.apiUrl = _config.get('apiUrl');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TuEmpresaAquiPage');
    }

    openUrl() {
        let url = this.apiUrl + '/empresa/registrar';
        window.open(url, "_system");
    }

}
