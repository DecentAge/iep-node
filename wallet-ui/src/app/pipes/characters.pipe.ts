import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'characters'
})
export class CharactersPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      let breakOnWord = args[1];
      if (isNaN(args)) return value;
      if (args <= 0) return '';
      if (value && value.length > args) {
          value = value.substring(0, args);

          if (!breakOnWord) {
              var lastspace = value.lastIndexOf(' ');
              //get last space
              if (lastspace !== -1) {
                  value = value.substr(0, lastspace);
              }
          }else{
              while(value.charAt(value.length-1) === ' '){
                  value = value.substr(0, value.length -1);
              }
          }
          return value + '…';
      }
      return value;
  }

}
