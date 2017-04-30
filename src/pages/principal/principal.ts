import {Component, Output, EventEmitter, ViewChild} from '@angular/core';
import {ToastController, Slides, Events, Content, Select, AlertController} from "ionic-angular";
import {ModalSearch} from '../../pages/modals/search';
import {MainService} from "../../app/main.service";
import 'leaflet';
import {NavController, LoadingController} from 'ionic-angular';
import {Empresas} from "../empresas/empresas";
import {MapService} from './../../directives/map/map.service';
import {GeosearchComponent} from './../../directives/map/geosearch.component';
import {ModalMapa} from './modalMapa.component';
import {Geolocation} from 'ionic-native';
import {GeocodingService} from "../../directives/map/geocode.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'page-principal',
    templateUrl: 'principal.html'
})
export class PrincipalPage {

    @Output() locationFound = new EventEmitter();
    @ViewChild('mySlider') slider: Slides;
    @ViewChild(Content) content: Content;


    tabs = "0";
    tabBody = 0;

    tipoPublicacion = "all";

    errorNoConexion = false;

    publicaciones: any[];

    promoCalendario: any;

    myDate = new Date();

    showSearch: Boolean = false;

    search = "";

    localidades = [];
    locals:any='';

    user = null;

    complete = false;
    oktext:any='Ok';
    canceltext:any='Cancel';

    @ViewChild('searchP') searchP: Select;

    constructor(private navController: NavController,
                public mainservice: MainService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public alertCtrl: AlertController,
                public geoService: GeocodingService,
                public events: Events,
                public translateService:TranslateService,
                public mapService: MapService) {
        this.mapService = mapService;

      translateService.get('ok').subscribe(
        value => {
          // value is our translated string
          this.oktext = value;
        }
      );

      translateService.get('cancelar').subscribe(
        value => {
          // value is our translated string
          this.canceltext = value;
        }
      );
    }

    ngOnInit() {


        setTimeout(() => { // <===
            this.doRefresh(false);
        }, 2000);

        this.events.subscribe(this.mainservice.event_location_detected, (location) => {

            this.setCurrentLocalidad(location.latitude, location.longitude);
        });
        if (!this.mainservice.currentLocalidad) {
            Geolocation.getCurrentPosition().then((location) => {
                this.setCurrentLocalidad(location.coords.latitude, location.coords.longitude);
                //this.setCurrentLocalidad(-27.4338563, -55.8643096);
            }, error => console.log("error al consultar ciudad actual"));
        } else {
            this.search = this.mainservice.currentLocalidad;
        }

        this.getLocalidades();
    }


    getLocalidades() {
        this.mainservice.getAll('localidades/publicaciones').then(
            (response) => {
                this.localidades = response;
                if (response.length > 0) {
                    this.search = response[0].descripcion;
                    this.localidades.unshift({descripcion: 'Sin Filtros'});
                }

            }
        );
    }

    setCurrentLocalidad(lat, lng) {
        let latlng = lat + ',' + lng;
        this.geoService.getCitys(latlng).subscribe(addr => {

            console.log(location);
            if (addr.valid) {

                for (let l of this.localidades) {
                    if (l.description == addr.address) {
                        this.search = addr.address;
                        this.mainservice.currentLocalidad = addr.address;
                        return;
                    }
                }


            }
        }, error => console.log("error al consultar ciudad actual"));

    }

    onSlideChanged() {
        let currentIndex = this.slider.getActiveIndex();
        console.log("Current index is", currentIndex);
        this.tabBody = currentIndex;
        this.tabs = currentIndex.toString();
        if (this.tabs == "1") {
            this.pageEmpresas();
        }
        else if (this.tabs == "2") {
            this.pageNotificaciones();
        }
        this.content.scrollToTop();
    }

    selectedTab() {
        // this.slider.slideTo(+this.tabs, 500);


        console.log(this.user);

        if (this.tabs == "2") {
            if (!this.user || this.user.nombre == "demo") {
                this.mainservice.sinUsuario();
                this.tabs = this.tabBody.toString();
                return;
            }
        }

        this.tabBody = +this.tabs;

    }

    cancelarBusqueda() {
        this.mainservice.currentLocalidad = this.search;

    }

    mostrarBusqueda() {

        if (this.localidades.length > 0) {
            this.searchP.open();
        } else {
            this.getLocalidades();
        }


        // console.log(this.searchP);
        //
        // setTimeout(() => {
        //     this.searchP.setFocus();
        // }, 150);

    }

