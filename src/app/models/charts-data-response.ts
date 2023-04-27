export interface ChartsDataResponse {
  scenarioResponsiveness: ChartData;
  scenarioLength: ChartData;
}

export interface ChartData {
  ranges: DataRange[];
  count: number;
}

export interface DataRange {
  from?: number;
  to?: number;
  count: number;
}
