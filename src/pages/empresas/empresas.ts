import {Component} from '@angular/core';
import {NavController, ViewController, LoadingController} from 'ionic-angular';
import {MainService} from "../../app/main.service";


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

    public rubros: any[];
    public empresas: any[];

    public rubroSel: any;

    errorNoConexion = false;

    usuarioId = null;


    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController,
                public mainService: MainService,
                public loadingCtrl: LoadingController) {

        let loader = this.loadingCtrl.create({
            content: "Cargando",
            // duration: 6000
        });
        loader.present();
        mainService.getRubros().subscribe(
            response => this.rubros = response
        );

        // aca

        this.mainService.getUser().then((user) => {
            this.usuarioId = user.userID;
            this.mainService.getEmpresas(user.userID).subscribe(
                (data) => {
                    this.empresas = data;
                    this.errorNoConexion = false;
                    loader.dismissAll();

                },
                (err) => {
                    console.log('error timeout');

                    this.errorNoConexion = true;
                    //this.publicaciones = [];
                    loader.dismissAll();
                }
            );
        }, () => {
            this.usuarioId = null;
            this.mainService.getEmpresas(null).subscribe(
                (data) => {
                    this.empresas = data;
                    this.errorNoConexion = false;
                    loader.dismissAll();

                },
                (err) => {
                    console.log('error timeout');

                    this.errorNoConexion = true;
                    //this.publicaciones = [];
                    loader.dismissAll();

                },
            );

        });

        // console.log(this.rubros);
        // console.log(this.empresas);
    }

    loadEmpresasBySlug(rub) {
        this.rubroSel = rub;
        let loader = this.loadingCtrl.create({
            content: "Cargando",
            // duration: 6000
        });
        loader.present();
        // this.mainService.getEmpresasBySlug(rub.slug).toPromise()
        //     .then(response => {
        //         this.empresas = response.json();
        //         loader.dismissAll();
        //
        //     });
        this.mainService.getEmpresasBySlug(rub.slug, this.usuarioId).subscribe(
            (data) => {
                this.empresas = data;
                this.errorNoConexion = false;
                loader.dismissAll();

            },
            (err) => {
                console.log('error timeout');

                this.errorNoConexion = true;
                //this.publicaciones = [];
                loader.dismissAll();

            },
        );
    }

    ionViewDidLoad() {
        console.log('Hello Empresas Page');
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }


}
