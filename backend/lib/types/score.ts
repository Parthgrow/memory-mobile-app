export interface DailyScore {
  date: string; // YYYY-MM-DD
  highestScore: number;
  updatedAt: number; // timestamp
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  practiceDays: number;
  bestScore: number;
  averageScore: number;
  dailyScores: DailyScore[];
}
