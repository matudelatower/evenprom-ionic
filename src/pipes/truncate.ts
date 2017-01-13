import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the Truncate pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'truncate'
})
@Injectable()
export class Truncate {

  transform(value: string, args: string[]) : string {

    let limit = args.length > 0 ? parseInt(args[0], 10) : 10;

    let trail = args.length > 1 ? args[1] : '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
