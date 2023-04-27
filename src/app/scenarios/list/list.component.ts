import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// rxjs
import { mapTo, switchMap } from 'rxjs/operators';

// services
import { ScenariosService } from '../../services/scenarios.service';

// models
import { ScenarioFilters } from '../../models/scenarioFilters';
import { DataTableColumn } from '../../models/data-table-column';
import { Sorting } from '../../models/sorting';

// mics
import { SCENARIOS_SORTING_FIELD_MAPPER } from '../../constants/sorting-field-mappers';
import { toRootParams } from '../utils';

@Component({
  selector: 'mpw-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit, OnDestroy {
  scenarios$ = this.scenariosService.data$;
  coaches$ = this.scenariosService.coaches$;
  loading$ = this.scenariosService.loading$;
  dataError$ = this.scenariosService.error$;
  filters: ScenarioFilters;
  currentPage = 1;
  itemsPerPage = 10;
  sorting: Sorting = { columnId: 'name', asc: true };
  SORTING_FIELD_MAPPER = SCENARIOS_SORTING_FIELD_MAPPER;

  columns: DataTableColumn[] = [
    { text: 'scenario', id: 'name', sortable: true, className: 'scenarios__table-name-cell' },
    { text: 'scenarioPage.coach', id: 'coachName', sortable: true },
    { text: 'common.learners', id: 'learners', sortable: true },
    { text: 'scenarioPage.connections', id: 'connections', sortable: true },
    { text: 'scenarioPage.waitingOnLearner', id: 'waitingOnLearner', sortable: true },
    { text: 'scenarioPage.waitingOnCoach', id: 'waitingOnCoach', sortable: true },
    { text: 'scenarioPage.evaluated', id: 'evaluated', sortable: true },
    { text: 'created', id: 'createdAt', sortable: true, className: 'scenarios__table-created-at-cell' },
    { text: 'scenarioPage.scenarioStatus' }
  ];

  constructor(
    private scenariosService: ScenariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap
      .pipe(
        mapTo(toRootParams(this.router.routerState)),
        switchMap((params) =>
          this.scenariosService.loadScenariosByCompany(params.id)
        )
      )
      .subscribe();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.scenariosService.resetStore();
  }

  handleFilterChange(filters: ScenarioFilters): void {
    this.currentPage = 1;
    this.filters = filters;
  }

  handleItemsPerPageChange(nOfItems: number): void {
    this.currentPage = 1;
    this.itemsPerPage = nOfItems;
  }

  handleSortColumn(sorting: Sorting): void {
    this.currentPage = 1;
    this.sorting = sorting;
  }
}
