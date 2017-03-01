import {Component} from '@angular/core';
import {NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {MainService} from "../../app/main.service";
import {LoginPage} from "../login/login";

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
                public alertCtrl: AlertController) {


        this.mainService.getAll('ondas')
            .subscribe(
                (ondas) => {
                    this.ondas = ondas;

                },
                (err) => {
                    console.error(err);

                }
            );
        this.mainService.getAll('tipodocumentos')
            .subscribe(
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
                    .subscribe(
                        (persona) => {
                            this.persona = persona;
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

                        },
                        (err) => {
                            console.error(err);
                        }
                    );
            },
            error => {
                let alert = alertCtrl.create({
                    title: 'Aviso!',
                    subTitle: 'Primero tenes que iniciar sesión!',
                    buttons: ['OK']
                });
                alert.present();
                navCtrl.setRoot(LoginPage);
            }
        );

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditarPerfilPage');
    }

    logForm() {
        console.log(this.perfil.value)

        this.mainService.put('personas', this.persona.userID, this.perfil.value)
            .subscribe(
                (ondas) => {
                    // this.ondas = ondas;
                    let toast = this.toastCtrl.create({
                        message: 'Perfil Guardado Correctamente',
                        duration: 2000,
                        position: 'center'
                    });

                    toast.present(toast);

                },
                (err) => {
                    console.error(err);

                }
            );

    }

}
