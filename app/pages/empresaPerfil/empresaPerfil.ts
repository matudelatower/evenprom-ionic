import {Component} from '@angular/core';
import {NavController, Nav} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/subtabs/empresaPerfil/empresaPerfil.html'
})
export class EmpresaPerfilPage {

  
  slideOptions:any ={direction:'vertical',paginationType: 'fraction' };
  constructor(private navController: NavController, private nav : Nav) {
    console.log(this.nav);
    
  
  }
}
