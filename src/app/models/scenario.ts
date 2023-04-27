import { Coach } from './coach';

export interface ScenarioStatistic {
  _id: string;
  name: string;
  status: string;
  coach: Coach;
  userCompleted: number;
  userTotal: number;
  createdAt: Date;
  waitingOnLearner: number;
  waitingOnCoach: number;
  connections: number;
}
