import {NgModule} from '@angular/core';
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
        Progressbar,
        Progress,
        Bar,
        ToggleDirective,
        ModalPreviewPublicacion,
        Empresas,
        CommentText
    ],
    imports: [
        TranslateModule.forRoot({
            provide: TranslateLoader,
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
        Empresas

    ],
    providers: [Storage, MainService],
    schemas:[
        // ItemListEmpresa,
        // Progressbar
    ]
})
export class AppModule {
}
