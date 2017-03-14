import {Component, ViewChild} from '@angular/core';
import {NavController, ViewController, LoadingController, Slides} from 'ionic-angular';
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

    @ViewChild('sliderRubros') slider: Slides;

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
        mainService.getAll('rubros').then(
            response => this.rubros = response,
            (err) => {
                console.log('error timeout');
            }
        );

        // aca

        this.mainService.getUser().then((user) => {
            this.usuarioId = user.userID;
            let resource = 'empresas/' + user.userID + '/persona';
            this.mainService.getAll(resource)
                .then(
                    (data) => {
                        this.empresas = data;
                        this.errorNoConexion = false;
                        loader.dismissAll();

                    }
                )
                .catch((err) => {
                    console.error('error timeout', err);

                    this.errorNoConexion = true;
                    loader.dismissAll();
                });
        }, () => {
            this.usuarioId = null;
            let resource = 'empresas/' + null + '/persona'
            this.mainService.getAll(resource)
                .then(
                    (data) => {
                        this.empresas = data;
                        loader.dismissAll();

                    }
                ).catch(
                (err) => {
                    console.error('get empresas', err);
                    console.log('error timeout');

                    loader.dismissAll();

                });

        });

    }

    ngAfterViewInit() {
        this.slider.startAutoplay();
    }

    slideChanged() {
        let currentIndex = this.slider.getActiveIndex();

        if (currentIndex < this.rubros.length) {
            this.loadEmpresasBySlug(this.rubros[currentIndex], currentIndex);
        }

    }


    loadEmpresasBySlug(rub, index) {

        this.slider.slideTo(index, 500);
        this.rubroSel = rub;
        let loader = this.loadingCtrl.create({
            content: "Cargando",
            // duration: 6000
        });
        loader.present();

        let resource = 'empresasporslugs/' + rub.slug + '/personas/' + this.usuarioId;

        this.mainService.getAll(resource)
            .then(
                (data) => {
                    this.empresas = data;
                    this.errorNoConexion = false;
                    loader.dismissAll();

                }
            )
            .catch(
                (err) => {
                    console.error('error empresas por slug', err);
                    console.log('error timeout');

                    this.errorNoConexion = true;
                    //this.publicaciones = [];
                    loader.dismissAll();

                });
    }

    ionViewDidLoad() {
        console.log('Hello Empresas Page');
    }


    dismiss() {
        this.viewCtrl.dismiss();
    }


}
