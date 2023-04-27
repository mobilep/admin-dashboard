import { Pipe, PipeTransform } from '@angular/core';
import { Time } from '../upload-record-video/utils';
import { recording } from '../upload-record-video/constants';

@Pipe({
  name: 'formatSecondsWithMinutesPipe'
})
export class FormatSecondsWithMinutesPipe implements PipeTransform {
  transform(passed: number): string {
    const current = Math.round(passed / 1000);
    const max = Math.round(recording.MAX_LENGTH / 1000);

    return `${Time.formatSecondsWithMinutes(current)} / ${Time.formatSecondsWithMinutes(max)}`
  }

}
