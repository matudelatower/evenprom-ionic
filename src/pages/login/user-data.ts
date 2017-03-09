import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import {MainService} from "../../app/main.service";


@Injectable()
export class UserData {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';

  user:any;

  constructor(public events: Events, public mainService:MainService) {}

  hasFavorite(sessionName) {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName) {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName) {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }

  login(username) {
    this.events.publish('user:login');
  }

  signup(user) {
    console.log('userdata',user);
    this.mainService.setUser(user);
    this.events.publish('user:signup', user);
  }

  logout() {
    this.events.publish('user:logout');
  }

  //getUsername() {
  //  return this.storage.get('username').then((value) => {
  //    return value;
  //  });
  //}
  //
  //// return a promise
  //hasLoggedIn() {
  //  return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
  //    return value;
  //  });
  //}
}
