import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ExerciseService } from '../exercise.service';
import { ExecutorService } from '../executor.service';
import { ProgressService } from '../progress.service';
import { Exercise, DifficultyTier } from '../models';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MonacoEditorModule],
  template: `
    <div class="header">
      <div class="flex-row">
        <a routerLink="/" class="back-link">← Dojo</a>
        <div class="ex-title-header">{{ exercise()?.title }}</div>
      </div>
      <div class="flex-row">
        <select [(ngModel)]="language" class="lang-select">
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <button class="btn btn-primary" (click)="runTests()" [disabled]="isRunning()">
          {{ isRunning() ? 'Running...' : 'Run Code' }}
        </button>
      </div>
    </div>

    <div class="player-container">
      <!-- Left Panel: Description -->
      <div class="side-panel description-panel">
        <div class="panel-header">Problem Overview</div>
        <div class="panel-content">
          <h2 style="margin-top: 0;">{{ exercise()?.title }}</h2>
          <div class="badge" [style.background]="getTierColor(exercise()?.tier)">Tier {{ exercise()?.tier }}</div>
          <div class="description-text">
            {{ exercise()?.description }}
          </div>
          
          <h3>Examples</h3>
          <div class="example">
            @for (test of visibleTests(); track $index) {
              <div class="example-box">
                <strong>Input:</strong> <code>{{ formatInput(test.input) }}</code><br>
                <strong>Output:</strong> <code>{{ JSON.stringify(test.expected) }}</code>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Right Panel: Editor + Results -->
      <div class="main-panel">
        <div class="editor-wrapper">
          <ngx-monaco-editor 
            [options]="editorOptions" 
            [(ngModel)]="code"
            (onInit)="onEditorInit($event)"
            style="height: 100%; width: 100%;">
          </ngx-monaco-editor>
        </div>

        <div class="results-panel" [class.expanded]="results().length > 0">
          <div class="panel-header flex-row">
            <span>Test Results</span>
            @if (results().length > 0) {
              <span class="results-summary" [class.all-passed]="allPassed()">
                {{ passedCount() }} / {{ results().length }} Passed
              </span>
            }
          </div>
          <div class="panel-content results-list">
            @if (isRunning()) {
              <div class="loader">Executing tests...</div>
            } @else if (results().length > 0) {
              @for (res of results(); track $index) {
                <div class="result-item" [class.passed]="res.passed" [class.failed]="!res.passed">
                  <div class="res-head">
                    <span class="status-dot"></span>
                    <span>Test Case {{ $index + 1 }}</span>
                    <span class="res-time" *ngIf="res.time">{{ res.time.toFixed(2) }}ms</span>
                  </div>
                  @if (!res.passed) {
                    <div class="res-details">
                      @if (res.error) {
                        <div class="error-msg">{{ res.error }}</div>
                      } @else {
                        <div>Expected: <code>{{ JSON.stringify(res.expected) }}</code></div>
                        <div>Actual: <code>{{ JSON.stringify(res.actual) }}</code></div>
                      }
                    </div>
                  }
                </div>
              }
              
              @if (allPassed() && !isSaving()) {
                <div class="success-banner animate-slide-up">
                  <h3>Exercise Mastered!</h3>
                  <p>You earned +{{ exercise()?.xpValue }} XP</p>
                  <button class="btn btn-primary" routerLink="/">Return to Dojo</button>
                </div>
              }
            } @else {
                <div class="placeholder">Run your code to see results</div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .player-container {
      display: flex;
      height: calc(100vh - 64px);
      overflow: hidden;
    }
    .side-panel {
      width: 400px;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      background: var(--bg-color);
    }
    .panel-header {
      padding: 0.75rem 1.25rem;
      background: var(--surface-header);
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-secondary);
      border-bottom: 1px solid var(--border-color);
    }
    .panel-content {
      padding: 1.5rem;
      flex: 1;
      overflow-y: auto;
    }
    .description-text {
        white-space: pre-wrap;
        line-height: 1.6;
        margin-top: 1rem;
        color: var(--text-primary);
    }
    .main-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #1e1e1e; /* Monaco dark background */
    }
    .editor-wrapper {
      flex: 1;
      min-height: 200px;
    }
    .results-panel {
      height: 60px;
      border-top: 1px solid var(--border-color);
      background: var(--surface-color);
      transition: height 0.3s ease;
      display: flex;
      flex-direction: column;
    }
    .results-panel.expanded {
      height: 300px;
    }
    .results-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    .flex-row { display: flex; align-items: center; gap: 1rem; }
    .back-link { color: var(--text-secondary); text-decoration: none; font-weight: bold; }
    .back-link:hover { color: var(--accent-primary); }
    .ex-title-header { font-weight: 700; font-size: 1.1rem; }
    .lang-select {
        background: var(--surface-color);
        color: white;
        border: 1px solid var(--border-color);
        padding: 0.4rem;
        border-radius: 4px;
    }
    .example-box {
        background: var(--surface-color);
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 0.5rem;
        font-family: var(--font-mono);
        font-size: 0.85rem;
    }
    code { color: var(--accent-secondary); background: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 3px; }
    
    .result-item {
        border-left: 4px solid #ccc;
        padding: 0.75rem;
        background: rgba(255,255,255,0.02);
    }
    .result-item.passed { border-color: var(--success); }
    .result-item.failed { border-color: var(--danger); }
    .res-head { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; font-size: 0.9rem; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #ccc; }
    .passed .status-dot { background: var(--success); box-shadow: 0 0 5px var(--success); }
    .failed .status-dot { background: var(--danger); box-shadow: 0 0 5px var(--danger); }
    .res-time { font-size: 0.75rem; color: var(--text-secondary); margin-left: auto; }
    .res-details { margin-top: 0.5rem; font-size: 0.8rem; font-family: var(--font-mono); background: rgba(0,0,0,0.3); padding: 0.5rem; }
    .error-msg { color: var(--danger); }
    .results-summary { font-weight: bold; color: var(--danger); }
    .results-summary.all-passed { color: var(--success); }
    .success-banner {
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
        margin-top: 1rem;
    }
    .success-banner h3 { margin: 0; font-size: 1.5rem; }
    .placeholder { color: var(--text-secondary); text-align: center; padding: 2rem; }
  `]
})
export class ExerciseComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private exerciseService = inject(ExerciseService);
  private executorService = inject(ExecutorService);
  private progressService = inject(ProgressService);

  JSON = JSON;
  exercise = signal<Exercise | undefined>(undefined);
  language = 'javascript';
  code = '';
  results = signal<any[]>([]);
  isRunning = signal(false);
  isSaving = signal(false);

  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    suggestOnTriggerCharacters: false,
    quickSuggestions: false,
    snippetSuggestions: 'none',
    wordBasedSuggestions: "off",
    parameterHints: { enabled: false }
  };

  visibleTests = computed(() => {
    return this.exercise()?.testCases.filter(t => !t.isHidden) || [];
  });

  passedCount = computed(() => this.results().filter(r => r.passed).length);
  allPassed = computed(() => this.results().length > 0 && this.results().every(r => r.passed));

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const ex = this.exerciseService.getExerciseById(id);
      this.exercise.set(ex);
      if (ex) {
          const lang = this.language as keyof typeof ex.initialCode;
          this.code = ex.initialCode[lang] || '';
      }
    }
  }

  onEditorInit(editor: any) {
      // Additional safety to disable suggestions
      // editor.updateOptions({ ... })
  }

  getTierColor(tier?: number): string {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#7c3aed'];
    return tier ? colors[tier-1] : '#ccc';
  }

  formatInput(input: any[]): string {
      return input.map(i => JSON.stringify(i)).join(', ');
  }

  async runTests() {
    const ex = this.exercise();
    if (!ex) return;

    this.isRunning.set(true);
    this.results.set([]);

    let testResults: any[] = [];
    if (this.language === 'javascript') {
        testResults = await this.executorService.runJavascript(this.code, ex.testCases);
    } else if (this.language === 'python') {
        testResults = await this.executorService.runPython(this.code, ex.testCases);
    }

    this.results.set(testResults);
    this.isRunning.set(false);

    if (this.allPassed()) {
        this.saveProgress();
    }
  }

  saveProgress() {
      const ex = this.exercise();
      if (!ex) return;
      
      this.isSaving.set(true);
      // Simulate small delay for impact
      setTimeout(() => {
          const codeMap = { [this.language]: this.code };
          this.progressService.completeExercise(ex.id, ex.xpValue, ex.tier, 0, codeMap);
          this.isSaving.set(false);
      }, 800);
  }
}
