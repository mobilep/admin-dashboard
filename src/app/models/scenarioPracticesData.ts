import { ScenarioServerStatus, ScenarioStatus } from './scenario-status.enum';

export interface ScenarioPracticesData {
  summary: ScenarioMetrics;
  list: Practice[];
}

export interface MappedScenarioPracticesData {
  summary: ScenarioMetrics;
  list: MappedPractice[];
}

export interface Practice {
  _id: string;
  inboxId: string;
  user: Learner;
  status: ScenarioServerStatus;
  waitingOn: string;
  connection: boolean;
  userMark: Mark[];
  coachMark: Mark[];
  hasUserMessage: boolean;
}

export interface MappedPractice {
  _id: string;
  inboxId: string;
  user: Learner;
  status: ScenarioStatus;
  waitingOn: string;
  connection: boolean;
  userMark: Mark[];
  coachMark: Mark[];
  hasUserMessage: boolean;
  userAvgMark: number;
  coachAvgMark: number;
}

export interface Mark {
  mark: number;
  criteria: string;
}

interface Learner {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  avatarSm?: string;
  avatarMd?: string;
  avatarBg?: string;
  avatarColor: string;
  selected?: boolean;
}

export interface ScenarioMetrics {
  learners: number;
  connections: number;
  waitingOnLearner: number;
  waitingOnCoach: number;
  evaluated: number;
}
