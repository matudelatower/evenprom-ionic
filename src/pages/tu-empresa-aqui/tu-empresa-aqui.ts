import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TuEmpresaAquiPage');
  }

  openUrl(url) {
    window.open(url, "_system");
  }

}
