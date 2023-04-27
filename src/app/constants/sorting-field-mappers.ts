import { User } from '../models/user';
import { SortingFieldMapper } from '../models/sorting-field-mapper';
import { ScenarioStatistic } from '../models/scenario';
import { MappedPractice } from '../models/scenarioPracticesData';

export const PEOPLE_SORTING_FIELD_MAPPER: SortingFieldMapper<User> = {
  name: item => getStringValue(item.name),
  email: item => getStringValue(item.email),
  createdAt: item => +new Date(item.createdAt)
};

export const SCENARIOS_SORTING_FIELD_MAPPER: SortingFieldMapper<ScenarioStatistic> = {
  name: item => getStringValue(item.name),
  coachName: item => getStringValue(item.coach.name),
  learners: item => item.userTotal,
  connections: item => item.connections,
  waitingOnLearner: item => item.waitingOnLearner,
  waitingOnCoach: item => item.waitingOnCoach,
  evaluated: item => item.userCompleted,
  createdAt: item => +new Date(item.createdAt)
};

export const LEARNERS_SORTING_FIELD_MAPPER: SortingFieldMapper<MappedPractice> = {
  name: item => getStringValue(item.user.name),
  learnerEvaluation: item => item.userAvgMark,
  coachEvaluation: item => item.coachAvgMark
};


export const TEMPLATE_SORTING_FIELD_MAPPER: SortingFieldMapper<User> = {
  name: item => getStringValue(item.name),
  email: item => getStringValue(item.email),
  createdAt: item => +new Date(item.createdAt)
};

function getStringValue(str: string): string {
  return str.toLowerCase();
}
