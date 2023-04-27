import {
  Component,
  Input,
  ViewChild,
  TemplateRef,
  ElementRef,
  Output,
  EventEmitter,
  AfterContentChecked
} from '@angular/core';

// models
import { MappedPractice } from '../../models/scenarioPracticesData';
import { DataTableColumn } from '../../models/data-table-column';
import { LearnersFilters } from '../../models/learners-filters';

// misc
import { ScenarioLearnersBase } from './scenario-leanners-base.component';


@Component({
  selector: 'mpw-scenario-learners-admin',
  templateUrl: './scenario-learners-admin.component.html',
  styleUrls: ['./scenario-learners-admin.component.sass']
})
export class ScenarioLearnersAdminComponent extends ScenarioLearnersBase implements AfterContentChecked {
  @Input() selectedLearnerIds: string[] = [];
  @Input() downloadAll: boolean;
  @Output() downloadAllChanged = new EventEmitter<boolean>();
  @Output() selectedLearnerIdsChanged = new EventEmitter<string[]>();

  @ViewChild('selectAllLearners') selectAllLearners: TemplateRef<ElementRef>;

  allSelected: boolean;

  columns: DataTableColumn[] = [
    { text: '', templateRef: this.selectAllLearners, className: 'scenario-learners-admin__checkbox-cell' },
    { text: 'scenarioDetails.learner', id: 'name', sortable: true },
    { text: 'common.status' },
    { text: 'scenarioDetails.connection' },
    { text: 'scenarioDetails.waitingOn' },
    { text: 'scenarioDetails.learnerEvaluation', id: 'learnerEvaluation', sortable: true },
    { text: 'scenarioDetails.coachEvaluation', id: 'coachEvaluation', sortable: true }
  ];

  ngAfterContentChecked(): void {
    this.columns[0].templateRef = this.selectAllLearners;
  }

  handleFilterChange(filters: LearnersFilters): void {
    super.handleFilterChange(filters);

    this.resetSelectedLearners();
  }

  toggleAllLearnersOf(filteredPractices: MappedPractice[], allSelected: boolean): void {
    this.selectedLearnerIds = [];

    filteredPractices.forEach(practice => {
      if (allSelected) {
        this.selectedLearnerIds.push(practice.user._id);
      }
      practice.user.selected = allSelected;
    });

    this.selectedLearnerIdsChanged.emit(this.selectedLearnerIds);
    this.downloadAllChanged.emit(allSelected);
  }

  toggleOneOf(scenario: MappedPractice): void {
    const {selected, _id} = scenario.user;

    if (selected) {
      this.selectedLearnerIds.push(_id);
    } else {
      this.selectedLearnerIds = this.selectedLearnerIds.filter(id => id !== _id);
    }

    this.selectedLearnerIdsChanged.emit(this.selectedLearnerIds);
    this.downloadAllChanged.emit(false);
    this.allSelected = false;
  }

  resetSelectedLearners(): void {
    this.practices.forEach(practice => (practice.user.selected = false));
    this.allSelected = false;
    this.selectedLearnerIdsChanged.emit([]);
    this.downloadAllChanged.emit(false);
  }
}
