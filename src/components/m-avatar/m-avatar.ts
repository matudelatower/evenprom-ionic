import {Component, Input} from '@angular/core';
import {MainService} from "../../app/main.service";

/*
 Generated class for the MAvatar component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
    selector: 'm-avatar',
    templateUrl: 'm-avatar.html'
})
export class MAvatarComponent {

    @Input() fbId;
    @Input() gId;
    @Input() class;

    public errorMessage: String;

    avatar: string;

    constructor(public mainService: MainService) {
        console.log('Hello MAvatar Component');
    }

    ngOnInit() {
        console.log('gId', this.gId)
        console.log('fbId', this.fbId)

        this.mainService.getAvatar(this.fbId, this.gId)
            .subscribe(
                dataAvatar => {
                    console.log('dataAvatar', dataAvatar)
                    if (dataAvatar.image) {
                        this.avatar = dataAvatar.image.url + '0';
                    } else if (dataAvatar.data) {
                        this.avatar = dataAvatar.data.url;
                    }
                },
                error => {
                    console.error('m-avatar', error);
                    this.avatar = 'assets/img/avatar.png';
                    this.errorMessage = <any>error
                }
            );


    }

}
