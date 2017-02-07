import {NgModule} from '@angular/core';
import {Http} from '@angular/http';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {EmpresaPerfilPage} from "../pages/empresaPerfil/empresaPerfil";
import {LoginPage} from "../pages/login/login";
import {PrincipalPage} from "../pages/principal/principal";
import {RankingPage} from "../pages/ranking/ranking";
import {TranslateModule, TranslateLoader} from "ng2-translate";
import {ItemListEmpresa} from "../directives/empresa-list.directive";
import {Progressbar} from "../directives/progress-bar/progressbar.component";
import {Bar} from "../directives/progress-bar/bar.component";
import {Progress} from "../directives/progress-bar/progress.directive";
import {MainService} from "./main.service";
import {ModalSearch} from "../pages/modals/search";
import {ToggleDirective} from "../directives/toggle/toggle";
import {ModalPreviewPublicacion} from "../pages/modals/previewPublicacion";
import {Empresas} from "../pages/empresas/empresas";
import {CommentText} from "../directives/comment-text";
import {FilterPublicaciones} from "../filters/filter-publicaciones";
import {GeocodingService} from "../directives/map/geocode.service";
import {MapService} from "../directives/map/map.service";
import {MapComponent} from '../directives/map/map.component';
import {GeosearchComponent} from '../directives/map/geosearch.component';
import {ModalMapa} from '../pages/principal/modalMapa.component';
import {MapaEmpresaComponent} from "../directives/map-empresa/map.component";
import {DefaultImageDirective} from "../directives/img/image-default.directive";
import {TranslateStaticLoader} from "ng2-translate/index";
import {UserData} from "../pages/login/user-data";
import {ModalComentario} from "../pages/principal/modal.comentario.component";
import {FavoritosPage} from "../pages/favoritos/favoritos";
import {TuEmpresaAquiPage} from "../pages/tu-empresa-aqui/tu-empresa-aqui";
import {ContactoPage} from "../pages/contacto/contacto";
import {CheckInPage} from "../pages/check-in/check-in";
import {BuscarAmigosPage} from "../pages/buscar-amigos/buscar-amigos";
import {CalendarioPage} from "../pages/calendario/calendario";
import {ItemEmpresaComponent} from "../components/item-empresa/item-empresa";
import {ModalImageDefault} from "../directives/img/image-default.modal";
import {Truncate} from "../pipes/truncate";
import {Config} from "./config";
import {FirstUpperCase} from "../pipes/firstUpperCase";


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        EmpresaPerfilPage,
        LoginPage,
        PrincipalPage,
        RankingPage,
        ModalSearch,
        ItemListEmpresa,
        Progress,
        Progressbar,
        Bar,
        ToggleDirective,
        ModalPreviewPublicacion,
        Empresas,
        CommentText,
        FilterPublicaciones,
        MapComponent,
        GeosearchComponent,
        ModalMapa,
        MapaEmpresaComponent,
        DefaultImageDirective,
        ModalImageDefault,
        FavoritosPage,
        ContactoPage,
        TuEmpresaAquiPage,
        ModalComentario,
        CheckInPage,
        BuscarAmigosPage,
        CalendarioPage,
        ItemEmpresaComponent,
        ModalImageDefault,
        Truncate,
        FirstUpperCase
    ],
    imports: [
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
            deps: [Http]
        }),
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        EmpresaPerfilPage,
        LoginPage,
        PrincipalPage,
        RankingPage,
        ModalSearch,
        ItemListEmpresa,
        ModalPreviewPublicacion,
        Empresas,
        MapComponent,
        GeosearchComponent,
        ModalMapa,
        FavoritosPage,
        ContactoPage,
        TuEmpresaAquiPage,
        ModalComentario,
        CheckInPage,
        BuscarAmigosPage,
        CalendarioPage,
        ItemEmpresaComponent,
        ModalImageDefault
    ],
    providers: [Storage, MainService, GeocodingService, MapService, UserData, Config],
    schemas: [
        // ItemListEmpresa,
        // Progressbar
    ]
})
export class AppModule {
}