    getPublicaciones(userID, fields, loader, refresher) {
        let resource = 'publicaciones/' + userID + '/persona';
        this.mainservice.getAll(resource, fields)
            .then(
                (data) => {
                    this.publicaciones = data;

                    this.complete = true;

                    this.errorNoConexion = false;
                    loader.dismissAll();
                    if (refresher) {
                        refresher.complete();
                    }
                })
            .catch(
                (ex) => {
                    console.error('error publicaciones', ex)


                    this.errorNoConexion = true;
                    //this.publicaciones = [];
                    loader.dismissAll();
                    if (refresher) {
                        refresher.complete();
                    }

                    let toast = this.toastCtrl.create({
                        message: "",
                        duration: 2000,
                        position: 'center'
                    });

                    toast.present(toast);
                }
            )
    }


    doRefresh(refresher, fields?) {
        let esperetxt = this.mainservice.getTranslate('espere');
        if (esperetxt == 'espere') {
            let lan = this.mainservice.getNavigatorLenguaje();
            if (lan == 'en') {
                esperetxt = 'Espere, por favor';
            } else if (lan == 'pt') {
                esperetxt = 'Aguarde, por favor';
            } else {
                esperetxt = 'Please wait';
            }
        }

        let loader = this.loadingCtrl.create({
            content: esperetxt,
            // duration: 6000
        });
        loader.present();


        this.mainservice.getUser().then(
            (user) => {

                console.log('USER_OK', user);
                this.user = user;
                this.getPublicaciones(user.userID, fields, loader, refresher);
            },
            (error) => {
                console.log('USER_ERROR', error);
                this.mainservice.getUserDemo().then(
                    (user) => {
                        console.log('USERDEMO_OK', user);
                        this.getPublicaciones(user.userID, fields, loader, refresher);
                    },
                    (error) => {
                        console.log('USERDEMO_ERROR', error);
                        this.doRefresh(false);
                    }
                );
            }
        );

        this.mainservice.getAll('promo/calendario')
            .then(
                (data) => {
                    if (data) {
                        this.promoCalendario = data[0];
                    } else {
                        this.promoCalendario = false;
                    }
                }
            );
        this.tabs = '0';

    }


    modalSearch() {

        let modal = this.mainservice.modalCreate(ModalSearch);

        modal.present();

        modal.onDidDismiss((data) => {

            if (data) {
                let fields = "fields=" + JSON.stringify(data);

                this.doRefresh(false, fields);
            }


        });
    }

    modalRanking() {
        let modal = this.mainservice.modalCreate(GeosearchComponent);

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    show_alert(){
      let alert = this.alertCtrl.create();
      var title='localidad';

      for(var i in this.localidades){
        alert.addInput({
          type:'radio',
          label:this.localidades[i].descripcion,
          value:this.localidades[i].id,
          checked:false
        });

      }

      alert.addButton(this.canceltext);
      alert.addButton({
        text: this.oktext,
        handler: data => {
          console.log('Checkbox data:', data);
          this.locals=data;
        }
      });

      this.translateService.get(title).subscribe(
        value => {
          // value is our translated string
          alert.setTitle(value);

          alert.present();

        }
      );

    }


    modalEmpresas() {
        let modal = this.mainservice.modalCreate(Empresas);

        modal.present();

        modal.onDidDismiss((data: any[]) => {
            if (data) {
                console.log(data);
            }
        });
    }

    pageEmpresas() {
        // this.navController.push(Empresas);
    }

    pageNotificaciones() {

    }

    toastPromo(promo) {


        let toast = this.toastCtrl.create({
            message: promo.titulo + " BY: " + promo.nombre_empresa.toUpperCase(),
            duration: 2000,
            position: 'center'
        });

        toast.present(toast);
    }


    modalUbicaciones() {

        let loader = this.loadingCtrl.create({
            content: this.mainservice.getTranslate('espere'),
            // duration: 6000
        });
        loader.present();

        let resource = 'empresas'

        this.mainservice.getAll(resource)
            .then(response => {
                let param = {
                    empresas: response
                };

                loader.dismissAll();

                this.navController.push(ModalMapa, param);

            })
            .catch((ex) => {

                console.log('error ubicaciones', ex);
                loader.dismissAll();

                let toast = this.toastCtrl.create({
                    message: "Error en la conexión a internet",
                    duration: 2000,
                    position: 'center'
                });

                toast.present(toast)
            });

    }

}
