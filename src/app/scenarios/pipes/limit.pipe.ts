import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit'
})
export class LimitPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) {
      return '';
    }
    const limit = args ? parseInt(args, 10) : 10;

    return value.length > limit ? value.substring(0, limit) : value;
  }
}
