import type { Progress } from './types';
import { getToday } from '../db';

export function updateSRS(progress: Progress, quality: number): Progress {
  let { reps, interval, ef } = progress;

  if (quality >= 3) {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 6;
    else interval = Math.round(interval * ef);
    reps++;
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < 1.3) ef = 1.3;
  } else {
    reps = 0;
    interval = 1;
  }

  const today = new Date(getToday());
  today.setDate(today.getDate() + interval);
  const nextReview = today.toLocaleDateString('sv-SE');

  return {
    ...progress,
    reps,
    interval,
    ef,
    nextReview,
    lastQuality: quality,
    learned: true,
  };
}

export function createInitialProgress(verbId: string): Progress {
  return {
    verbId,
    reps: 0,
    interval: 0,
    ef: 2.5,
    nextReview: getToday(),
    lastQuality: 0,
    learned: false,
  };
}
