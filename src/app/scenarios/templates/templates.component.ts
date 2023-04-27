import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// vendor
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
// rxjs
import { Observable, Subject } from 'rxjs';
import { filter, mapTo, pluck, switchMap, takeUntil, tap } from 'rxjs/operators';
// services
import { TemplateService } from '../../services/template.service';
// models
import { Template } from 'models/template';
import { Sorting } from 'models/sorting';
import { DataTableColumn } from 'models/data-table-column';
// misc
import { toRootParams } from '../utils';
import { TEMPLATE_SORTING_FIELD_MAPPER } from '../../constants/sorting-field-mappers';
import { AssignCoachComponent, Data as AssignCoachData } from '../assign-coach/assign-coach.component';
import { TemplateDeleteDialogComponent, Data as TemplateDeleteDialogData } from '../template-delete-dialog/template-delete-dialog.component';

@Component({
  selector: 'mpw-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.sass']
})
export class TemplatesComponent implements OnInit, OnDestroy {
  templates$: Observable<Template[]>;
  loading$: Observable<boolean>;
  dataError$: Observable<string>;
  currentPage: number;
  itemsPerPage: number;
  onDestroy$: Subject<void>;

  sorting: Sorting = { columnId: 'name', asc: true };
  SORTING_FIELD_MAPPER = TEMPLATE_SORTING_FIELD_MAPPER;

  columns: DataTableColumn[] = [
    { text: 'scenario', id: 'name', sortable: true, className: 'templates-table__name-cell'},
    { text: 'scenarioPage.dateCreated', id: 'createdAt', sortable: true, className: 'templates-table__created-at-cell'},
    { text: '', className: 'templates-table__options-cell' }
  ]

  companyId: string;

  constructor(
    private templateService: TemplateService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private toasts: ToastrService,
    private translate: TranslateService,
  ) {
    this.templates$ = this.templateService.data$;
    this.loading$ = this.templateService.loading$;
    this.dataError$ = this.templateService.error$;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.onDestroy$),
        mapTo(toRootParams(this.router.routerState)),
        pluck('id'),
        filter<string>(Boolean),
        tap((companyId) => this.companyId = companyId),
        switchMap((companyId) =>
          this.templateService.loadTemplatesByCompany(companyId)
        )
      )
      .subscribe();

    this.templates$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.templateService.resetStore();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  showDeleteTemplateDialog(templateId: string): void {
    this.dialog.open<TemplateDeleteDialogComponent, TemplateDeleteDialogData>(
      TemplateDeleteDialogComponent,
      {
        ...TemplateDeleteDialogComponent.config,
        data: {
          templateId,
          companyId: this.companyId
        }
      });
  }

  showSuccessToast(text) {
    this.toasts.clear();
    this.toasts.show(`<i class="icon-check"></i><span>${text}</span>`, null, {
      positionClass: 'toast-top-center',
      toastClass: 'toast-custom',
      enableHtml: true
    });
  }

  handleItemsPerPageChange(nOfItems: number): void {
    this.currentPage = 1;
    this.itemsPerPage = nOfItems;
  }

  handleSortColumn(sorting: Sorting): void {
    this.currentPage = 1;
    this.sorting = sorting;
  }

  openAssignCoachDialog(templateId: string) {
    this.dialog.open<AssignCoachComponent, AssignCoachData>(
      AssignCoachComponent,
      {
        ...AssignCoachComponent.config,
        data: {
          templateId,
          companyId: this.companyId
        }
      });
  }
}
