import { Pipe, PipeTransform } from '@angular/core';

// models
import { User } from '../../../models/user';
import { PeopleFilters } from '../../../models/people-filters';

// misc
import { MATCHER } from '../../../utils/matcher';
import { COUNTRIES_DICT } from 'services/countries.service';
import { IS_COACH_OPTIONS } from '../people-filters/constants';

@Pipe({
  name: 'peopleFilter'
})
export class PeopleFilterPipe implements PipeTransform {
  transform(people: User[], filters: PeopleFilters): User[] {
    if (!people) {
      return [];
    }

    if (!filters) {
      return people;
    }

    return people.filter(this.matchFilter(filters));
  }

  matchFilter = (filters: PeopleFilters) => (user: User) => {
    const filtersEntries = Object.entries(filters);

    return filtersEntries.every(([key, value]: [keyof PeopleFilters, string]) => {
      if (!value) return true;

      return this.matchScenarioField(key, value, user);
    });
  };

  matchScenarioField(key: keyof PeopleFilters, value: string, user: User): boolean {
    switch (key) {
      case 'country':
        return MATCHER.multipleMatch(COUNTRIES_DICT[user.country], value);
      case 'businessUnit':
        return MATCHER.multipleMatch(user.extraInformation.find(extra => extra.title === 'Business Unit').description, value);
      case 'region':
        return MATCHER.multipleMatch(user.extraInformation.find(extra => extra.title === 'Region').description, value);
      case 'globalRegion':
        return MATCHER.multipleMatch(user.extraInformation.find(extra => extra.title === 'Global Region').description, value);
      case 'isCoach':
        return value === IS_COACH_OPTIONS.ALL || (value === IS_COACH_OPTIONS.NO && !user.isCoach) || (value === IS_COACH_OPTIONS.YES && user.isCoach);
      case 'isInviteSent':
        return value === 'yes' ? user.isInviteSent : !user.isInviteSent;
      default:
        return MATCHER.stringMatch(value, user[key]);
    }
  }
}
