import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';
import {EmpresaPerfilPage} from '../empresaPerfil/empresaPerfil';
import 'rxjs/add/operator/toPromise';
import { Http } from '@angular/http';


@Component({
  selector: 'page-categoria',
  templateUrl: 'categoria.html'
})
export class CategoriaPage {

  empresaPerfil: any;
  constructor(public navController: NavController, public nav: Nav, public http: Http) {
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
