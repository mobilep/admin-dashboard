import { GlobalMetrics } from '../models/globalMetrics';
import { MATH_UTILS } from '../utils/math-helpers';

export const mapMetricsAPI = (metrics: GlobalMetrics): GlobalMetrics => {
  return {
    ...metrics,
    avgScore: {
      allPeriod: MATH_UTILS.round(metrics.avgScore.allPeriod),
      thisWeek: MATH_UTILS.round(metrics.avgScore.thisWeek),
      previousWeek: MATH_UTILS.round(metrics.avgScore.previousWeek),
      thisMonth: MATH_UTILS.round(metrics.avgScore.thisMonth),
      previousMonth: MATH_UTILS.round(metrics.avgScore.previousMonth)
    }
  };
};
