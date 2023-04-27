export interface GlobalMetrics {
  coaches: number;
  learners: number;
  evaluations: number;
  avgScore: AvgScore;
  criterias: number;
  scenariosInProgress: number;
  scenariosClosed: number;
  messages: number;
}


interface AvgScore {
  allPeriod: number,
  thisWeek: number,
  previousWeek: number,
  thisMonth: number,
  previousMonth: number,
}