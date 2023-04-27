import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mpw-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.sass']
})
export class PaginationComponent {
  @Input() maxSize = 7;
  @Input() itemsPerPage = 10;
  @Input() itemsPerPageOptions = [5, 10, 20];
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();
}
