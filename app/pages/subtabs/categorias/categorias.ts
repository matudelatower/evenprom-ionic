import {Component} from '@angular/core';
import {NavController, Nav, NavParams} from 'ionic-angular';
import {EmpresaPerfilPage} from '../empresaPerfil/empresaPerfil';
import { Headers, Http , Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {MainService} from "../../../main.service";



@Component({
    templateUrl: 'build/pages/subtabs/categorias/categorias.html'
})
export class CategoriasPage {

    empresaPerfil:any;

    private categoria:any;

    private empresas:any = [];

    constructor(private navController:NavController, navParams:NavParams, private nav:Nav, private http:Http, private mainService:MainService) {
        this.empresaPerfil = EmpresaPerfilPage;

        console.log("Passed params", navParams.data);

        this.categoria = navParams.data;

        if (this.categoria.slug != 'vacio') {
            this.mainService.getEmpresasBySlug(this.categoria.slug).toPromise()
                .then(response => this.empresas = this.groupCategorias(response.json()));
        }

    }

    goToPerfil(empresa) {

        console.log(this.categoria.icono);
        this.nav.push(this.empresaPerfil, {
            empresa: empresa,
            icono: this.categoria.icono
        });
    }


    getHeroes() {
        return this.http.get('http://www.w3schools.com/website/customers_mysql.php')
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError)
            ;
    }

    private handleError(error:any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private groupCategorias(array) {


        var retorno = [];
        for (let i = 0; i < array.length; i++) {
            let dos = [];
            dos.push(array[i]);

            i++;
            if (i < array.length) {
                dos.push(array[i]);
            }

            retorno.push(dos);
        }

        console.log(retorno);

        return retorno;
    }

}
