import { Component } from '@angular/core';

@Component({
    selector: 'data'
})
export class Data {

    constructor(public title:string, public details:string, public icon:string, slug:string, public showDetails:boolean, public items:any) {
    }
}
