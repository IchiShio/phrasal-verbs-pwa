import Dexie, { type Table } from 'dexie';
import type { Verb, Progress, Stats, Particle } from '../lib/types';

class PhrasalVerbsDB extends Dexie {
  verbs!: Table<Verb>;
  progress!: Table<Progress>;
  stats!: Table<Stats>;
  particles!: Table<Particle>;

  constructor() {
    super('phrasal-verbs-db');
    this.version(1).stores({
      verbs: 'id',
      progress: 'verbId, nextReview',
      stats: 'key'
    });
    this.version(2).stores({
      verbs: 'id, particle, sense',
      progress: 'verbId, nextReview',
      stats: 'key',
      particles: 'id'
    });
  }
}

export const db = new PhrasalVerbsDB();

export async function seedVerbs() {
  // Always re-seed to pick up new fields
  const existing = await db.verbs.toArray();
  const needsUpdate = existing.length === 0 || !existing[0].particle;
  if (!needsUpdate) return;

  const res = await fetch('/data/verbs.json');
  const verbs: Verb[] = await res.json();
  await db.verbs.clear();
  await db.verbs.bulkAdd(verbs);
}

export async function seedParticles() {
  const count = await db.particles.count();
  if (count > 0) return;
  const res = await fetch('/data/particles.json');
  const particles: Particle[] = await res.json();
  await db.particles.bulkAdd(particles);
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
