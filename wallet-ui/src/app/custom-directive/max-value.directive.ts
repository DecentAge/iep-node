import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[maxValue][formControlName],[maxValue][formControl],[maxValue][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: MaxValueDirective, multi: true}]
})
export class MaxValueDirective {

  @Input()
  maxValue: number;
  
  validate(c: FormControl): {[key: string]: any} {
      let v = c.value;
      return ( v > this.maxValue)? {"maxValue": true} : null;
  }

}
