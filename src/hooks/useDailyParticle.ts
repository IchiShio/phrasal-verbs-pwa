import { useState, useEffect, useCallback } from 'react';
import { seedVerbs, seedParticles, db } from '../db';
import { getParticleProgress, getRecommendedParticle, getParticleItems } from '../lib/daily';
import { updateStreak } from '../lib/streak';
import { getStat } from '../db';
import type { Particle, ParticleProgress, QuizItem } from '../lib/types';

export function useDailyParticle() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [progressMap, setProgressMap] = useState<Map<string, ParticleProgress>>(new Map());
  const [recommendedId, setRecommendedId] = useState<string>('');
  const [selectedParticle, setSelectedParticle] = useState<Particle | null>(null);
  const [items, setItems] = useState<QuizItem[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await seedVerbs();
      await seedParticles();
      const streakInfo = await updateStreak();
      setStreak(streakInfo.streak);
      const xp = ((await getStat('totalXP')) as number) || 0;
      setTotalXP(xp);

      const allParticles = await db.particles.toArray();
      setParticles(allParticles);

      const progress = await getParticleProgress();
      setProgressMap(progress);

      const recommended = await getRecommendedParticle(allParticles, progress);
      setRecommendedId(recommended);

      setLoading(false);
    })();
  }, []);

  const selectParticle = useCallback(async (id: string) => {
    const particle = particles.find(p => p.id === id) || null;
    setSelectedParticle(particle);
    if (particle) {
      const quizItems = await getParticleItems(id, 6);
      setItems(quizItems);
    }
  }, [particles]);

  const refreshProgress = useCallback(async () => {
    const progress = await getParticleProgress();
    setProgressMap(progress);
  }, []);

  return {
    particles,
    progressMap,
    recommendedId,
    selectedParticle,
    items,
    streak,
    totalXP,
    loading,
    setTotalXP,
    selectParticle,
    refreshProgress,
  };
}
