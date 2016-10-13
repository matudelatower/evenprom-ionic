import {Component} from '@angular/core';
import {Platform, NavParams, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-previewPublicacion',
  templateUrl: 'previewPublicacion.html'
})
export class ModalPreviewPublicacion {
  public publicacion:any;

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