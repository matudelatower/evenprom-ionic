import {Component } from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {MainService} from "../../app/main.service";

@Component({
    selector: 'image-default-modal',
    templateUrl: './image-default.modal.html'
})
export class ModalImageDefault {

    srcImage:any;

    constructor(public params:NavParams,
                public viewCtrl:ViewController,
                public mainService:MainService) {
        this.srcImage = this.params.get('srcImage');

    }

    ngOnInit() {

    }

    dismiss() {

        this.viewCtrl.dismiss(false);
    }




}
