import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, AlertController, LoadingController, Events} from 'ionic-angular';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {MainService} from "../../app/main.service";

/*
 Generated class for the EditarPerfil page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-editar-perfil',
    templateUrl: 'editar-perfil.html'
})
export class EditarPerfilPage {

    private perfil: FormGroup;
    ondas: any;
    tiposDocumento: any;
    persona: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public toastCtrl: ToastController,
                public mainService: MainService,
                private formBuilder: FormBuilder,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public events: Events) {

        let loader = this.loadingCtrl.create({
            content: this.mainService.getTranslate('espere'),
            // duration: 6000
        });
        loader.present();

        this.mainService.getAll('ondas')
            .then(
                (ondas) => {
                    this.ondas = ondas;

                },
                (err) => {
                    console.error(err);

                }
            );
        this.mainService.getAll('tipodocumentos')
            .then(
                (tipoDoc) => {
                    this.tiposDocumento = tipoDoc;

                },
                (err) => {
                    console.error(err);

                }
            );


        this.perfil = this.formBuilder.group({
            nombre: ['', Validators.required],
            apellido: [''],
            fechaNacimiento: [''],
            tipoDocumento: [''],
            dni: [''],
            ondas: [''],
        });

        mainService.getUser().then(
            data => {
                this.persona = data;
                this.mainService.get('personas', data.userID)
                    .then(
                        (persona) => {
                            this.perfil.get('nombre').setValue(persona.nombre);
                            this.perfil.get('apellido').setValue(persona.apellido);
                            this.perfil.get('dni').setValue(persona.dni);


                            let fechaNac = new Date(persona.fecha_nacimiento);
                            this.perfil.get('fechaNacimiento').setValue(fechaNac.toISOString());

                            if (persona.tipo_documento) {
                                this.perfil.get('tipoDocumento').setValue(persona.tipo_documento.id);
                            }

                            if (persona.ondas) {
                                let ondas = [];
                                persona.ondas.forEach(function (item) {
                                    ondas.push(item.id);
                                });
                                this.perfil.get('ondas').setValue(ondas);
                            }

                            loader.dismissAll();

                        },
                        (err) => {
                            console.error(err);
                            loader.dismissAll();
                        }
                    );
            },
            error => {
                this.mainService.sinUsuario();
            }
        );

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditarPerfilPage');
    }

    logForm() {

        let loader = this.loadingCtrl.create({
            content: this.mainService.getTranslate('espere'),
            // duration: 6000
        });
        loader.present();

        this.mainService.put('personas', this.persona.userID, this.perfil.value)
            .then(
                (ondas) => {
                    // this.ondas = ondas;
                    let toast = this.toastCtrl.create({
                        message: this.mainService.getTranslate('perfilOk'),
                        duration: 2000,
                        position: 'center'
                    });

                    this.events.publish('user:updateOndas');

                    toast.present(toast);
                    loader.dismissAll();

                },
                (err) => {
                    console.error(err);
                    let toast = this.toastCtrl.create({
                        message: this.mainService.getTranslate('perfilError'),
                        duration: 2000,
                        position: 'center'
                    });
                    toast.present();
                    loader.dismissAll();
                }
            );

    }

}
