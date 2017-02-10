import {Injectable, Pipe} from '@angular/core';

/*
 Generated class for the Truncate pipe.

 See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 Angular 2 Pipes.
 */
@Pipe({
    name: 'descuentoMenos'
})
@Injectable()
export class DescuentoMenos {

    transform(value: string, args: string[]): string {

        if (value) {

            if (value.indexOf('%') > -1) {
                return "-" + value;
            }

        }
    }
}
