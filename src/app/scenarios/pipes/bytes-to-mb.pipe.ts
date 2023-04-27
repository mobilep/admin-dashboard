import { Pipe, PipeTransform } from '@angular/core';
import { Time } from '../upload-record-video/utils';
import { recording } from '../upload-record-video/constants';

@Pipe({
  name: 'bytesToMBsPipe'
})
export class BytesToMbPipe implements PipeTransform {
  transform(bytes: number): string {
    return (bytes / 1048576).toFixed(1);
  }

}
