import {Component, ViewChild} from '@angular/core';
import {RankingPage} from '../ranking/ranking';
import {PrincipalPage} from '../principal/principal';
import {ContactPage} from '../contact/contact';
import {SubTabsPage} from '../subtabs/subtabs';
import {NavParams, Nav, NavController} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;

  tabIndex: number = 0;

  constructor(private params: NavParams, private nav: NavController) {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = PrincipalPage;
    this.tab2Root = RankingPage;
    this.tab3Root = SubTabsPage;

    this.tabIndex = params.get('id') ? params.get('id') : this.tabIndex;


  }


  openPage(page, index) {
 
    this.nav.push(page, { id: index });

  }
}
