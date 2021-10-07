import {Directive, ElementRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {SwappService} from '../services/swapp.service';

@Directive({
    selector: '[isAppEnabled]'
})
export class IsAppEnabledDirective {

    constructor(private element: ElementRef,
                private templateRef: TemplateRef<any>,
                private viewContainer: ViewContainerRef,
                public swappService: SwappService) {
    }

    @Input()
    set isAppEnabled(appName) {

        /*
            usage of this directive :
            *isAppEnabled = "AppName" -> element will be visible only if app is enabled. e.g *isAppEnabled = "'Escrow'"
        */

        if (appName) {
            this.swappService.pushToWatch(appName, this);

            var swapps = this.swappService.getAllSwapps();

            this.viewContainer.clear();

            let _this = this;
            swapps.forEach(function (app) {
                if (app.name == appName && app.isEnabled) {
                    _this.viewContainer.createEmbeddedView(_this.templateRef);
                }
            })
        } else {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
