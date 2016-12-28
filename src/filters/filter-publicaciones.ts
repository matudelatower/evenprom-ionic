
import { Pipe, PipeTransform, Injectable } from "@angular/core";


@Pipe({
    name: 'filterPublicaciones',
    pure: false
})
@Injectable()
export class FilterPublicaciones implements PipeTransform {
    transform(items: any[], args: string): any {
        
        if ( !(typeof items === "undefined") ){
            return items.filter(item => args == "all" || item.tipo_publicacion.indexOf(args) !== -1);
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
       
    }
}