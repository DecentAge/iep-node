import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[minValue][formControlName],[minValue][formControl],[minValue][ngModel]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinValueDirective, multi: true}]
})
export class MinValueDirective {
  @Input()
  minValue: number;
  
  validate(c: FormControl): {[key: string]: any} {
    let v = c.value;
    return ( v < this.minValue)? {"minValue": true} : null;
  }
}