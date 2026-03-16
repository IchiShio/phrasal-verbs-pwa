import { getStat, setStat, getToday } from '../db';

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('sv-SE');
}

export async function updateStreak(): Promise<{ streak: number; longestStreak: number }> {
  const today = getToday();
  const lastVisit = (await getStat('lastVisit')) as string | undefined;
  let streak = ((await getStat('streak')) as number) || 0;
  let longestStreak = ((await getStat('longestStreak')) as number) || 0;

  if (lastVisit === today) {
    return { streak, longestStreak };
  }

  const yesterday = addDays(today, -1);
  if (lastVisit === yesterday) {
    streak++;
  } else {
    streak = 1;
  }

  if (streak > longestStreak) {
    longestStreak = streak;
    await setStat('longestStreak', longestStreak);
  }

  await setStat('streak', streak);
  await setStat('lastVisit', today);

  return { streak, longestStreak };
}
