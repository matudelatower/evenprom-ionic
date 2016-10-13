import {Component} from '@angular/core';
// import {MainService} from '../../main.service';
// import {HomePage} from './home/home';
import {CategoriasPage} from './categorias/categorias';
import {NavParams, NavController} from 'ionic-angular';
// import {Tab} from "ionic-angular/index";
import {MainService} from "../../app/main.service";

@Component({
    selector: 'page-subtabs',
    templateUrl: 'subtabs.html'
})
export class SubTabsPage {

    //@Tabs('tabs') tabRef:Tabs;


    public tabCategoria:any = CategoriasPage;

    public tabIndex:number = 0;

    public title:string;

    public tabsTitles:string [] = [
        'Comida', 'Contacts'
    ];

    public categorias:any [] = [

    ];

    constructor(public params:NavParams, public nav:NavController, public mainservice:MainService) {
        // this tells the tabs component which Pages
        // should be each tab's root Page

        this.categorias.push({
            nombre: 'Gastronomia',
            icono: 'restaurant',
            slug: 'gastronomia'
        });

        let t = this;

        mainservice.getCategorias().toPromise()
            .then(function (response) {
                let cat = response.json();
                cat.splice(0, 1);

                for (let item of cat) {
                    t.categorias.push(item);
                }

                //t.tabRef.getByIndex(0).show = false;
            });


        //this.tabIndex = params.get('id') ? params.get('id') : 0;


    }

    setTitle(title) {
        this.title = title;
    }

    openCategorias(categoria) {

    }

    onPageWillEnter (){
        console.log(this.nav );
    }


}
