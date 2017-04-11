import {Component, Input} from '@angular/core';
import {ToastController, NavController} from "ionic-angular";
import {MainService} from "../../app/main.service";
import {EmpresaPerfilPage} from "../../pages/empresaPerfil/empresaPerfil";

/*
 Generated class for the ItemEmpresa component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
    selector: 'item-empresa',
    templateUrl: 'item-empresa.html'
})
export class ItemEmpresaComponent {


    @Input() empresa;

    constructor(public toastCtrl: ToastController,
                public mainService: MainService,
                public navCtrl: NavController) {

    }

    addEmpresaFav(empresaId) {
        this.mainService.getUser().then((user) => {

            this.mainService.post('favears/' + empresaId + '/empresas/' + user.userID)
                .then((data) => {
                    let mensaje = this.mainService.getTranslate('agregadoFavoritos');

                    if (data.empresa.like_persona == true) {
                        this.empresa.likes += 1;
                    } else {
                        this.empresa.likes -= 1;
                        mensaje = this.mainService.getTranslate('sacadoFavoritos');
                    }
                    this.empresa.like_persona = data.empresa.like_persona;
                    let toast = this.toastCtrl.create({
                        message: mensaje,
                        duration: 2000,
                        position: 'bottom'
                    });

                    toast.present(toast);

                });
        }).catch(() => {
            this.mainService.sinUsuario()
        });
    }

    goToPerfil(empresa) {

        this.navCtrl.push(EmpresaPerfilPage, {empresa: empresa});

    }
}
