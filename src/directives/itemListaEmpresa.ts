import { Directive, ElementRef, Input } from '@angular/core';


@Directive({
    selector: '[item-list-empresa]',

})
export class ItemListEmpresa {

    @Input('item-list-empresa') color: string;

    _defaultColor: string = 'black';

    private el: HTMLElement;


    constructor(el: ElementRef) {
        
        this.el = el.nativeElement;
        this.set(this.color || this._defaultColor);
    }

    private set(color: string) {
        console.log(color);
        this.el.style.borderBottomColor = color;
        this.el.style.borderBottomWidth = "5px";
        
    }

    ngOnInit() {
        this.set(this.color || this._defaultColor);
    }



}