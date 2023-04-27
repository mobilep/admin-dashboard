import { Component, Input, Output, EventEmitter } from '@angular/core';

// models
import { DataTableColumn } from '../../../models/data-table-column';
import { Sorting } from '../../../models/sorting';

@Component({
  selector: 'mpw-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.sass']
})
export class DataTableComponent {
  @Input() columns: DataTableColumn[] = [];
  @Input() hasData = true;
  @Input() sorting: Sorting;
  @Output() sortColumn = new EventEmitter<Sorting>();

  onColumnClick(columnId: string): void {
    const asc = this.sorting.columnId === columnId ? !this.sorting.asc : true;
    this.sortColumn.emit({ columnId, asc });
  }
}
