export type DifficultyTier = 1 | 2 | 3 | 4 | 5;

export interface TestCase {
  input: any[];
  expected: any;
  isHidden?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  tier: DifficultyTier;
  xpValue: number;
  initialCode: { [key: string]: string }; // Map language to starter code
  testCases: TestCase[];
  solution?: string; // Optional for reference
}

export interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
  bestTime?: number; // in seconds
  score?: number; // XP earned
  lastCode?: { [key: string]: string };
}

export interface UserProgress {
  xp: number;
  rank: string;
  completedIds: string[];
  history: ExerciseProgress[];
  unlockedTiers: DifficultyTier[];
  streak: number;
  lastActive: string; // ISO date
}

export const RANKS = [
  { xp: 0, name: 'Novice' },
  { xp: 500, name: 'Apprentice' },
  { xp: 1500, name: 'Warrior' },
  { xp: 4000, name: 'Master' },
  { xp: 10000, name: 'Grandmaster' },
  { xp: 25000, name: 'Logic Devourer' }
];
