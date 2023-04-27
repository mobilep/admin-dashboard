import { Component } from '@angular/core';

// models
import { DataTableColumn } from '../../models/data-table-column';

// misc
import { ScenarioLearnersBase } from './scenario-leanners-base.component';

@Component({
  selector: 'mpw-scenario-learners',
  templateUrl: './scenario-learners.component.html',
  styleUrls: ['./scenario-learners.component.sass']
})
export class ScenarioLearnersComponent extends ScenarioLearnersBase {
  columns: DataTableColumn[] = [
    { text: 'scenarioDetails.learner', id: 'name', sortable: true },
    { text: 'common.status' },
    { text: 'scenarioDetails.connection' },
    { text: 'scenarioDetails.waitingOn' },
    { text: 'scenarioDetails.learnerEvaluation', id: 'learnerEvaluation', sortable: true },
    { text: 'scenarioDetails.coachEvaluation', id: 'coachEvaluation', sortable: true }
  ];
}
