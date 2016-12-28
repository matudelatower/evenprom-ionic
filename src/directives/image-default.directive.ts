import { Directive, Input } from '@angular/core';

@Directive({
    selector: 'img',
    host: {
        '(error)': 'updateUrl()',
        '[src]': 'src'
    }
})
export class DefaultImageDirective {
    @Input() src:string;
    @Input() default:string;

    updateUrl() {
        if (this.default) {
            this.src = this.default;
        } else {
            this.src = "assets/default-thumbnail.jpg";
        }

    }
}
