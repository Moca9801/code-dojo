import { Injectable, signal, computed } from '@angular/core';
import { UserProgress, ExerciseProgress, RANKS, DifficultyTier } from './models';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly STORAGE_KEY = 'code_dojo_progress';
  
  // Signals for reactive UI
  userProgress = signal<UserProgress>(this.loadFromStorage());
  
  // Computed signals
  totalXp = computed(() => this.userProgress().xp);
  currentRank = computed(() => {
    const xp = this.totalXp();
    return RANKS.reverse().find(r => xp >= r.xp)?.name || 'Novice';
  });
  
  completedCount = computed(() => this.userProgress().completedIds.length);
  
  constructor() {
    // Save to storage whenever userProgress changes
    // (In a real app, we might use an effect, but here we'll call save explicitly for clarity)
  }

  private loadFromStorage(): UserProgress {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error parsing progress data', e);
      }
    }
    
    // Default initial progress
    return {
      xp: 0,
      rank: 'Novice',
      completedIds: [],
      history: [],
      unlockedTiers: [1], // Tier 1 is always unlocked
      streak: 0,
      lastActive: new Date().toISOString()
    };
  }

  private saveToStorage(progress: UserProgress) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    this.userProgress.set({ ...progress });
  }

  completeExercise(exerciseId: string, xp: number, tier: DifficultyTier, timeInSec: number, code: { [key: string]: string }) {
    const current = this.userProgress();
    
    // Skip if already completed (maybe only update best time/score?)
    if (current.completedIds.includes(exerciseId)) {
        // Just update history with possibly better score
        const historyIdx = current.history.findIndex(h => h.exerciseId === exerciseId);
        if (historyIdx !== -1) {
            const h = current.history[historyIdx];
            if (timeInSec < (h.bestTime || Infinity)) {
                h.bestTime = timeInSec;
                h.lastCode = code;
            }
        }
        this.saveToStorage(current);
        return;
    }

    const newHistory: ExerciseProgress = {
      exerciseId,
      completed: true,
      bestTime: timeInSec,
      score: xp,
      lastCode: code
    };

    const updated: UserProgress = {
      ...current,
      xp: current.xp + xp,
      completedIds: [...current.completedIds, exerciseId],
      history: [...current.history, newHistory],
      lastActive: new Date().toISOString()
    };

    // Check tier unlock logic (70% threshold)
    // This will be called globally or after exercise completion
    this.saveToStorage(updated);
    this.checkTierUnlocks(updated);
  }

  checkTierUnlocks(progress: UserProgress) {
    // We'll use a simple approach: if you have completed 70% of exercises in Tier X, Tier X+1 unlocks.
    // To avoid circular dependency, we'll just define the logic and expect the caller to trigger it with knowledge of counts
    // OR we can just check against a hardcoded map of counts for now, or just unlock based on absolute numbers.
    const currentTiers = [...progress.unlockedTiers];
    let changed = false;

    // Mapping of Tier -> Required completions to unlock next (simplified for demo)
    // In a real app, this would be computed from ExerciseService
    [1, 2, 3, 4].forEach(tier => {
        if (currentTiers.includes(tier as DifficultyTier) && !currentTiers.includes((tier + 1) as DifficultyTier)) {
            // Count how many from this tier are completed
            // For now, let's say 2 exercises in Tier 1 unlocks Tier 2
            const completedInTier = progress.history.filter(h => h.completed).length; // Simplified
            if (completedInTier >= tier * 2) { 
                currentTiers.push((tier + 1) as DifficultyTier);
                changed = true;
            }
        }
    });

    if (changed) {
        this.saveToStorage({ ...progress, unlockedTiers: currentTiers });
    }
  }
}
