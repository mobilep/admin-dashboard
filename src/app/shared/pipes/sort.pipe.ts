import { Pipe, PipeTransform } from '@angular/core';

import { Sorting } from '../../models/sorting';
import { SortingFieldMapper } from '../../models/sorting-field-mapper';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {
  transform<T>(arr: T[], sorting: Sorting, fieldMapper: SortingFieldMapper): T[] {
    if (!fieldMapper) {
      console.error('fieldMapper is required for SortPipe');
      return arr;
    }

    const fieldGetterCb = fieldMapper[sorting.columnId];
    const sortingCb = this.sortByField(fieldGetterCb);
    const sortedArr = arr.sort(sortingCb);

    if (sorting.asc) {
      return sortedArr;
    } else {
      return sortedArr.reverse();
    }
  }

  sortByField = itemValueCb => (a, b) => {
    const valA = itemValueCb(a);
    const valB = itemValueCb(b);

    if (valA < valB) {
      return -1;
    }
    if (valA > valB) {
      return 1;
    }

    return 0;
  };
}
