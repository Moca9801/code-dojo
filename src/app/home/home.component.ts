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
    <header class="header glass-header">
      <div class="logo">CODE_DOJO</div>
      <div class="user-info">
        <div class="stat-pill glass">
          <span class="label">RANK</span>
          <span class="value">{{ progressService.currentRank() }}</span>
        </div>
        <div class="stat-pill glass">
          <span class="label">XP</span>
          <span class="value">{{ progressService.totalXp() }}</span>
        </div>
      </div>
    </header>

    <main class="container animate-fade-in">
      <section class="hero">
        <h1>Master the Algorithm.</h1>
        <p>Forge your logic skills through increasingly difficult challenges designed for Senior Engineers.</p>
        <div style="margin-top: 2rem;">
          <a routerLink="/playground" class="btn btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; font-family: var(--font-mono); font-weight: 800; font-size: 0.9rem; padding: 0.75rem 1.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 17l6-6-6-6"></path><path d="M12 19h8"></path>
            </svg>
            OPEN FREE PLAYGROUND
            <div class="btn-glow"></div>
          </a>
        </div>
      </section>

      <div class="tiers-container">
        @for (tier of tiers; track tier) {
          <div class="tier-block" [class.locked]="!isTierUnlocked(tier)">
            <div class="tier-meta">
              <div class="tier-identity">
                <span class="tier-num">TIER 0{{ tier }}</span>
                <h2 class="tier-name">{{ getTierName(tier) }}</h2>
              </div>
              <div class="tier-stats">
                <span class="progress-text">{{ getTierProgress(tier) }}% COMPLETE</span>
                <div class="progress-track glass">
                  <div class="progress-fill" [style.width.%]="getTierProgress(tier)"></div>
                </div>
              </div>
            </div>

            <div class="exercise-grid">
              @for (ex of exerciseService.getExercisesByTier(tier); track ex.id) {
                <a [routerLink]="isTierUnlocked(tier) ? ['/exercise', ex.id] : null" 
                   class="ex-card glass" 
                   [class.completed]="isCompleted(ex.id)"
                   [class.locked]="!isTierUnlocked(tier)">
                  <div class="ex-status">
                    @if (isCompleted(ex.id)) {
                      <div class="dot active"></div>
                    } @else if (!isTierUnlocked(tier)) {
                      <div class="dot locked"></div>
                    } @else {
                      <div class="dot inactive"></div>
                    }
                  </div>
                  <div class="ex-body">
                    <h3 class="ex-title">{{ ex.title }}</h3>
                    <div class="ex-meta">
                      <span class="ex-xp">+{{ ex.xpValue }} XP</span>
                    </div>
                  </div>
                  @if (isCompleted(ex.id)) {
                    <div class="completion-tag">MASTERED</div>
                  }
                </a>
              }
            </div>
          </div>
        }
      </div>
    </main>
  `,
  styles: [`
    .user-info { display: flex; gap: 1rem; }
    .stat-pill {
      padding: 0.4rem 1rem;
      border-radius: 99px;
      display: flex;
      gap: 0.8rem;
      font-size: 0.8rem;
    }
    .stat-pill .label { color: var(--text-secondary); font-weight: 600; }
    .stat-pill .value { color: var(--neon-indigo); font-weight: 800; font-family: var(--font-mono); }

    .hero {
      padding: 6rem 0;
      text-align: center;
    }
    .hero h1 {
      font-size: 4.5rem;
      margin: 0;
      line-height: 1;
      background: linear-gradient(135deg, #fff 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      color: var(--text-secondary);
      font-size: 1.25rem;
      max-width: 600px;
      margin: 1.5rem auto 0;
    }

    .tiers-container { display: flex; flex-direction: column; gap: 6rem; padding-bottom: 10rem; }
    .tier-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;
    }
    .tier-num {
      font-family: var(--font-mono);
      color: var(--neon-indigo);
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.2em;
    }
    .tier-name { margin: 0.2rem 0 0; font-size: 2.5rem; text-transform: uppercase; }
    
    .tier-stats { width: 300px; text-align: right; }
    .progress-text { font-size: 0.75rem; color: var(--text-secondary); font-weight: 700; }
    .progress-track {
      height: 4px;
      margin-top: 0.75rem;
      border-radius: 2px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: var(--neon-indigo);
      box-shadow: 0 0 10px var(--neon-indigo);
      transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .exercise-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .ex-card {
      padding: 1.5rem;
      border-radius: 12px;
      display: flex;
      gap: 1.25rem;
      text-decoration: none;
      color: inherit;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }
    .ex-card:hover:not(.locked) {
      transform: scale(1.02);
      border-color: var(--neon-indigo);
      background: rgba(99, 102, 241, 0.05);
    }
    .ex-card.locked { opacity: 0.4; cursor: not-allowed; }
    
    .dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 0.5rem; }
    .dot.active { background: var(--neon-emerald); box-shadow: 0 0 8px var(--neon-emerald); }
    .dot.inactive { background: var(--text-muted); }
    .dot.locked { background: var(--danger); }

    .ex-title { margin: 0; font-size: 1.1rem; font-weight: 700; }
    .ex-meta { margin-top: 0.4rem; display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-secondary); }
    .completion-tag {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--neon-emerald);
      letter-spacing: 0.1em;
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
