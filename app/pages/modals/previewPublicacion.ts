import {Component} from '@angular/core';
import {Modal, Platform, NavController, NavParams, ViewController} from 'ionic-angular';

@Component({
  templateUrl: './build/pages/modals/previewPublicacion.html'
})
export class ModalPreviewPublicacion {
  private publicacion:any;

  constructor(
      public platform: Platform,
      public params: NavParams,
      public viewCtrl: ViewController
  ) {

    this.publicacion = this.params.get('publicacion');
    console.log(this.publicacion);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}