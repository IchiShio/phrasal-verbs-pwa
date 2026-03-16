import { db, getToday } from '../db';
import type { QuizItem } from './types';

export async function getDailyItems(newCount = 6): Promise<QuizItem[]> {
  const today = getToday();

  const reviewProgress = await db.progress
    .where('nextReview')
    .belowOrEqual(today)
    .toArray();

  const reviewVerbIds = new Set(reviewProgress.map(p => p.verbId));
  const reviewVerbs = await db.verbs.where('id').anyOf([...reviewVerbIds]).toArray();
  const reviewItems: QuizItem[] = reviewVerbs.map(v => ({ verb: v, isReview: true }));

  const allProgress = await db.progress.toArray();
  const learnedIds = new Set(allProgress.map(p => p.verbId));

  const allVerbs = await db.verbs.toArray();
  const candidates = allVerbs.filter(v => !learnedIds.has(v.id));

  const shuffled = candidates.sort(() => Math.random() - 0.5);
  const newVerbs = shuffled.slice(0, newCount);
  const newItems: QuizItem[] = newVerbs.map(v => ({ verb: v, isReview: false }));

  const combined = [...newItems, ...reviewItems];
  return combined.sort(() => Math.random() - 0.5);
}
