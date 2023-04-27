import { Component, Input } from '@angular/core';

@Component({
  selector: 'mpw-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.sass']
})
export class InputErrorComponent {
  @Input()
  errorText: string;

}
