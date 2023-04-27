import { Pipe, PipeTransform } from '@angular/core';

// models
import { DataRange } from '../../models/charts-data-response';

@Pipe({
  name: 'daysRange'
})
export class DaysRangePipe implements PipeTransform {
  transform(value: DataRange): string {
    const hasStartDate = !!value.from;
    const hasEndDate = !!value.to;
    const noDates = !hasStartDate && !hasEndDate;
    const onlyStartDate = hasStartDate && !hasEndDate;
    const onlyEndDate = !hasStartDate && hasEndDate;

    if (noDates) {
      return 'metrics.datesRanges.noResponse';
    }

    if (onlyStartDate) {
      return 'metrics.datesRanges.moreThen';
    }

    if (onlyEndDate) {
      return 'metrics.datesRanges.dayOrLess';
    }

    return 'metrics.datesRanges.fromTo';
  }
}
