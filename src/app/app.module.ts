import {NgModule} from '@angular/core';
import { Http,Response } from '@angular/http';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
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
// import {GeocodingService} from "../services/mapbox/geocoding.service";
// import {MapService} from "../services/mapbox/map.service";
import {GeocodingService} from "../directives/map/geocode.service";
import {MapService} from "../directives/map/map.service";
import {MapComponent} from '../directives/map/map.component';
import {GeosearchComponent} from '../directives/map/geosearch.component';
import {ModalMapa} from '../pages/principal/modalMapa.component';
import {MapaEmpresaComponent} from "../directives/map-empresa/map.component";
import {DefaultImageDirective} from "../directives/image-default.directive";
import {TranslateStaticLoader} from "ng2-translate/index";


@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        EmpresaPerfilPage,
        LoginPage,
        PrincipalPage,
        RankingPage,
        ModalSearch,
        ItemListEmpresa,
        Progress,
        Progressbar ,
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
        DefaultImageDirective
    ],
    imports: [
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
            deps: [Http]
        }),
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
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
        ModalMapa
        
    ],
    providers: [Storage, MainService,GeocodingService, MapService],
    schemas:[
        // ItemListEmpresa,
        // Progressbar
    ]
})
export class AppModule {
}
