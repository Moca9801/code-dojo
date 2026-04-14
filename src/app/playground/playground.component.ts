import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ExecutorService } from '../executor.service';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MonacoEditorModule],
  template: `
    <div class="playground-layout">
      <header class="playground-header glass">
        <div class="header-left">
          <a routerLink="/" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </a>
          <h1 class="logo-text">FREE_<span class="highlight">PLAYGROUND</span></h1>
        </div>

        <div class="header-actions">
          <div class="control-group glass">
            <select [(ngModel)]="language" (ngModelChange)="onLanguageChange()" class="lang-select">
              <option value="javascript">JAVASCRIPT</option>
              <option value="python">PYTHON</option>
            </select>
          </div>
          <button class="btn btn-secondary" (click)="downloadCode()" title="Download Code" style="padding: 0.5rem; background: transparent; border: 1px solid var(--border-glass); border-radius: 4px; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
          </button>
          <button class="btn btn-primary" (click)="runCode()" [disabled]="isRunning()">
            <span class="btn-text">{{ isRunning() ? 'EXECUTING...' : 'RUN_CODE' }}</span>
            <div class="btn-glow"></div>
          </button>
        </div>
      </header>

      <main class="playground-main">
        <div class="editor-pane">
          <div class="pane-label glass">SOURCE_CODE</div>
          <div class="editor-container">
            <ngx-monaco-editor 
              [options]="editorOptions" 
              [(ngModel)]="code"
              (ngModelChange)="onCodeChange()"
              style="height: 100%; width: 100%; min-height: 400px; display: block;">
            </ngx-monaco-editor>
          </div>
        </div>

        <div class="console-pane glass">
          <div class="pane-label">OUTPUT_CONSOLE</div>
          <div class="console-body" #consoleBody>
            @if (isRunning()) {
              <div class="console-loading">
                <div class="spinner"></div>
                <span>Syncing with Cyber-Core...</span>
              </div>
            } @else if (logs().length > 0) {
              @for (log of logs(); track $index) {
                <div class="log-line animate-slide-in">
                  <span class="log-ts">[{{ getTimestamp() }}]</span>
                  <span class="log-marker">></span>
                  <span class="log-content">{{ log }}</span>
                </div>
              }
            } @else {
              <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3">
                  <path d="M21 12H3m18 0-4 4m4-4-4-4"/>
                </svg>
                <p>System Idle. Awaiting instructions...</p>
              </div>
            }
          </div>
          <div class="console-footer">
            <button class="clear-btn" (click)="clearLogs()" [disabled]="logs().length === 0">CLEAR_CONSOLE</button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .playground-layout {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--bg-deep);
      color: var(--text-primary);
      overflow: hidden;
    }

    .playground-header {
      padding: 0.75rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
      border-bottom: 1px solid var(--border-glass);
    }

    .header-left { display: flex; align-items: center; gap: 1.5rem; }
    .back-btn { color: var(--text-secondary); transition: var(--transition); }
    .back-btn:hover { color: var(--neon-indigo); transform: translateX(-3px); }

    .logo-text {
      margin: 0;
      font-size: 1.2rem;
      letter-spacing: 0.2rem;
      font-weight: 900;
    }
    .highlight { color: var(--neon-indigo); text-shadow: 0 0 10px rgba(99, 102, 241, 0.5); }

    .header-actions { display: flex; align-items: center; gap: 1rem; }

    .lang-select {
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.5rem;
      cursor: pointer;
    }

    .playground-main {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 1px;
      background: var(--border-glass);
      min-height: 0;
    }

    .editor-pane {
      background: #010409;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .pane-label {
      position: absolute;
      top: 1rem;
      right: 1.5rem;
      padding: 0.25rem 0.75rem;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 0.1rem;
      z-index: 5;
      pointer-events: none;
      border-radius: 4px;
    }

    .editor-container {
      flex: 1;
      padding-top: 1rem;
    }

    .console-pane {
      background: rgba(2, 4, 10, 0.8);
      display: flex;
      flex-direction: column;
      border-left: 1px solid var(--border-glass);
    }

    .console-body {
      flex: 1;
      padding: 3rem 1.5rem 1.5rem;
      overflow-y: auto;
      font-family: var(--font-mono);
      font-size: 0.85rem;
    }

    .log-line {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }
    .log-ts { color: var(--text-muted); font-size: 0.7rem; }
    .log-marker { color: var(--neon-indigo); font-weight: 800; }
    .log-content { color: var(--text-primary); word-break: break-all; white-space: pre-wrap; }

    .console-footer {
      padding: 0.75rem 1.5rem;
      border-top: 1px solid var(--border-glass);
      display: flex;
      justify-content: flex-end;
    }

    .clear-btn {
      background: transparent;
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: 0.65rem;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      transition: var(--transition);
    }
    .clear-btn:hover:not(:disabled) { border-color: var(--text-secondary); color: var(--text-primary); }

    .empty-state {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: var(--text-muted);
      text-align: center;
      gap: 1rem;
    }

    .console-loading {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      color: var(--text-secondary);
      font-family: var(--font-mono);
      font-size: 0.8rem;
    }

    .spinner {
      width: 30px;
      height: 30px;
      border: 2px solid var(--border-glass);
      border-top-color: var(--neon-indigo);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes slide-in { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
    .animate-slide-in { animation: slide-in 0.3s ease-out forwards; }
  `]
})
export class PlaygroundComponent implements OnInit {
  private executorService = inject(ExecutorService);

  language = 'javascript';
  code = '';
  logs = signal<string[]>([]);
  isRunning = signal(false);

  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    fontSize: 14,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.5,
    padding: { top: 20 },
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true
  };

  ngOnInit() {
    this.loadFromCache();
  }

  loadFromCache() {
    const cached = localStorage.getItem(`playground_code_${this.language}`);
    if (cached) {
      this.code = cached;
    } else {
      this.setDefaultCode();
    }
  }

  setDefaultCode() {
    if (this.language === 'javascript') {
      this.code = `// Welcome to the Free Playground!\n// Write any code here and see the output.\n\nconst welcome = "Hello, Dojo Master!";\nconsole.log(welcome);\n\nfunction cyberMath(a, b) {\n  return (a * b) + Math.random();\n}\n\nconsole.log("Cyber Computation:", cyberMath(10, 5));\n`;
    } else {
      this.code = `# Python Free Mode\nprint("Ready to code...")\n`;
    }
  }

  onCodeChange() {
    localStorage.setItem(`playground_code_${this.language}`, this.code);
  }

  onLanguageChange() {
    this.editorOptions = { ...this.editorOptions, language: this.language };
    this.loadFromCache();
  }

  downloadCode() {
    const blob = new Blob([this.code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground_code.${this.language === 'javascript' ? 'js' : 'py'}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  getTimestamp() {
    return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  async runCode() {
    this.isRunning.set(true);
    // Note: We pass an empty array of test cases since it's a playground
    const response = this.language === 'javascript' 
      ? await this.executorService.runJavascript(this.code, []) 
      : await this.executorService.runPython(this.code, []);
    
    // In playground mode, we only care about logs (and maybe global errors)
    if (response.logs) {
      this.logs.update(current => [...current, ...response.logs]);
    }
    
    // If there's a global error (syntax, etc), it will be in the first "result" entry usually, 
    // but our service returns it in response.error if it's a worker error
    // For playground, we can check results if they exist for a non-test run
    
    this.isRunning.set(false);
  }

  clearLogs() {
    this.logs.set([]);
  }
}
