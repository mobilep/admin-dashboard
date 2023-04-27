import { Input } from '@angular/core';

import { LEARNERS_SORTING_FIELD_MAPPER } from '../../constants/sorting-field-mappers';

import { MappedPractice } from 'models/scenarioPracticesData';
import { LearnersFilters } from 'models/learners-filters';
import { Sorting } from 'models/sorting';
import { Table } from 'models/table';

export class ScenarioLearnersBase implements Table {
  columns = [];
  filters: LearnersFilters;
  sorting: Sorting = { columnId: 'name', asc: true };
  SORTING_FIELD_MAPPER = LEARNERS_SORTING_FIELD_MAPPER;
  learnersPluralParams = { '=1': 'scenarioDetails.learner', other: 'common.learners' };
  currentPage = 1;
  itemsPerPage = 10;

  @Input() practices: MappedPractice[] = [];

  handleItemsPerPageChange(nOfItems: number): void {
    this.currentPage = 1;
    this.itemsPerPage = nOfItems;
  }

  handleFilterChange(filters: LearnersFilters): void {
    this.currentPage = 1;
    this.filters = filters;
  }

  handleSortColumn(sorting: Sorting): void {
    this.currentPage = 1;
    this.sorting = sorting;
  }
}
