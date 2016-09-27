import {Component} from '@angular/core';
import {NavController, Nav, Modal} from 'ionic-angular/index';
import {MainService} from '../../main.service';
import {ModalPreviewPublicacion} from '../modals/previewPublicacion';
import {ItemListEmpresa} from '../../directives/empresa-list.directive';
import {ModalSearch} from '../../pages/modals/search';

@Component({
    templateUrl: 'build/pages/principal/principal.html',
    providers: [MainService],
    directives: [ItemListEmpresa]
})
export class PrincipalPage {

    empresa:any = {
        id: 1,
        color: 'red',
        nombre: 'FREEDO',
    };


    publicaciones:any[];


    constructor(private navController:NavController, private mainservice:MainService) {
        mainservice.getPublicaciones().toPromise()
            .then(response => this.publicaciones = response.json());

        //console.log(this.publicaciones);
    }

    ngOnInit() {

    }


    modalSearch(characterNum) {

        let modal = this.mainservice.modalCreate(ModalSearch);

        modal.present();

        modal.onDidDismiss((data:any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }


    modalPreviewPublicacion(publicacion) {
        this.mainservice.modalPublicacion(publicacion);
    }

}
