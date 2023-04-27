import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  today: any;
  yesterday: any;
  constructor() {

    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.yesterday = new Date();
    this.yesterday.setDate(this.today.getDate() - 1);
    this.yesterday.setHours(0, 0, 0, 0);

  }
  transform(value: any, args?: any): any {

    if (+value > this.today.valueOf()) {
      return 'today';
    } else if (+value > this.yesterday.valueOf()) {
      return 'yesterday';
    } else {
      return 'more';
    }

  }

}
