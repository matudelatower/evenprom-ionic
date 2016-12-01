import {Component} from '@angular/core';
import {NavController, ViewController, LoadingController} from 'ionic-angular';
import {MainService} from "../../app/main.service";
import {EmpresaPerfilPage} from "../empresaPerfil/empresaPerfil";


/*
 Generated class for the Empresas page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-empresas',
    templateUrl: 'empresas.html'
})
export class Empresas {

    public categorias:any[];
    public empresas:any[];

    public categoriaSel:any;


    constructor(public navCtrl:NavController,
                public viewCtrl:ViewController,
                public mainService:MainService,
                public loadingCtrl:LoadingController) {

        let loader = this.loadingCtrl.create({
            content: "Cargando",
            // duration: 6000
        });
        loader.present();
        mainService.getCategorias().toPromise()
            .then(
                response => this.categorias = response.json()
            );
        mainService.getEmpresas().toPromise()
            .then(response => {
                this.empresas = response.json();
                loader.dismissAll();
            });
        // console.log(this.categorias);
        // console.log(this.empresas);
    }

    loadEmpresasBySlug (cat){
        this.categoriaSel = cat;
        this.mainService.getEmpresasBySlug(cat.slug).toPromise()
            .then(response => {
                this.empresas = response.json();

            });
    }

    ionViewDidLoad() {
        console.log('Hello Empresas Page');
    }


    goToPerfil(empresa) {

        let modal = this.mainService.modalCreate(EmpresaPerfilPage, {
            empresa: empresa,
            icono: 'pizza'
        });

        modal.present();

        modal.onDidDismiss((data:any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }


}
