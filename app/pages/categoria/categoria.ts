import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
import {EmpresaPerfilPage} from '../empresaPerfil/empresaPerfil';
import 'rxjs/add/operator/toPromise';
import { Headers, Http } from '@angular/http';


@Component({
  templateUrl: 'build/pages/categoria/categoria.html'
})
export class CategoriaPage {

  empresaPerfil: any;
  constructor(private navController: NavController, private nav: Nav, private http: Http) {
    this.empresaPerfil = EmpresaPerfilPage;
  }

  goToPerfil() {

    this.nav.push(this.empresaPerfil);
  }
  

  // getHeroes() {
  //   return this.http.get('https://api.github.com/users/matudelatower/repos')
  //     .toPromise()
  //     .then(response => response.json().data as Hero[])
  //     .catch(this.handleError);
  // }

}
