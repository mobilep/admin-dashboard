import { Pipe, PipeTransform } from '@angular/core';

// models
import { LearnersFilters } from '../../models/learners-filters';
import { MappedPractice } from '../../models/scenarioPracticesData';

// mics
import { MATCHER } from '../../utils/matcher';

@Pipe({
  name: 'learnersFilter'
})
export class LearnersFilterPipe implements PipeTransform {
  transform(learners: MappedPractice[], filters: LearnersFilters): MappedPractice[] {
    if (!filters) {
      return learners;
    }

    return learners.filter(this.matchLearner(filters));
  }

  matchLearner = (filters: LearnersFilters) => (learner: MappedPractice) => {
    const filtersEntries = Object.entries(filters);

    return filtersEntries.every(([key, value]: [keyof LearnersFilters, string]) => {
      if (!value) return true;

      return this.matchLearnerField(key, value, learner);
    });
  };

  matchLearnerField(key: keyof LearnersFilters, value: string, learner: MappedPractice): boolean {
    switch (key) {
      case 'connection':
        return value === 'yes' ? learner.connection : !learner.connection;
      case 'learnerEvaluation':
        return MATCHER.numberMatch(value, learner.userAvgMark);
      case 'coachEvaluation':
        return MATCHER.numberMatch(value, learner.coachAvgMark);
      default:
        return MATCHER.stringMatch(value, learner[key]);
    }
  }
}
