import { Directive, ElementRef, Input, Output, EventEmitter, TemplateRef, ViewContainerRef } from '@angular/core';
import { OptionService } from "../services/option.service";
import { CommonService } from "../services/common.service";

@Directive({
  selector: '[autoRefresh]'
})
export class AutoRefreshDirective {

  @Output() autoRefresh = new EventEmitter();

  constructor(public optionService: OptionService,
              public commonService: CommonService) {
    this.init()
  }

  init() {
    let publicKey = this.commonService.getAccountDetailsFromSession('publicKey');
    this.optionService.loadOptions(publicKey, (optionsObject) => {
      if (optionsObject.AUTO_UPDATE) {
        this.startAutoRefresh(optionsObject.REFRESH_INTERVAL_MILLI_SECONDS);
      }
    }, (e) => {

    });
  }

  startAutoRefresh(interval) {
    let timer = setInterval(() => {
      this.autoRefresh.emit();
    }, interval);
  }
}