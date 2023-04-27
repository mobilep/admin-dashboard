import { Pipe, PipeTransform } from '@angular/core';

// models
import { ScenarioStatistic } from '../../models/scenario';
import { ScenarioFilters } from '../../models/scenarioFilters';

// misc
import { MATCHER } from '../../utils/matcher';

@Pipe({
  name: 'scenariosFilter'
})
export class ScenariosFilterPipe implements PipeTransform {
  transform(scenarios: ScenarioStatistic[], filters: ScenarioFilters): ScenarioStatistic[] {
    if (!scenarios) {
      return [];
    }

    if (!filters) {
      return scenarios;
    }

    return scenarios.filter(this.matchFilter(filters));
  }

  matchFilter = (filters: ScenarioFilters) => (scenario: ScenarioStatistic) => {
    const filtersEntries = Object.entries(filters);

    return filtersEntries.every(([key, value]: [keyof ScenarioFilters, string]) => {
      if (!value) return true;

      return this.matchScenarioField(key, value, scenario);
    });
  };

  matchScenarioField(key: keyof ScenarioFilters, value: string, scenario: ScenarioStatistic): boolean {
    switch (key) {
      case 'scenario':
        return MATCHER.stringMatch(value, scenario.name);
      case 'coach':
        return MATCHER.stringMatch(value, scenario.coach.name);
      case 'learners':
        return MATCHER.numberMatch(value, scenario.userTotal);
      case 'connections':
        return MATCHER.numberMatch(value, scenario.connections);
      case 'waitingOnLearner':
        return MATCHER.numberMatch(value, scenario.waitingOnLearner);
      case 'waitingOnCoach':
        return MATCHER.numberMatch(value, scenario.waitingOnCoach);
      case 'evaluated':
        return MATCHER.numberMatch(value, scenario.userCompleted);
      default:
        return MATCHER.stringMatch(value, scenario[key]);
    }
  }
}
