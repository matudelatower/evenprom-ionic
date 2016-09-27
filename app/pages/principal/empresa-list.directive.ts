import { Component, ElementRef, Input, HostListener, Attribute } from '@angular/core';


@Component({
    selector: 'item-list-empresa',
    templateUrl: 'build/directives/empresa-list.html'

})
export class ItemListEmpresa {

    @Input() empresa: any ;;


    constructor() {

    }

    // ngOnInit() {
    //     this.empersa = 
    // }

}

