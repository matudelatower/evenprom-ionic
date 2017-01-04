import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
// import {CommentText} from '../../../directives/comment-text';
import {DomSanitizer} from '@angular/platform-browser';
import {SocialSharing, AppAvailability, Device, CallNumber, EmailComposer} from 'ionic-native';
import {MainService} from "../../app/main.service";


@Component({
    selector: 'page-empresaPerfil',
    templateUrl: 'empresaPerfil.html'
})
export class EmpresaPerfilPage {

    public empresa: any = false;
    public link_youtube: any = "";
    public icono: any = "home";
    noticias: any[];

    constructor(navParams: NavParams,
                public navController: NavController,
                sanitizer: DomSanitizer,
                public viewCtrl: ViewController,
                public mainservice: MainService) {
        console.log("Passed params", navParams.data.empresa);

        if (!this.empresa) {
            this.empresa = navParams.data.empresa;
            console.log("empresa", this.empresa)
            this.link_youtube = sanitizer.bypassSecurityTrustResourceUrl(navParams.data.empresa.link_youtube);
            this.icono = navParams.data.icono;

            this.mainservice.getNoticiasEmpresa(this.empresa.id).toPromise()
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
                        let personaId = this.mainservice.user.id;

                        this.mainservice.postRegistrarLlamada(empresaId, personaId).subscribe((data) => {
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
}
