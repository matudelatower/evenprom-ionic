import { Component,Input } from '@angular/core';
import { Data } from './data';

@Component({
    selector: 'toggle-directive',
    templateUrl: 'toggle.html'
})
export class ToggleDirective {

    @Input() data:Data[];

    constructor() {
    }

    toggleDetails(data:Data) {
        if (data.showDetails) {
            data.showDetails = false;
            data.icon = 'ios-add-circle-outline';
        } else {
            data.showDetails = true;
            data.icon = 'ios-remove-circle-outline';
        }
    }


}
