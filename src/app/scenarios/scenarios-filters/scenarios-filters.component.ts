import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

// rxjs
import { Observable } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';

// services
import { FormCreatorService } from '../../services/form-creator.service';

// models
import { ScenarioFilters } from '../../models/scenarioFilters';
import { Coach } from '../../models/coach';
import { ScenarioStatistic } from '../../models/scenario';

// misc
import { MATCHER } from '../../utils/matcher';
import { AutoUnsubscribe, takeWhileAlive } from '../../decorators/auto-unsubscribe';
import { MATH_FIELD_TIP } from '../../constants/math-field-tip';

@Component({
  selector: 'mpw-scenarios-filters',
  templateUrl: './scenarios-filters.component.html',
  styleUrls: ['./scenarios-filters.component.sass']
})
@AutoUnsubscribe()
export class ScenariosFiltersComponent implements OnInit, OnDestroy {
  @Input() scenarios: ScenarioStatistic[] = [];
  @Input() coaches: Coach[] = [];
  @Output() filtersChange = new EventEmitter<ScenarioFilters>();

  filtersForm: FormGroup;
  STATUS_OPTIONS = ['active', 'closed'];
  scenarioAutoCompleteItems$: Observable<ScenarioStatistic[]>;
  mathFieldTip = MATH_FIELD_TIP;

  constructor(private formCreator: FormCreatorService) {}

  ngOnInit(): void {
    this.createForm();
    this.setScenarioAutocompleteOptions();
  }

  ngOnDestroy() {}

  createForm(): void {
    this.filtersForm = this.formCreator.createScenarioFiltersForm();
    this.filtersForm.valueChanges
      .pipe(
        takeWhileAlive(this),
        debounceTime(400)
      )
      .subscribe(this.onFiltersChange);
  }

  setScenarioAutocompleteOptions(): void {
    this.scenarioAutoCompleteItems$ = this.filtersForm.get('scenario').valueChanges.pipe(
      startWith(''),
      map(searchTerm => this.scenarios.filter(scenario => MATCHER.stringMatch(searchTerm, scenario.name)))
    );
  }

  onFiltersChange = (value: ScenarioFilters): void => {
    this.filtersChange.emit(value);
  };
}
