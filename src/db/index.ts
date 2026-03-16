import Dexie, { type Table } from 'dexie';
import type { Verb, Progress, Stats } from '../lib/types';

class PhrasalVerbsDB extends Dexie {
  verbs!: Table<Verb>;
  progress!: Table<Progress>;
  stats!: Table<Stats>;

  constructor() {
    super('phrasal-verbs-db');
    this.version(1).stores({
      verbs: 'id',
      progress: 'verbId, nextReview',
      stats: 'key'
    });
  }
}

export const db = new PhrasalVerbsDB();

export async function seedVerbs() {
  const count = await db.verbs.count();
  if (count > 0) return;
  const res = await fetch('/data/verbs.json');
  const verbs: Verb[] = await res.json();
  await db.verbs.bulkAdd(verbs);
}

export function getToday(): string {
  return new Date().toLocaleDateString('sv-SE');
}

export async function getStat(key: string): Promise<number | string | undefined> {
  const row = await db.stats.get(key);
  return row?.value;
}

export async function setStat(key: string, value: number | string) {
  await db.stats.put({ key, value });
}
