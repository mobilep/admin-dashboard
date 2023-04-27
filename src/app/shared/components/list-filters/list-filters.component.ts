import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mpw-list-filters',
  templateUrl: './list-filters.component.html',
  styleUrls: ['./list-filters.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListFiltersComponent {
  isExpanded = false;

  toggleFilters(): void {
    this.isExpanded = !this.isExpanded;
  }
}
