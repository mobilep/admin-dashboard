import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IS_COACH_OPTIONS } from '../components/people/people-filters/constants';

@Injectable({
  providedIn: 'root'
})
export class FormCreatorService {
  constructor(private fb: FormBuilder) {}

  createScenarioFiltersForm(): FormGroup {
    return this.fb.group({
      scenario: [''],
      coach: [''],
      learners: [''],
      connections: [''],
      waitingOnLearner: [''],
      waitingOnCoach: [''],
      evaluated: [''],
      status: ['']
    });
  }

  createLearnersFiltersForm(): FormGroup {
    return this.fb.group({
      status: '',
      connection: '',
      waitingOn: '',
      learnerEvaluation: '',
      coachEvaluation: ''
    });
  }

  createPeopleFiltersForm(): FormGroup {
    return this.fb.group({
      name: '',
      email: '',
      isInviteSent: '',
      country: '',
      businessUnit: '',
      isCoach: IS_COACH_OPTIONS.ALL,
      region: '',
      globalRegion: '',
    });
  }
}
