import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(array, term, fieldName, deep): any {
    if (term) {
      const pipeArray = array.filter(item => {
        if (deep) {
          if (item[fieldName][deep]) {
            return (
              item[fieldName][deep].indexOf(term) !== -1 ||
              item[fieldName][deep].toLowerCase().indexOf(term) !== -1
            );
          } else {
            return [];
          }
        } else {
          return (
            item[fieldName].indexOf(term) !== -1 ||
            item[fieldName].toLowerCase().indexOf(term) !== -1
          );
        }
      });
      if (pipeArray.length) {
        return pipeArray;
      } else {
        return [];
      }
    } else {
      return array;
    }
  }
}
