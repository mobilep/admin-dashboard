import { LearnersFilters } from 'models/learners-filters';
import { Sorting } from 'models/sorting';
import { DataTableColumn } from 'models/data-table-column';

export interface Table {
  columns: DataTableColumn[];

  handleItemsPerPageChange: (nOfItems: number) => void;
  handleFilterChange: (filters: LearnersFilters) => void;
  handleSortColumn: (sorting: Sorting) => void;
}
