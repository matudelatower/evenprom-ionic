import {Component, ViewChild} from '@angular/core';
import {MainService} from '../../main.service';
import {HomePage} from './home/home';
import {CategoriasPage} from './categorias/categorias';
import {NavParams, Nav, Tabs, NavController} from 'ionic-angular';
import {Tab} from "ionic-angular/index";

@Component({
    templateUrl: 'build/pages/subtabs/subtabs.html',
    providers: [MainService],
})
export class SubTabsPage {

    //@Tabs('tabs') tabRef:Tabs;


    private tabCategoria:any = CategoriasPage;

    private tabIndex:number = 0;

    private title:string;

    private tabsTitles:string [] = [
        'Comida', 'Contacts'
    ];

    private categorias:any [] = [

    ];

    constructor(private params:NavParams, private nav:NavController, private mainservice:MainService) {
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
