import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mpw-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.sass']
})
export class FileItemComponent {
  @Input()
  showCancelBtn: boolean;
  @Input()
  file: any;
  @Input()
  progress: number;
  @Output()
  cancelled = new EventEmitter<void>()
}
