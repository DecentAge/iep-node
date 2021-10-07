import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isEnabled'
})
export class IsEnabledPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      switch (value) {
          case true:
              return '<i class="fa fa-check text-success"></i>'; //was wrapped in small TODO:need to check dependency
          case false:
              return '<i class="fa fa-times text-danger"></i>'; //was wrapped in small TODO:need to check dependency
          default:
              return '<i class="fa fa-times text-danger"></i>'; //was wrapped in small TODO:need to check dependency
      }
  }

}
