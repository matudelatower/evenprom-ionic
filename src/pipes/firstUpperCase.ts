import {Injectable, Pipe} from '@angular/core';

/*
 Generated class for the Truncate pipe.

 See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 Angular 2 Pipes.
 */
@Pipe({
    name: 'fuppercase'
})
@Injectable()
export class FirstUpperCase {

    transform(value: string, args: string[]): string {

        if (value) {

            value = value.toLocaleLowerCase();
            return value.charAt(0).toUpperCase() + value.slice(1);


        }
    }
}
