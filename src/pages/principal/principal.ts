import {Component} from '@angular/core';
// import {Nav, Modal} from 'ionic-angular/index';
// import {MainService} from '../main.service';
// import {ModalPreviewPublicacion} from '../modals/previewPublicacion';
// import {ItemListEmpresa} from '../../directives/empresa-list.directive';
import {ModalSearch} from '../../pages/modals/search';
import {MainService} from "../../app/main.service";
import {NavController, LoadingController} from 'ionic-angular';
import {RankingPage} from "../ranking/ranking";
import {Empresas} from "../empresas/empresas";

@Component({
    selector: 'page-principal',
    templateUrl: 'principal.html'
})
export class PrincipalPage {

    empresa: any = {
        id: 1,
        color: 'red',
        nombre: 'FREEDO',
    };

    public publicaciones: any[];

    public myDate = new Date();


    constructor(private navController: NavController,
                private mainservice: MainService,
                public loadingCtrl: LoadingController) {

        let loader = this.loadingCtrl.create({
            content: "Cargando Promos",
            // duration: 6000
        });
        loader.present();

        mainservice.getPublicaciones().toPromise()
            .then(response => {
                this.publicaciones = response.json();
                loader.dismissAll();
            });

        //console.log(this.public aciones);
    }

    ngOnInit() {

    }


    modalSearch(characterNum) {

        let modal = this.mainservice.modalCreate(ModalSearch);

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    modalRanking() {
        let modal = this.mainservice.modalCreate(RankingPage);

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }




    modalEmpresas() {
        let modal = this.mainservice.modalCreate(Empresas);

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    pageEmpresas(){
        this.navController.push(Empresas);
    }

}
