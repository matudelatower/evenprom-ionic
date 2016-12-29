import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
// import {CommentText} from '../../../directives/comment-text';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
    selector: 'page-empresaPerfil',
    templateUrl: 'empresaPerfil.html'
})
export class EmpresaPerfilPage {

    public empresa: any = false;
    public link_youtube: any = "";
    public icono: any = "home";

    constructor(navParams: NavParams,
                public navController: NavController,
                sanitizer: DomSanitizer,
                public viewCtrl: ViewController) {
        console.log("Passed params", navParams.data.empresa);

        if (!this.empresa) {
            this.empresa = navParams.data.empresa;
            console.log("empresa", this.empresa)
            this.link_youtube = sanitizer.bypassSecurityTrustResourceUrl(navParams.data.empresa.link_youtube);
            this.icono = navParams.data.icono;
        }

    }

    focusInput(input) {
        input.setFocus();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
}
