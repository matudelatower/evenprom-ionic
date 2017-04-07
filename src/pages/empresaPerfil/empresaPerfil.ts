import {Component} from '@angular/core';
import {
    NavController, NavParams, ViewController, LoadingController, ToastController,
    ActionSheetController
} from 'ionic-angular';
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
    Diagnostic,
    NativeStorage
} from 'ionic-native';
import {MainService} from "../../app/main.service";
import {GeocodingService} from "../../directives/map/geocode.service";
import {PubliacionesEmpresaActualPage} from "../publiaciones-empresa-actual/publiaciones-empresa-actual";
import {RutaPage} from "../ruta/ruta";


@Component({
    selector: 'page-empresa-perfil',
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

    usuario: any;

    constructor(navParams: NavParams,
                public navController: NavController,
                sanitizer: DomSanitizer,
                public viewCtrl: ViewController,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public geocoder: GeocodingService,
                public actionSheetCtrl: ActionSheetController,
                public mainService: MainService) {
        console.log("Passed params", navParams.data.empresa);

        if (!this.empresa) {
            this.empresa = navParams.data.empresa;
            console.log(this.empresa);
            let loader = this.loadingCtrl.create({
                content: this.mainService.getTranslate('espere'),
                // duration: 6000
            });
            loader.present();

            this.getComentarios(loader);

            this.getImagenes();

            this.link_youtube = sanitizer.bypassSecurityTrustResourceUrl(navParams.data.empresa.link_youtube);
            this.icono = navParams.data.icono;

            this.mainService.getAll('noticias/' + this.empresa.id + '/empresa')
                .then(response => {
                    this.noticias = response;
                    this.mainService.getUser()
                        .then(
                            (usuario) => {
                                this.usuario = usuario;
                            }
                        );
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
        console.log('url', url);
        if (url == null) {
            let toast = this.toastCtrl.create({
                message: "La empresa no tiene sitio web cargado",
                duration: 3000,
                position: 'center'
            });

            toast.present(toast);
            return false;
        }
        window.open(url, "_system");
    }

    shareWhastApp(message: string, image?: string, url?: string) {

        let imageEncode = null;
        if (image) {
            imageEncode = encodeURI(image);
        }

        SocialSharing.shareViaWhatsApp(message, imageEncode, url)
            .then((data) => {
                console.log("Success");
            }, (err) => {
                console.error(err);
                let toast = this.toastCtrl.create({
                    message: "No se pudo compartir en WhatsApp",
                    duration: 3000,
                    position: 'center'
                });

                toast.present(toast);
            });
    }

    shareFacebook(message: string, image?: string, url?: string) {


        let imageEncode = null;
        if (image) {
            imageEncode = encodeURI(image);
        }

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

                    SocialSharing.shareViaFacebook(message, imageEncode, url).then(() => {

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
                        let personaId = this.usuario.userID;

                        // this.mainService.postRegistrarLlamada(empresaId, personaId)
                        this.mainService.post('registros/' + empresaId + '/llamadas/' + personaId + '/empresas')
                            .then((data) => {
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

    publicacionesActual() {

        this.navController.push(PubliacionesEmpresaActualPage,
            {
                empresa: this.empresa
            });
    }

    comentar() {
        if (this.comentario) {
            let loader = this.loadingCtrl.create({
                content: "Enviando comentario",
                // duration: 6000
            });
            loader.present();

            this.comentarEmpresa(this.usuario, loader);
        }

    }

    comentarEmpresa(user, loader) {


        let param = {
            'texto': this.comentario
        };
        this.mainService.post('comentars/' + this.empresa.id + '/empresas/' + user.userID, param)
            .then(
                (data) => {
                    // postComentarEmpresa(this.empresa.id, user.userID, this.comentario).subscribe((data) => {
                    this.comentario = '';
                    loader.dismissAll();
                    console.log('comente', this.comentario);
                    loader = this.loadingCtrl.create({
                        content: this.mainService.getTranslate('espere'),
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

        this.mainService.getAll('comentarios/' + this.empresa.id + '/empresa')
            .then((data) => {
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
            content: this.mainService.getTranslate('espere'),
            // duration: 6000
        });
        loader.present();

        this.mainService.getAll('fotos/' + this.empresa.id + '/empresa')
            .then((data) => {
                this.imagenes = data;
                console.log(data);
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
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Abrir mapas con',
            buttons: [
                {
                    color: 'danger',
                    icon: 'logo-google',
                    text: 'Google Maps',
                    role: 'gmaps',
                    cssClass: 'g-maps',
                    handler: () => {
                        this.gMapsBack();
                    }
                }, {
                    cssClass: 'leaflet',
                    icon: 'map',
                    text: 'Leaflet',
                    role: 'leaflet',
                    handler: () => {
                        this.leafletBack();
                    }
                }
            ]
        });
        actionSheet.present();
    }

    gMaps() {

        console.log("gmaps");


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

        Geolocation.getCurrentPosition({timeout: 8000}).then((resp) => {
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


    }

    gMapsBack() {

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

        NativeStorage.getItem('location').then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude

            if (!resp) {
                this.gMaps();
                return;
            }

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
            this.gMaps();
            let toast = this.toastCtrl.create({
                message: "No se ha podido abrir el mapa.",
                duration: 1500,
                position: 'center'
            });

            toast.present(toast);
        });


    }

    leafletBack() {


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

        NativeStorage.getItem('location').then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude

            if (!resp) {
                loader.dismissAll();
                this.leaflet();
                return;
            }

            let actual = {
                lat: resp.coords.latitude,
                lng: resp.coords.longitude,
            };

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

                let destino = {
                    lat: lat,
                    lng: lng
                };

                let toast = this.toastCtrl.create({
                    message: "Ruta encontrada.",
                    duration: 2520,
                    position: 'center'
                });

                toast.present(toast);

                this.navController.push(RutaPage,
                    {
                        ways: [actual, destino],
                        msgs: ["Partida: <strong>Tu ubicación</strong>", "Destino: <strong>" + this.empresa.nombre + "</strong>"]
                    });


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
            this.leaflet();
        });

    }

    leaflet() {

        console.log("leaflet");
        // Diagnostic.isGpsLocationEnabled().then((resp) => {
        //     if (resp === true) {
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

        Geolocation.getCurrentPosition({timeout: 8000}).then((resp) => {
            // resp.coords.latitude
            // resp.coords.longitude

            let actual = {
                lat: resp.coords.latitude,
                lng: resp.coords.longitude,
            };

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

                let destino = {
                    lat: lat,
                    lng: lng
                };

                let toast = this.toastCtrl.create({
                    message: "Ruta encontrada.",
                    duration: 2520,
                    position: 'center'
                });

                toast.present(toast);

                this.navController.push(RutaPage,
                    {
                        ways: [actual, destino],
                        msgs: ["Partida: <strong>Tu ubicación</strong>", "Destino: <strong>" + this.empresa.nombre + "</strong>"]
                    });


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


        //     } else {
        //         let toast = this.toastCtrl.create({
        //             message: "Necesitás habilitar el GPS para realizar esta función",
        //             duration: 1500,
        //             position: 'center'
        //         });
        //
        //         toast.present(toast);
        //
        //     }
        // }).catch((error) => {
        //     console.log("isGpsLocationEnabled ERROR:", error);
        // });

    }

    openFileChooser() {

        this.mainService.getUser().then((user) => {
            this.uploadImg(user.userID, this.empresa.id);
        }, (error) => {
            this.mainService.sinUsuario();
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
                            fileTransfer.upload(newImage, this.mainService.routeServices.uploadImage + empresaId + "/personas/" + userID + "/empresas")
                                .then(
                                    (data) => {
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

    agregarANotificacion(empresaId) {
        let params = {
            empresa: [empresaId],
        };

        console.log('notificaciones', params);

        this.mainService.put('notificaciones', this.usuario.userID, params)
            .then(
                (ondas) => {
                    let toast = this.toastCtrl.create({
                        message: 'Se agrego a notificaciones',
                        duration: 2000,
                        position: 'center'
                    });

                    toast.present(toast);

                },
                (err) => {
                   this.mainService.sinUsuario();

                }
            );

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
