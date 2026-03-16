import { useState, useEffect } from 'react';
import { seedVerbs } from '../db';
import { getDailyItems } from '../lib/daily';
import { updateStreak } from '../lib/streak';
import { getStat } from '../db';
import type { QuizItem } from '../lib/types';

export function useDailyVerbs() {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await seedVerbs();
      const streakInfo = await updateStreak();
      setStreak(streakInfo.streak);
      const xp = ((await getStat('totalXP')) as number) || 0;
      setTotalXP(xp);
      const dailyItems = await getDailyItems(6);
      setItems(dailyItems);
      setLoading(false);
    })();
  }, []);

  return { items, streak, totalXP, loading, setTotalXP, setStreak };
}
