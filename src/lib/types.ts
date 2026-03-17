export interface Verb {
  id: string;
  verb: string;
  meaning_ja: string;
  example: string;
  example_ja: string;
  choices: string[];
  particle: string;
  sense: string;
  scene: string;
  scene_ja: string;
  particle_explain: string;
}

export interface ParticleSense {
  id: string;
  label: string;
  label_en: string;
  description: string;
  visual: string;
}

export interface Particle {
  id: string;
  core_meaning: string;
  core_meaning_ja: string;
  senses: ParticleSense[];
}

export interface ParticleProgress {
  particleId: string;
  totalVerbs: number;
  learnedVerbs: number;
  reviewDue: number;
}

export interface Progress {
  verbId: string;
  reps: number;
  interval: number;
  ef: number;
  nextReview: string;
  lastQuality: number;
  learned: boolean;
}

export interface Stats {
  key: string;
  value: number | string;
}

export type AppPhase = 'loading' | 'particle-map' | 'particle-intro' | 'question' | 'answered' | 'complete';

export interface QuizItem {
  verb: Verb;
  isReview: boolean;
}

interface LevelDef {
  name: string;
  threshold: number;
}

export const LEVEL_DEFS: LevelDef[] = [
  { name: 'Beginner', threshold: 0 },
  { name: 'Learner', threshold: 30 },
  { name: 'Explorer', threshold: 100 },
  { name: 'Achiever', threshold: 250 },
  { name: 'Master', threshold: 500 },
  { name: 'Phrasal Pro', threshold: 1000 },
  { name: 'Legend', threshold: 2000 },
];

export function getLevelInfo(xp: number) {
  let level = LEVEL_DEFS[0];
  let nextLevel: LevelDef | null = LEVEL_DEFS[1];
  for (let i = LEVEL_DEFS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_DEFS[i].threshold) {
      level = LEVEL_DEFS[i];
      nextLevel = LEVEL_DEFS[i + 1] || null;
      break;
    }
  }
  const progress = nextLevel
    ? (xp - level.threshold) / (nextLevel.threshold - level.threshold)
    : 1;
  return { level, nextLevel, progress: Math.min(1, progress), levelIndex: LEVEL_DEFS.indexOf(level) };
}
