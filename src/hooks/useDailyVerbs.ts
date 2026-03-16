import { useState, useEffect, useCallback } from 'react';
import { seedVerbs, db } from '../db';
import { getDailyItems } from '../lib/daily';
import { updateStreak } from '../lib/streak';
import { getStat } from '../db';
import type { QuizItem } from '../lib/types';

export function useDailyVerbs() {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalLearned, setTotalLearned] = useState(0);
  const [totalVerbs, setTotalVerbs] = useState(0);

  useEffect(() => {
    (async () => {
      await seedVerbs();
      const streakInfo = await updateStreak();
      setStreak(streakInfo.streak);
      const xp = ((await getStat('totalXP')) as number) || 0;
      setTotalXP(xp);
      const dailyItems = await getDailyItems(6);
      setItems(dailyItems);

      const learned = await db.progress.count();
      const total = await db.verbs.count();
      setTotalLearned(learned);
      setTotalVerbs(total);

      setLoading(false);
    })();
  }, []);

  const loadMoreItems = useCallback(async () => {
    const moreItems = await getDailyItems(6);
    if (moreItems.length > 0) {
      setItems(moreItems);
      return true;
    }
    return false;
  }, []);

  return { items, streak, totalXP, loading, setTotalXP, setStreak, totalLearned, totalVerbs, loadMoreItems };
}
