import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class LimitToPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const limit = args ? parseInt(args, 10) : 10;

    return value.length > limit ? value.substring(0, limit) : value;
  }
}
