import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  TemplateRef,
  AfterContentChecked
} from '@angular/core';

// models
import { User } from '../../../models/user';
import { DataTableColumn } from '../../../models/data-table-column';
import { PeopleFilters } from '../../../models/people-filters';
import { Sorting } from '../../../models/sorting';

// mics
import { PEOPLE_SORTING_FIELD_MAPPER } from '../../../constants/sorting-field-mappers';

@Component({
  selector: 'mpw-people-table',
  templateUrl: './people-table.component.html',
  styleUrls: ['./people-table.component.sass']
})
export class PeopleTableComponent implements AfterContentChecked {
  @Input() users: User[] = [];
  @Output() deleteUser = new EventEmitter<string>();
  @Output() sendEmail = new EventEmitter<string>();
  @Output() selectedChange = new EventEmitter<string[]>();

  @ViewChild('checkAllCell') checkAllCell: TemplateRef<ElementRef>;

  isAllSelected: boolean;
  currentPage = 1;
  itemsPerPage = 10;
  filters: PeopleFilters;
  sorting: Sorting = { columnId: 'name', asc: true };
  SORTING_FIELD_MAPPER = PEOPLE_SORTING_FIELD_MAPPER;

  columns: DataTableColumn[] = [
    { text: '', templateRef: this.checkAllCell, className: 'people-table__checkbox-cell' },
    { text: 'name', id: 'name', className: 'people-table__name-cell', sortable: true },
    { text: 'email', id: 'email', className: 'people-table__email-cell', sortable: true },
    { text: 'invited', className: 'people-table__invited-cell' },
    { text: 'created', id: 'createdAt', className: 'people-table__created-cell', sortable: true },
    { text: '', className: 'people-table__options-cell' }
  ];

  ngAfterContentChecked(): void {
    this.columns[0].templateRef = this.checkAllCell;
  }

  selectAllChange(users: User[]): void {
    if (this.isAllSelected) {
      users.forEach(user => (user.isSelected = true));
    } else {
      users.forEach(user => (user.isSelected = false));
    }

    this.emitSelection();
  }

  emitSelection(): void {
    const selectedIds = this.users.filter(({ isSelected }) => isSelected).map(({ _id }) => _id);
    this.selectedChange.emit(selectedIds);
  }

  resetSelection(): void {
    this.users.forEach(user => (user.isSelected = false));
    this.isAllSelected = false;
    this.selectedChange.emit([]);
  }

  handleItemsPerPageChange(nOfItems: number): void {
    this.currentPage = 1;
    this.itemsPerPage = nOfItems;
  }

  handleFilterChange(filters: PeopleFilters): void {
    this.currentPage = 1;
    this.filters = filters;
    this.resetSelection();
  }

  handleSortColumn(sorting: Sorting): void {
    this.currentPage = 1;
    this.sorting = sorting;
  }
}
