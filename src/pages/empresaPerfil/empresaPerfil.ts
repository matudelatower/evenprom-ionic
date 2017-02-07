import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, LoadingController, ToastController} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';

/**
 * Agregar plugin de Camera ionic plugin add cordova-plugin-camera
 */
import {
    SocialSharing,
    Device,
    CallNumber,
    EmailComposer,
    ImagePicker,
    Transfer,
    Crop,
    Geolocation,
    Diagnostic
} from 'ionic-native';
import {MainService} from "../../app/main.service";
import {GeocodingService} from "../../directives/map/geocode.service";


@Component({
    selector: 'page-empresaPerfil',
    templateUrl: 'empresaPerfil.html'
})
export class EmpresaPerfilPage {

    empresa: any;
    public link_youtube: any = "";
    public icono: any = "home";

    comentario: any;
    comentarios: any[];
    imagenes: any[];
    noticias: any[];

    constructor(navParams: NavParams,
                public navController: NavController,
                sanitizer: DomSanitizer,
                public viewCtrl: ViewController,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public geocoder: GeocodingService,
                public mainService: MainService) {
        console.log("Passed params", navParams.data.empresa);

        if (!this.empresa) {
            this.empresa = navParams.data.empresa;
            console.log(this.empresa);
            let loader = this.loadingCtrl.create({
                content: "Cargando comentarios",
                // duration: 6000
            });
            loader.present();

            this.getComentarios(loader);

            this.getImagenes();

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

        SocialSharing.canShareVia(app)
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
                    let toast = this.toastCtrl.create({
                        message: "No tenés instalado facebook",
                        duration: 3250,
                        position: 'center'
                    });

                    toast.present(toast);
                    //this.share(message, image, url);
                    let empresaURL = this.mainService.getUrlEmpresa(this.empresa.id);
                    let faceURL = "https://m.facebook.com/sharer/sharer.php?u=" + empresaURL;
                    window.open(faceURL, "_system");

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
                .catch((error) => console.log('Error launching dialer', error));
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

            this.mainService.getUser().then((user) => {
                this.comentarEmpresa(user, loader);
            }, (error) => {
                console.log(error);
                loader.dismissAll();
                let toast = this.toastCtrl.create({
                    message: this.mainService.mensajeUserAnonimo,
                    duration: 3250,
                    position: 'center'
                });

                toast.present();

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


    getComentarios(loader) {
        this.mainService.getComentariosEmpresa(this.empresa.id).subscribe((data) => {
            this.comentarios = data;
            loader.dismissAll();
        }, (error) => {
            loader.dismissAll();
            let toast = this.toastCtrl.create({
                message: "No se han podido cargar los comentarios.",
                duration: 3250,
                position: 'center'
            });

            toast.present(toast);
        });
    }

    getImagenes() {
        let loader = this.loadingCtrl.create({
            content: "Cargando comentarios",
            // duration: 6000
        });
        loader.present();

        this.mainService.getImagenesEmpresa(this.empresa.id).subscribe((data) => {
            this.imagenes = data;
            loader.dismissAll();
        }, (error) => {
            loader.dismissAll();
            let toast = this.toastCtrl.create({
                message: "No se han podido cargar las imagenes.",
                duration: 3250,
                position: 'center'
            });

            toast.present(toast);
        });
    }

    comoLlegar() {

        Diagnostic.isGpsLocationEnabled().then((resp) => {
            if (resp === true) {
                if (!this.empresa.direccion) {
                    let toast = this.toastCtrl.create({
                        message: "La empresa no tiene cargada la dirección",
                        duration: 1500,
                        position: 'center'
                    });

                    toast.present(toast);

                    return false;
                }

                let loader = this.loadingCtrl.create({
                    content: "Abriendo mapa",
                    // duration: 6000
                });
                loader.present();

                Geolocation.getCurrentPosition({timeout:8000}).then((resp) => {
                    // resp.coords.latitude
                    // resp.coords.longitude

                    let actual = resp.coords.latitude + ", " + resp.coords.longitude;

                    let location = this.geocoder.geocode(this.empresa.direccion.calle + " " + this.empresa.direccion.altura + ", " + this.empresa.direccion.localidad);

                    location.subscribe(location => {

                        loader.dismissAll();
                        if (!location.valid) {
                            let toast = this.toastCtrl.create({
                                message: "La empresa no tiene cargada la dirección",
                                duration: 1500,
                                position: 'center'
                            });

                            toast.present(toast);
                            return;
                        }
                        // let address = location.address;

                        var newBounds = location.viewBounds;
                        //this.mapService.changeBounds(newBounds);


                        let lat = (newBounds._northEast.lat + newBounds._southWest.lat) / 2;
                        let lng = (newBounds._northEast.lng + newBounds._southWest.lng) / 2;

                        let destino = lat + ", " + lng;

                        let toast = this.toastCtrl.create({
                            message: "Ruta encontrada.",
                            duration: 1500,
                            position: 'center'
                        });

                        toast.present(toast);

                        let url = "https://www.google.com/maps/dir/" + actual + "/" + destino;


                        window.open(url, "_system");

                    }, error => {
                        loader.dismissAll();
                        let toast = this.toastCtrl.create({
                            message: "No se ha podido abrir el mapa.",
                            duration: 1500,
                            position: 'center'
                        });

                        toast.present(toast);
                    });

                }).catch((error) => {
                    loader.dismissAll();
                    let toast = this.toastCtrl.create({
                        message: "No se ha podido abrir el mapa.",
                        duration: 1500,
                        position: 'center'
                    });

                    toast.present(toast);
                });


            } else {
                let toast = this.toastCtrl.create({
                    message: "Necesitás habilitar el GPS para realizar esta función",
                    duration: 1500,
                    position: 'center'
                });

                toast.present(toast);

            }
        }).catch((error) => {
            console.log("isGpsLocationEnabled ERROR:", error);
        });


    }

    openFileChooser() {

        this.mainService.getUser().then((user) => {
            this.uploadImg(user.userID, this.empresa.id);
        }, (error) => {
            let toast = this.toastCtrl.create({
                message: this.mainService.mensajeUserAnonimo,
                duration: 1500,
                position: 'center'
            });

            toast.present();
        });

    }

    uploadImg(userID, empresaId) {
        // if (!Diagnostic ){
        //
        // }
        //

        let options = {maximumImagesCount: 1};
        let loader = this.loadingCtrl.create({
            content: "Subiendo imagen.",
            // duration: 6000
        });


        const fileTransfer = new Transfer();

        ImagePicker.getPictures(options).then((results) => {

            if (results.length > 0) {
                let imagenURL = results[0];

                Crop.crop(imagenURL, {quality: 75})
                    .then(
                        newImage => {
                            //let url = newImage.substring(0, newImage.indexOf('?'));
                            //let url = newImage.substring(0, newImage.indexOf('?'));
                            loader.present();
                            fileTransfer.upload(newImage, this.mainService.routeServices.uploadImage + empresaId + "/personas/" + userID + "/empresas").then((data) => {
                                let toast = this.toastCtrl.create({
                                    message: "Imagen subida",
                                    duration: 1500,
                                    position: 'center'
                                });

                                toast.present(toast);
                                loader.dismissAll();

                                this.getImagenes();

                            }, (error) => {
                                let toast = this.toastCtrl.create({
                                    message: "No se ha podido subir la imagen ",
                                    duration: 1500,
                                    position: 'center'
                                });

                                toast.present();
                                loader.dismissAll();
                            });
                        },
                        error => this.uploadImg(userID, empresaId)
                    );

            }


        }, (err) => {
            let toast = this.toastCtrl.create({
                message: "Error en la lectura de imágenes",
                duration: 1500,
                position: 'center'
            });
            loader.dismissAll();
            toast.present();
        });
    }

    /*** Metodo para subir fotos desde la camara

     camera() {

        this.mainService.getUser().then((user)=> {
            this.uploadImgCamera(user.userID, this.empresa.id);
        }, (error)=> {
            let toast = this.toastCtrl.create({
                message: this.mainService.mensajeUserAnonimo,
                duration: 1500,
                position: 'center'
            });

            toast.present();
        });

    }

     uploadImgCamera(userID, empresaId) {

        let options = {maximumImagesCount: 1};
        let loader = this.loadingCtrl.create({
            content: "Subiendo imagen.",
            // duration: 6000
        });


        const fileTransfer = new Transfer();

        Camera.getPicture(options).then(
            img => {
                loader.present();
                Crop.crop(img, {quality: 75})
                    .then(
                        newImage => {

                            fileTransfer.upload(newImage, this.mainService.routeServices.uploadImage + empresaId + "/personas/" + userID + "/empresas").then((data)=> {
                                let toast = this.toastCtrl.create({
                                    message: "Imagen subida",
                                    duration: 1500,
                                    position: 'center'
                                });

                                toast.present(toast);
                                loader.dismissAll();

                                this.getImagenes();

                            })
                        });


            }, (err) => {
                let toast = this.toastCtrl.create({
                    message: "Error en la lectura de imágenes",
                    duration: 1500,
                    position: 'center'
                });
                loader.dismissAll();
                toast.present();
            });
    }
     */
}
