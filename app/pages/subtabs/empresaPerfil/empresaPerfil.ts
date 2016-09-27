import {Component} from '@angular/core';
import {NavController, Nav, NavParams} from 'ionic-angular';
import {CommentText} from '../../../directives/comment-text';
import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';


@Component({
    templateUrl: 'build/pages/subtabs/empresaPerfil/empresaPerfil.html',
    directives: [CommentText]
})
export class EmpresaPerfilPage {

    private empresa:any = false;
    private link_youtube:any = "";
    private icono:any = "home";

    constructor(navParams:NavParams, private navController:NavController, private nav:Nav, sanitizer:DomSanitizationService) {
        console.log("Passed params", navParams.data.empresa);

        if (!this.empresa) {
            this.empresa = navParams.data.empresa;
            this.link_youtube = sanitizer.bypassSecurityTrustResourceUrl(navParams.data.empresa.link_youtube);
            this.icono= navParams.data.icono;
        }

    }

    focusInput(input) {
        input.setFocus();
    }
}
