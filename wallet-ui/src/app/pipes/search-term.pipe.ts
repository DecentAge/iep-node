import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchTerm'
})
export class SearchTermPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      if (value) {
          return '<a href="" (click)="searchValue(\'' + value + '\')">' + value + '</a>';
      } else {
          return '';
      }
  }

}
