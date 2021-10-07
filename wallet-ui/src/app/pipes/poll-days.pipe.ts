import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";


@Pipe({
    name: 'pollDays'
})
export class PollDaysPipe implements PipeTransform {
    constructor(private sanitizer:DomSanitizer){}

    transform(value: any, args?: any): any {
        if (!value) {
            value = 0;
        }
        if (value <= 0) {
            return this.sanitizer.bypassSecurityTrustHtml('<span class="badge badge-secondary">' + value + '</span>');
        } else if (value > 0 && value < 3) {
            return this.sanitizer.bypassSecurityTrustHtml('<span class="badge badge-danger">' + value + '</span>');
        } else if (value >= 3 && value < 7) {
            return this.sanitizer.bypassSecurityTrustHtml('<span class="badge badge-warning">' + value + '</span>');
        } else if (value >= 7) {
            return this.sanitizer.bypassSecurityTrustHtml('<span class="badge badge-success">' + value + '</span>');
        } else {
            return this.sanitizer.bypassSecurityTrustHtml('<span class="badge badge-primary">' + value + '</span>');
        }
    }
}
