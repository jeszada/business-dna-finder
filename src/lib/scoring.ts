
import { BusinessType, Category, Question } from "@/data/business";

export type AnswerMap = Record<string, number>; // questionId -> 1..5

export interface ScoreResult {
  businessScores: Record<BusinessType, number>; // 0..100
  categoryAverages: Record<Category, number>; // 0..100
}

export const BUSINESS_MAX_SCORE = 5; // Likert 1..5

export function computeScores(questions: Question[], answers: AnswerMap): ScoreResult {
  // Accumulate weighted scores and max possible per business
  const businessTotals = new Map<BusinessType, { sum: number; max: number }>();

  const categories: Category[] = ["skills", "preferences", "readiness", "motivation"];
  const categoryTotals: Record<Category, { sum: number; count: number }> = {
    skills: { sum: 0, count: 0 },
    preferences: { sum: 0, count: 0 },
    readiness: { sum: 0, count: 0 },
    motivation: { sum: 0, count: 0 },
  };

  for (const q of questions) {
    const score = answers[q.id];
    if (!score) continue;

    // Category aggregate
    categoryTotals[q.category].sum += score;
    categoryTotals[q.category].count += 1;

    // Business weights
    Object.entries(q.weights).forEach(([b, w]) => {
      const key = b as BusinessType;
      const prev = businessTotals.get(key) || { sum: 0, max: 0 };
      const weight = typeof w === "number" ? w : 0;
      businessTotals.set(key, {
        sum: prev.sum + score * weight,
        max: prev.max + BUSINESS_MAX_SCORE * weight,
      });
    });
  }

  // Normalize 0..100
  const businessScores = {} as Record<BusinessType, number>;
  businessTotals.forEach((v, k) => {
    businessScores[k] = v.max > 0 ? Math.round((v.sum / v.max) * 100) : 0;
  });

  const categoryAverages = {} as Record<Category, number>;
  categories.forEach((c) => {
    const { sum, count } = categoryTotals[c];
    categoryAverages[c] = count > 0 ? Math.round((sum / (count * BUSINESS_MAX_SCORE)) * 100) : 0;
  });

  return { businessScores, categoryAverages };
}

export function topNBusinesses(scores: Record<BusinessType, number>, n = 3) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n) as [BusinessType, number][];
}
