import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

// services
import { FormCreatorService } from '../../services/form-creator.service';

// models
import { LearnersFilters } from '../../models/learners-filters';

// misc
import { takeWhileAlive, AutoUnsubscribe } from '../../decorators/auto-unsubscribe';
import { MATH_FIELD_TIP } from '../../constants/math-field-tip';

@Component({
  selector: 'mpw-learners-filters',
  templateUrl: './learners-filters.component.html',
  styleUrls: ['./learners-filters.component.sass']
})
@AutoUnsubscribe()
export class LearnersFiltersComponent implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<LearnersFilters>();

  filtersForm: FormGroup;
  STATUS_OPTIONS = ['new', 'in_progress', 'complete'];
  CONNECTION_OPTIONS = ['yes', 'no'];
  WAITING_ON_OPTIONS = ['noOne', 'coach', 'learner'];
  mathFieldTip = MATH_FIELD_TIP;

  constructor(private formCreator: FormCreatorService) {}

  ngOnInit(): void {
    this.filtersForm = this.formCreator.createLearnersFiltersForm();
    this.filtersForm.valueChanges
      .pipe(
        takeWhileAlive(this),
        debounceTime(400)
      )
      .subscribe(this.onFiltersChange);
  }

  ngOnDestroy() {}

  onFiltersChange = (value: LearnersFilters): void => {
    this.filtersChange.emit(value);
  };
}
