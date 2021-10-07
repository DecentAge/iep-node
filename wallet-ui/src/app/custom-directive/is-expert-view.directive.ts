import {Directive, ElementRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {LoginService} from "../services/login.service";

@Directive({
  selector: '[isExpertView]'
})
export class IsExpertViewDirective {

  constructor(private element: ElementRef,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              public loginservice: LoginService) {
  }
    @Input()
    set isExpertView(isExpertView) {

        /*
            usage of this directive :
            *isExpertView = true      -> element will be visible only in expert wallet.
            *isExpertView = false     -> element will be hidden in expert wallet.
            *isExpertView = undefined -> won't affect element.
        */ 
        
        this.loginservice.pushToWatch(isExpertView,this);
        
        if(isExpertView){
            if(this.loginservice.isExpertWallet) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            }else{
                this.viewContainer.clear();
            }
        }else{
            if(typeof(isExpertView) == "undefined"){
                this.viewContainer.createEmbeddedView(this.templateRef);
            }else{
                if(this.loginservice.isExpertWallet) {
                    this.viewContainer.clear();
                }else{
                    this.viewContainer.createEmbeddedView(this.templateRef);
                }
            }
        }
    }
}
