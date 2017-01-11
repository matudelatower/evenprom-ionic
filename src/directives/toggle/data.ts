import { Component } from '@angular/core';

@Component({
    selector: 'data'
})
export class Data {

    //constructor(
    //    public title:string,
    //    public details:string,
    //    public icon:string,
    //    public slug:string,
    //    public showDetails:boolean,
    //    public items:any,
    //    public localidades:any[]
    //) {
    //}

    public search = "";
    constructor(
        public title:string,
        public details:string,
        public icon:string,
        public slug:string,
        public showDetails:boolean,
        public items:any,
        public autocomplete:boolean,
    ) {
    }
}
