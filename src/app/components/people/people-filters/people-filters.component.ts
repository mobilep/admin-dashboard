import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

// services
import { FormCreatorService } from '../../../services/form-creator.service';

// services
import { PeopleFilters } from '../../../models/people-filters';

// mics
import { MATH_FIELD_TIP } from '../../../constants/math-field-tip';
import { takeWhileAlive, AutoUnsubscribe } from '../../../decorators/auto-unsubscribe';
import { IS_COACH_OPTIONS } from './constants';


@Component({
  selector: 'mpw-people-filters',
  templateUrl: './people-filters.component.html',
  styleUrls: ['./people-filters.component.sass']
})
@AutoUnsubscribe()
export class PeopleFiltersComponent implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<PeopleFilters>();

  filtersForm: FormGroup;
  INVITED_OPTIONS = ['yes', 'no'];
  IS_COACH_OPTIONS = IS_COACH_OPTIONS;
  mathFieldTip = MATH_FIELD_TIP;

  constructor(private formCreator: FormCreatorService) {}

  ngOnInit(): void {
    this.filtersForm = this.formCreator.createPeopleFiltersForm();
    this.filtersForm.valueChanges
      .pipe(
        takeWhileAlive(this),
        debounceTime(400)
      )
      .subscribe(this.onFiltersChange);
  }

  ngOnDestroy() {}

  onFiltersChange = (value: PeopleFilters): void => {
    this.filtersChange.emit(value);
  };
}
