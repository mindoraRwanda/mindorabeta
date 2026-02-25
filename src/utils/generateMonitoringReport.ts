import { db } from '../config/database';
import { moodLogs, appointments, exercises, userExercises } from '../database/schema';
import { eq, and, gte, lte, count, sql } from 'drizzle-orm';
import { subDays } from 'date-fns';

export interface MonitoringReport {
  patientId: string;
  period: { start: Date; end: Date };
  moodTrends: {
    averageMood: number;
    moodEntries: number;
    anxietyLevel: number;
  };
  activityMetrics: {
    appointmentsAttended: number;
    exercisesCompleted: number;
    totalEngagement: number;
  };
  riskAssessment: {
    currentRiskLevel: number;
    riskFactors: string[];
    recommendations: string[];
  };
  summary: string;
}

/**
 * Generate comprehensive monitoring report for a patient
 */
export const generateMonitoringReport = async (
  patientId: string,
  days = 30,
): Promise<MonitoringReport> => {
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  // Get mood data
  const moodData = await db
    .select({
      avgMood: sql<number>`AVG(CASE 
        WHEN ${moodLogs.mood} = 'VERY_SAD' THEN 1
        WHEN ${moodLogs.mood} = 'SAD' THEN 2
        WHEN ${moodLogs.mood} = 'NEUTRAL' THEN 3
        WHEN ${moodLogs.mood} = 'HAPPY' THEN 4
        WHEN ${moodLogs.mood} = 'VERY_HAPPY' THEN 5
      END)`,
      avgAnxiety: sql<number>`AVG(CASE 
        WHEN ${moodLogs.anxietyLevel} = 'NONE' THEN 0
        WHEN ${moodLogs.anxietyLevel} = 'MILD' THEN 1
        WHEN ${moodLogs.anxietyLevel} = 'MODERATE' THEN 2
        WHEN ${moodLogs.anxietyLevel} = 'SEVERE' THEN 3
        WHEN ${moodLogs.anxietyLevel} = 'EXTREME' THEN 4
      END)`,
      count: count(),
    })
    .from(moodLogs)
    .where(
      and(
        eq(moodLogs.userId, patientId),
        gte(moodLogs.loggedAt, startDate),
        lte(moodLogs.loggedAt, endDate),
      ),
    );

  // Get appointment data
  const appointmentData = await db
    .select({ count: count() })
    .from(appointments)
    .where(
      and(
        eq(appointments.patientId, patientId),
        eq(appointments.status, 'COMPLETED'),
        gte(appointments.startTime, startDate),
        lte(appointments.startTime, endDate),
      ),
    );

  // Get exercise data
  const exerciseData = await db
    .select({ count: count() })
    .from(userExercises)
    .where(
      and(
        eq(userExercises.userId, patientId),
        gte(userExercises.completedAt, startDate),
        lte(userExercises.completedAt, endDate),
      ),
    );

  const avgMood = moodData[0]?.avgMood || 3;
  const avgAnxiety = moodData[0]?.avgAnxiety || 1;
  const moodEntries = moodData[0]?.count || 0;
  const appointmentsAttended = appointmentData[0]?.count || 0;
  const exercisesCompleted = exerciseData[0]?.count || 0;

  // Calculate risk level
  const riskFactors: string[] = [];
  let riskLevel = 0;

  if (avgMood < 2.5) {
    riskFactors.push('Consistently low mood');
    riskLevel += 1;
  }
  if (avgAnxiety > 2.5) {
    riskFactors.push('High anxiety levels');
    riskLevel += 1;
  }
  if (moodEntries < 7) {
    riskFactors.push('Infrequent mood logging');
    riskLevel += 0.5;
  }
  if (appointmentsAttended === 0 && days >= 30) {
    riskFactors.push('No therapy sessions attended');
    riskLevel += 1;
  }
  if (exercisesCompleted === 0) {
    riskFactors.push('No self-care exercises completed');
    riskLevel += 0.5;
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (avgMood < 3) {
    recommendations.push('Consider increasing therapy session frequency');
  }
  if (avgAnxiety > 2) {
    recommendations.push('Recommend anxiety management exercises');
  }
  if (exercisesCompleted < 5) {
    recommendations.push('Encourage daily mindfulness practice');
  }
  if (moodEntries < 14 && days >= 30) {
    recommendations.push('Promote regular mood tracking');
  }

  // Generate summary
  let summary = `Patient has logged ${moodEntries} mood entries over the past ${days} days. `;
  summary += `Average mood: ${avgMood.toFixed(1)}/5. `;
  summary += `Average anxiety: ${avgAnxiety.toFixed(1)}/4. `;
  summary += `Attended ${appointmentsAttended} therapy sessions and completed ${exercisesCompleted} exercises.`;

  return {
    patientId,
    period: { start: startDate, end: endDate },
    moodTrends: {
      averageMood: Number(avgMood.toFixed(2)),
      moodEntries,
      anxietyLevel: Number(avgAnxiety.toFixed(2)),
    },
    activityMetrics: {
      appointmentsAttended,
      exercisesCompleted,
      totalEngagement: moodEntries + appointmentsAttended + exercisesCompleted,
    },
    riskAssessment: {
      currentRiskLevel: Math.min(Math.round(riskLevel), 3),
      riskFactors,
      recommendations,
    },
    summary,
  };
};
