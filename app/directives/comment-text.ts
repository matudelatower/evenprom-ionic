import { Component, ElementRef, Input, HostListener, Attribute } from '@angular/core';


@Component({
    selector: 'comment-text',
    template: '<p [ngClass]="clase" (click)="expandedText();">{{text}}</p>',

})
export class CommentText {

    @Input() text: string ;

    expanded = false;
    clase = 'white-space-nowrap';
    constructor() {

    }

    // ngOnInit() {
    //     this.empersa = 
    // }

    expandedText (){
        this.expanded = !this.expanded;
        if (this.expanded){
            this.clase = 'white-space-initial';
        }else{
            this.clase = 'white-space-nowrap';
        }
    }

}

