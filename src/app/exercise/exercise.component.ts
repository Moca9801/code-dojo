import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ExerciseService } from '../exercise.service';
import { ExecutorService } from '../executor.service';
import { ProgressService } from '../progress.service';
import { Exercise } from '../models';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MonacoEditorModule],
  template: `
    <header class="header glass-header">
      <div class="flex-row">
        <a routerLink="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </a>
        <div class="ex-meta-header">
          <span class="tier-badge">TIER {{ exercise()?.tier }}</span>
          <h1 class="ex-title-header">{{ exercise()?.title }}</h1>
        </div>
      </div>
      <div class="flex-row">
        <div class="control-group glass">
          <select [(ngModel)]="language" class="lang-select">
            <option value="javascript">JAVASCRIPT</option>
            <option value="python">PYTHON</option>
          </select>
        </div>
        <button class="btn btn-primary" (click)="runTests()" [disabled]="isRunning()">
          <span class="btn-text">{{ isRunning() ? 'EXECUTING...' : 'RUN TESTS' }}</span>
        </button>
      </div>
    </header>

    <div class="ide-container">
      <!-- Description Pane -->
      <div class="pane description-pane glass">
        <div class="pane-header">PROBLEM_STATEMENT</div>
        <div class="pane-content">
          <div class="scroll-area">
            <div class="description-text">{{ exercise()?.description }}</div>
            
            <div class="divider"></div>
            
            <div class="section-title">TEST_CASES</div>
            @for (test of visibleTests(); track $index) {
              <div class="example-item glass">
                <div class="example-label">CASE_0{{ $index + 1 }}</div>
                <div class="example-data">
                  <span class="data-label">INPUT:</span> <code>{{ formatInput(test.input) }}</code>
                </div>
                <div class="example-data">
                  <span class="data-label">EXPECTED:</span> <code>{{ JSON.stringify(test.expected) }}</code>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Editor & Console Pane -->
      <div class="pane editor-pane">
        <div class="editor-section">
          <div class="pane-header">SOURCE_CODE.{{ language === 'javascript' ? 'JS' : 'PY' }}</div>
          <div class="editor-inner">
            <ngx-monaco-editor 
              [options]="editorOptions" 
              [(ngModel)]="code"
              style="height: 100%; width: 100%; min-height: 500px; display: block;">
            </ngx-monaco-editor>
          </div>
        </div>

        <div class="console-section glass" [class.expanded]="results().length > 0">
          <div class="pane-header flex-row">
            <span>CONSOLE_OUTPUT</span>
            @if (results().length > 0) {
              <span class="status-indicator" [class.success]="allPassed()">
                {{ passedCount() }}/{{ results().length }} TESTS PASSED
              </span>
            }
          </div>
          <div class="console-content">
            @if (isRunning()) {
              <div class="console-msg animate-pulse">Running diagnostics...</div>
            } @else if (results().length > 0) {
              @for (res of results(); track $index) {
                <div class="test-row" [class.passed]="res.passed">
                  <span class="row-status">{{ res.passed ? 'PASS' : 'FAIL' }}</span>
                  <span class="row-label">TEST_0{{ $index + 1 }}</span>
                  @if (!res.passed) {
                    <div class="row-err">
                      {{ res.error ? 'RUNTIME_ERROR: ' + res.error : 'VALUE_MISMATCH: Got ' + JSON.stringify(res.actual) }}
                    </div>
                  } @else {
                    <span class="row-time">{{ res.time?.toFixed(2) }}ms</span>
                  }
                </div>
              }

              @if (allPassed()) {
                <div class="victory-overlay animate-fade-in">
                  <div class="victory-card glass">
                    <h2>EXERCISE_MASTERED</h2>
                    <p>+{{ exercise()?.xpValue }} XP REWARDED</p>
                    <button class="btn btn-primary" routerLink="/">RETURN_TO_DOJO</button>
                  </div>
                </div>
              }
            } @else {
              <div class="console-placeholder">Waiting for execution...</div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .flex-row { display: flex; align-items: center; gap: 1.5rem; }
    .back-link { color: var(--text-secondary); transition: var(--transition); }
    .back-link:hover { color: var(--neon-indigo); }
    
    .ex-meta-header { display: flex; flex-direction: column; gap: 0.2rem; }
    .tier-badge { font-family: var(--font-mono); font-size: 0.7rem; color: var(--neon-indigo); font-weight: 800; }
    .ex-title-header { margin: 0; font-size: 1.25rem; font-weight: 800; }
    
    .control-group { padding: 0.25rem 0.5rem; border-radius: 6px; }
    .lang-select { border: none; background: transparent; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; cursor: pointer; }

    .ide-container {
      display: flex;
      height: calc(100vh - 70px);
      background: var(--bg-deep);
    }
    
    .pane { display: flex; flex-direction: column; }
    .pane-header {
      padding: 0.6rem 1.2rem;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-glass);
      background: rgba(0,0,0,0.2);
    }

    .description-pane { width: 450px; border-right: none; }
    .pane-content { flex: 1; overflow: hidden; position: relative; }
    .scroll-area { height: 100%; overflow-y: auto; padding: 2rem; }
    
    .description-text { font-size: 1.05rem; line-height: 1.7; color: var(--text-primary); margin-bottom: 2rem; }
    .section-title { font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; color: var(--text-secondary); margin-bottom: 1.5rem; }
    
    .divider { height: 1px; background: var(--border-glass); margin: 2rem 0; }
    
    .example-item {
      padding: 1.25rem;
      border-radius: 10px;
      margin-bottom: 1rem;
    }
    .example-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--neon-indigo); margin-bottom: 0.75rem; }
    .example-data { font-size: 0.85rem; margin-bottom: 0.4rem; font-family: var(--font-mono); }
    .data-label { color: var(--text-muted); margin-right: 0.5rem; }
    code { color: var(--neon-fuchsia); }

    .editor-pane { flex: 1; border-left: 1px solid var(--border-glass); }
    .editor-section { flex: 1; min-height: 0; display: flex; flex-direction: column; }
    .editor-inner { flex: 1; background: #010409; }

    .console-section {
      height: 60px;
      transition: height 0.3s ease-in-out;
      overflow: hidden;
    }
    .console-section.expanded { height: 350px; }
    
    .status-indicator { font-family: var(--font-mono); font-size: 0.7rem; font-weight: 800; color: var(--danger); margin-left: auto; }
    .status-indicator.success { color: var(--neon-emerald); }

    .console-content { padding: 1.5rem; font-family: var(--font-mono); font-size: 0.85rem; overflow-y: auto; height: calc(100% - 35px); }
    .console-placeholder { color: var(--text-muted); display: flex; justify-content: center; align-items: center; height: 100%; }
    
    .test-row {
      padding: 0.75rem;
      border-bottom: 1px solid var(--border-glass);
      display: grid;
      grid-template-columns: 60px 100px 1fr;
      align-items: flex-start;
    }
    .test-row.passed .row-status { color: var(--neon-emerald); }
    .test-row:not(.passed) .row-status { color: var(--danger); }
    .row-status { font-weight: 800; }
    .row-label { color: var(--text-secondary); }
    .row-err { color: var(--danger); font-size: 0.75rem; grid-column: 1 / span 3; margin-top: 0.5rem; background: rgba(239, 68, 68, 0.05); padding: 0.5rem; border-radius: 4px; }
    .row-time { color: var(--text-muted); text-align: right; }

    .victory-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(2, 4, 10, 0.8);
      backdrop-filter: blur(4px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
    }
    .victory-card {
      padding: 3rem;
      text-align: center;
      border-radius: 20px;
      border: 1px solid var(--neon-emerald);
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
    }
    .victory-card h2 { margin: 0; font-size: 2rem; color: #fff; }
    .victory-card p { color: var(--neon-emerald); font-weight: 800; margin: 1rem 0 2rem; }

    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .animate-pulse { animation: pulse 1.5s infinite; }
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
    fontSize: 14,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.5,
    padding: { top: 20 },
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
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
      setTimeout(() => {
          const codeMap = { [this.language]: this.code };
          this.progressService.completeExercise(ex.id, ex.xpValue, ex.tier, 0, codeMap);
          this.isSaving.set(false);
      }, 800);
  }
}
