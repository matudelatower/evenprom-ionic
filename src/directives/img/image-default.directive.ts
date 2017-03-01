import { Directive, Input } from '@angular/core';
import {MainService} from "../../app/main.service";
import {ModalImageDefault} from "./image-default.modal";

@Directive({
    selector: 'img',
    host: {
        '(error)': 'updateUrl()',
        '(click)': 'openPreview()',
        '(load)': 'loadImg()',
        '[src]': 'src',
        '[style.content]': 'backgroundImage',
        '[style.margin]': '"0 auto"',
        '[style.display]': 'display',
        '[style.padding]': 'padding',
        '[style.max-width]': 'size',
        '[style.max-height]': 'size',


    }
})
export class DefaultImageDirective {
    @Input() src:string;
    @Input() default:string;
    @Input() preview:boolean = false;
    @Input() srcPreview:string;
    @Input() noError:boolean;
    backgroundImage = 'url("assets/img/spinner.gif")';
    size = '35px';
    display = 'block';
    padding = '5px';

    constructor(public mainService:MainService) {
        this.noError = false;
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


            let modal = this.mainService.modalCreate(ModalImageDefault, {srcImage: this.srcPreview});

            modal.present();
        }
    }

    loadImg() {
        // console.log('cargado en directive');
        this.backgroundImage = 'none';
        this.size = '';
        this.display = '';
        this.padding = '';
    }
}
