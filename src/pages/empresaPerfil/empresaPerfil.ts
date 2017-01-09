import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, LoadingController, ToastController} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {SocialSharing, AppAvailability, Device, CallNumber, EmailComposer} from 'ionic-native';
import {MainService} from "../../app/main.service";


@Component({
    selector: 'page-empresaPerfil',
    templateUrl: 'empresaPerfil.html'
})
export class EmpresaPerfilPage {

    empresa: any;
    public link_youtube: any = "";
    public icono: any = "home";

    comentario:any;
    comentarios: any[];
    noticias: any[];

    constructor(navParams: NavParams,
                public navController: NavController,
                sanitizer: DomSanitizer,
                public viewCtrl: ViewController,
                public loadingCtrl: LoadingController,
                public toastCtrl:ToastController,
                public mainService: MainService) {
        console.log("Passed params", navParams.data.empresa);

        if (!this.empresa) {
            this.empresa = navParams.data.empresa;
            console.log( this.empresa);
            let loader = this.loadingCtrl.create({
                content: "Cargando comentarios",
                // duration: 6000
            });
            loader.present();

            this.getComentarios(loader);

            this.link_youtube = sanitizer.bypassSecurityTrustResourceUrl(navParams.data.empresa.link_youtube);
            this.icono = navParams.data.icono;

            this.mainService.getNoticiasEmpresa(this.empresa.id).toPromise()
                .then(response => {
                    this.noticias = response.json();

                });
        }

    }

    focusInput(input) {
        input.setFocus();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    openUrl(url) {
        window.open(url, "_system");
    }

    shareWhastApp(message: string, image?: string, url?: string) {

        SocialSharing.shareViaWhatsApp(message, image, url).then(() => {

        }).catch(() => {
            // Error!
        });
    }

    shareFacebook(message: string, image?: string, url?: string) {

        console.log(message, image, url);

        let app;

        if (Device.platform === 'iOS') {
            app = 'facebook://';
        } else if (Device.platform === 'Android') {
            app = 'com.facebook.katana';
        }

        AppAvailability.check(app)
            .then(
                () => {
                    console.log(app + ' is available')

                    SocialSharing.shareViaFacebook(message, image, url).then(() => {

                    }).catch(() => {
                        // Error!
                    });
                },
                () => {
                    console.log(app + ' is NOT available');
                    this.share(message, image, url);

                }
            );


    }

    share(message: string, subject?: string, image?: string, url?: string) {

        SocialSharing.share(message, '@evenprom', image, url).then(() => {

        }).catch(() => {
            // Error!
        });
    }

    call(empresaId, tel) {

        if (tel) {
            CallNumber.callNumber(tel, true)
                .then(() => {
                        console.log('Launched dialer!');
                        let personaId = this.mainService.user.id;

                        this.mainService.postRegistrarLlamada(empresaId, personaId).subscribe((data) => {
                            console.log('Llamada registrada');
                        });
                        ;

                    }
                )
                .catch(() => console.log('Error launching dialer'));
        }

    }

    sendMail(mail) {
        if (mail) {
            EmailComposer.isAvailable().then((available: boolean) => {
                if (available) {
                    //Now we know we can send
                }
            });

            let email = {
                to: mail,
                subject: 'Contacto desde EvenProm',
                body: 'Via EvenPromApp',
                isHtml: true
            };
// Send a text message using default options
            EmailComposer.open(email);
        }
    }

    comentar() {
        if (this.comentario) {
            let loader = this.loadingCtrl.create({
                content: "Enviando comentario",
                // duration: 6000
            });
            loader.present();

            this.mainService.getUser().then((user)=> {
                this.comentarEmpresa(user, loader);
            }, (error)=> {
                console.log(error);
                loader.dismissAll();
                let toast = this.toastCtrl.create({
                    message: this.mainService.mensajeUserAnonimo,
                    duration: 3250,
                    position: 'center'
                });

            });
        }

    }

    comentarEmpresa(user, loader) {


        this.mainService.postComentarEmpresa(this.empresa.id, user.userID, this.comentario).subscribe((data) => {
            this.comentario = '';
            loader.dismissAll();
            console.log('comente', this.comentario);
            loader = this.loadingCtrl.create({
                content: "Cargando comentarios",
                // duration: 6000
            });
            loader.present();
            this.getComentarios(loader);
        }, (error) => {
            let toast = this.toastCtrl.create({
                message: "No se ha podido enviar el comentario. Intentelo nuevamente a la brevedad.",
                duration: 3250,
                position: 'center'
            });

            toast.present(toast);
            loader.dismissAll();
        });
    }


    getComentarios( loader) {
        this.mainService.getComentariosEmpresa(this.empresa.id).subscribe((data)=> {
            this.comentarios = data;
            loader.dismissAll();
        }, (error)=>{
            loader.dismissAll();
            let toast = this.toastCtrl.create({
                message: "No se han podido cargar los comentarios.",
                duration: 3250,
                position: 'center'
            });

            toast.present(toast);
        });
    }
}
