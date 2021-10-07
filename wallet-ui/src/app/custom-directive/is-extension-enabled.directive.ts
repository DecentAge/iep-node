import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { OptionService } from "../services/option.service";
import { CommonService } from "../services/common.service";

@Directive({
  selector: '[isExtensionEnabledView]'
})
export class IsExtensionEnabledDirective {

  constructor(private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    public optionService: OptionService,
    public commonService: CommonService) {
  }
  @Input()
  set isExtensionEnabledView(isExtensionView) {

    /*
        usage of this directive :
        *isExtensionEnabledView = true -> element will be visible only if extension is enabled.
    */

    // this.optionService.pushToWatch(isExtensionEnabled, this);

    if (isExtensionView) {

      this.optionService.pushToWatch(this);

      let publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
      this.optionService.loadOptions(publicKey, (optionsObject) => {
        if (optionsObject.EXTENSIONS) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }, (e) => {
        this.viewContainer.clear();
      });

    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}