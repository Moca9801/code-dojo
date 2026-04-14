import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExerciseService } from '../exercise.service';
import { ProgressService } from '../progress.service';
import { DifficultyTier } from '../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="header">
      <div class="logo">Code Dojo</div>
      <div class="user-stats">
        <span class="badge" [style.background]="'var(--accent-primary)'">XP: {{ progressService.totalXp() }}</span>
        <span class="badge" [style.background]="'var(--accent-secondary)'">{{ progressService.currentRank() }}</span>
      </div>
    </div>

    <div class="container animate-slide-up" style="margin-top: 2rem; padding-bottom: 4rem;">
      <div class="hero">
        <h1>Devour Code Challenges</h1>
        <p>Master technical interviews by solving increasingly difficult logic exercises.</p>
      </div>

      <div class="tiers-grid">
        @for (tier of tiers; track tier) {
          <div class="tier-section" [class.locked]="!isTierUnlocked(tier)">
            <div class="tier-header">
              <h2>Tier {{ tier }} — {{ getTierName(tier) }}</h2>
              <div class="tier-progress">
                <span>{{ getTierProgress(tier) }}% Complete</span>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" [style.width.%]="getTierProgress(tier)"></div>
                </div>
              </div>
            </div>

            <div class="exercises-list">
              @for (ex of exerciseService.getExercisesByTier(tier); track ex.id) {
                <a [routerLink]="isTierUnlocked(tier) ? ['/exercise', ex.id] : null" 
                   class="exercise-card" 
                   [class.completed]="isCompleted(ex.id)"
                   [class.locked]="!isTierUnlocked(tier)">
                  <div class="ex-info">
                    <span class="ex-title">{{ ex.title }}</span>
                    <span class="ex-xp">+{{ ex.xpValue }} XP</span>
                  </div>
                  @if (isCompleted(ex.id)) {
                    <span class="check-icon">✓</span>
                  } @else if (!isTierUnlocked(tier)) {
                    <span class="lock-icon">🔒</span>
                  }
                </a>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .hero {
      text-align: center;
      margin-bottom: 3rem;
    }
    .hero h1 {
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }
    .hero p {
        color: var(--text-secondary);
        font-size: 1.2rem;
    }
    .tiers-grid {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
    .tier-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      border-left: 4px solid var(--accent-primary);
      padding-left: 1rem;
    }
    .tier-header h2 {
      margin: 0;
      font-size: 1.5rem;
    }
    .tier-progress {
      text-align: right;
      width: 200px;
    }
    .tier-progress span {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .progress-bar-bg {
      height: 6px;
      background: var(--surface-color);
      border-radius: 3px;
      margin-top: 4px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--accent-primary);
      box-shadow: var(--neon-glow);
      transition: width 0.5s ease-out;
    }
    .exercises-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .exercise-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      padding: 1rem;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s ease;
    }
    .exercise-card:hover:not(.locked) {
      transform: translateY(-4px);
      border-color: var(--accent-primary);
      background: var(--surface-header);
    }
    .exercise-card.completed {
      border-color: var(--success);
      background: rgba(16, 185, 129, 0.05);
    }
    .exercise-card.locked {
      opacity: 0.5;
      cursor: not-allowed;
      filter: grayscale(1);
    }
    .ex-info {
        display: flex;
        flex-direction: column;
    }
    .ex-title {
        font-weight: 600;
        font-size: 1rem;
    }
    .ex-xp {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    .check-icon { color: var(--success); font-weight: bold; }
    .lock-icon { font-size: 1rem; }
    .tier-section.locked {
        opacity: 0.6;
    }
  `]
})
export class HomeComponent {
  exerciseService = inject(ExerciseService);
  progressService = inject(ProgressService);

  tiers: DifficultyTier[] = [1, 2, 3, 4, 5];

  getTierName(tier: number): string {
    const names = ['Warmup', 'Foundations', 'Intermediate', 'Senior', 'Brutal'];
    return names[tier - 1];
  }

  isTierUnlocked(tier: DifficultyTier): boolean {
    return this.progressService.userProgress().unlockedTiers.includes(tier);
  }

  isCompleted(id: string): boolean {
    return this.progressService.userProgress().completedIds.includes(id);
  }

  getTierProgress(tier: DifficultyTier): number {
    const total = this.exerciseService.getExercisesByTier(tier).length;
    if (total === 0) return 0;
    const completed = this.exerciseService.getExercisesByTier(tier).filter(ex => this.isCompleted(ex.id)).length;
    return Math.round((completed / total) * 100);
  }
}
