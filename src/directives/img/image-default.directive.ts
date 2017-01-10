import { Directive, Input } from '@angular/core';
import {MainService} from "../../app/main.service";
import {ModalImageDefault} from "./image-default.modal";

@Directive({
    selector: 'img',
    host: {
        '(error)': 'updateUrl()',
        '(click)': 'openPreview()',
        '(load)': 'loadImg()',
        '[src]': 'src'
    }
})
export class DefaultImageDirective {
    @Input() src:string;
    @Input() default:string;
    @Input() preview:boolean = false;
    @Input() srcPreview:string;

    constructor(public mainService:MainService) {


    }

    updateUrl() {
        if (this.default) {
            this.src = this.default;
        } else {
            this.src = "assets/default-thumbnail.jpg";
        }

    }

    openPreview() {

        console.log(this.srcPreview);
        console.log(this.src);
        if (this.preview) {


            let modal = this.mainService.modalCreate(ModalImageDefault, {srcImage:this.srcPreview});

            modal.present();
        }
    }

    loadImg(){
        console.log('cargado en directive');
    }
}
