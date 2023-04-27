import { ScenarioPracticesData, Mark, MappedScenarioPracticesData } from '../models/scenarioPracticesData';
import { MATH_UTILS } from '../utils/math-helpers';
import { ScenarioServerStatus, ScenarioStatus } from '../models/scenario-status.enum';

const getStatusKey = (status: ScenarioServerStatus): ScenarioStatus => {
  switch (status) {
    case ScenarioServerStatus.new:
      return ScenarioStatus.new;
    case ScenarioServerStatus.inProgress:
      return ScenarioStatus.inProgress;
    default:
      return ScenarioStatus.complete;
  }
};

const getWaitingOnKey = (waitingOn: string): string => {
  switch (waitingOn) {
    case 'No-one':
      return 'noOne';
    case 'Coach':
      return 'coach';
    default:
      return 'learner';
  }
};

const getAvgMark = (marks: Mark[]): number => {
  if (marks.length === 0) {
    return 0;
  }

  const marksSum = marks.reduce((acc, { mark }) => acc + mark, 0);
  const avg = marksSum / marks.length;

  return MATH_UTILS.round(avg);
};

export const mapPracticesData = (practicesData: ScenarioPracticesData): MappedScenarioPracticesData => {
  return {
    ...practicesData,
    list: practicesData.list.map(practice => ({
      ...practice,
      userAvgMark: getAvgMark(practice.userMark),
      coachAvgMark: getAvgMark(practice.coachMark),
      status: getStatusKey(practice.status),
      waitingOn: getWaitingOnKey(practice.waitingOn)
    }))
  };
};
