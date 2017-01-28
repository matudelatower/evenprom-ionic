import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import {parameters} from "./parameters";

@Injectable()
export class Config {

    private config: Object;
    constructor() {
        this.config = parameters
    }
    
    load() {

    }

    get(key: any) {
        return this.config[key];
    }

}
