import { Pipe, PipeTransform } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { endOfDay, format, formatDistanceStrict } from 'date-fns';
import { fr, enGB as en } from 'date-fns/locale';

@Pipe({
  name: 'daysDistance',
  pure: false
})
export class DaysDistancePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value): string {
    const valueDate = new Date(value);
    const locale = this.translate.currentLang === 'en' ? en : fr;
    const due = this.translate.instant('templates.due');
    const date = format(endOfDay(valueDate), 'MMM do', { locale });
    const timeLeft = formatDistanceStrict(endOfDay(valueDate), new Date(), { locale, roundingMethod: 'floor' });
    const fromNow = this.translate.instant('templates.fromNow');

    return `${due} ${date}, ${timeLeft} ${fromNow}`;
  }
}
