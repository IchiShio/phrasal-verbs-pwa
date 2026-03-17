import { db, getToday } from '../db';
import type { QuizItem, ParticleProgress, Particle } from './types';

export async function getParticleProgress(): Promise<Map<string, ParticleProgress>> {
  const today = getToday();
  const allVerbs = await db.verbs.toArray();
  const allProgress = await db.progress.toArray();

  const progressMap = new Map(allProgress.map(p => [p.verbId, p]));
  const result = new Map<string, ParticleProgress>();

  // Group by particle
  const byParticle = new Map<string, typeof allVerbs>();
  for (const v of allVerbs) {
    const arr = byParticle.get(v.particle) || [];
    arr.push(v);
    byParticle.set(v.particle, arr);
  }

  for (const [particleId, verbs] of byParticle) {
    let learnedVerbs = 0;
    let reviewDue = 0;
    for (const v of verbs) {
      const p = progressMap.get(v.id);
      if (p && p.learned) {
        learnedVerbs++;
        if (p.nextReview <= today) reviewDue++;
      }
    }
    result.set(particleId, {
      particleId,
      totalVerbs: verbs.length,
      learnedVerbs,
      reviewDue,
    });
  }

  return result;
}

export async function getRecommendedParticle(particles: Particle[], progressMap: Map<string, ParticleProgress>): Promise<string> {
  // Priority 1: particles with review due
  const withReview = particles.filter(p => {
    const prog = progressMap.get(p.id);
    return prog && prog.reviewDue > 0;
  });
  if (withReview.length > 0) {
    return withReview[Math.floor(Math.random() * withReview.length)].id;
  }

  // Priority 2: least-learned particle (that still has unlearned verbs)
  let best: string | null = null;
  let bestRatio = 1;
  for (const p of particles) {
    const prog = progressMap.get(p.id);
    if (!prog) { return p.id; } // no progress at all
    const ratio = prog.learnedVerbs / prog.totalVerbs;
    if (ratio < bestRatio) {
      bestRatio = ratio;
      best = p.id;
    }
  }

  return best || particles[0].id;
}

export async function getParticleItems(particleId: string, count = 6): Promise<QuizItem[]> {
  const today = getToday();
  const verbs = await db.verbs.where('particle').equals(particleId).toArray();

  // Review items
  const allProgress = await db.progress.toArray();
  const progressMap = new Map(allProgress.map(p => [p.verbId, p]));

  const reviewItems: QuizItem[] = [];
  const newCandidates: typeof verbs = [];

  for (const v of verbs) {
    const p = progressMap.get(v.id);
    if (p && p.learned && p.nextReview <= today) {
      reviewItems.push({ verb: v, isReview: true });
    } else if (!p || !p.learned) {
      newCandidates.push(v);
    }
  }

  // Shuffle new candidates
  newCandidates.sort(() => Math.random() - 0.5);
  const newItems: QuizItem[] = newCandidates.slice(0, Math.max(count - reviewItems.length, 3))
    .map(v => ({ verb: v, isReview: false }));

  const combined = [...newItems, ...reviewItems].slice(0, count);
  return combined.sort(() => Math.random() - 0.5);
}

// Keep backward compat for "One More Set"
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
  const newItems: QuizItem[] = shuffled.slice(0, newCount).map(v => ({ verb: v, isReview: false }));

  return [...newItems, ...reviewItems].sort(() => Math.random() - 0.5);
}
