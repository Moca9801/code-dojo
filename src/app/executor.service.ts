import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExecutorService {
  private pyodide: any;
  isPyodideLoading = signal(false);
  isPyodideReady = signal(false);

  constructor() {}

  async runJavascript(code: string, testCases: any[]): Promise<{results: any[], logs: string[]}> {
    return new Promise((resolve) => {
      const results: any[] = [];
      
      // Basic worker for JS execution
      const workerCode = `
          const logs = [];
          // Redirigimos console.log para capturarlo
          const originalLog = self.console.log;
          self.console.log = (...args) => {
            logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
            // También lo mostramos en la consola real para debug
            originalLog(...args);
          };

          try {
            // Evaluamos el código del usuario en el scope global del worker
            self.eval(code);
            
            const funcName = code.match(/function\\s+([a-zA-Z0-9_]+)/)?.[1] || 
                             code.match(/const\\s+([a-zA-Z0-9_]+)\\s*=/)?.[1] ||
                             code.match(/let\\s+([a-zA-Z0-9_]+)\\s*=/)?.[1] ||
                             code.match(/var\\s+([a-zA-Z0-9_]+)\\s*=/)?.[1];
            
            const userFunc = self[funcName];
            
            if (typeof userFunc !== 'function') {
                throw new Error("No function found: Ensure your function name matches the regex (/function name/).");
            }

            for (const test of testCases) {
              const start = performance.now();
              try {
                const input = JSON.parse(JSON.stringify(test.input));
                const output = userFunc(...input);
                const end = performance.now();
                results.push({
                  passed: JSON.stringify(output) === JSON.stringify(test.expected),
                  actual: output,
                  expected: test.expected,
                  time: end - start,
                  error: null
                });
              } catch (err) {
                results.push({
                  passed: false,
                  actual: null,
                  expected: test.expected,
                  error: err.message
                });
              }
            }
            self.postMessage({ results, logs });
          } catch (globalErr) {
            self.postMessage({ error: globalErr.message, logs });
          }
        };
      `;

      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));

      const timeout = setTimeout(() => {
        worker.terminate();
        resolve({ 
          results: testCases.map(t => ({ passed: false, error: 'Execution Timeout (3s)', expected: t.expected })), 
          logs: [] 
        });
      }, 3000);

      worker.onmessage = (e) => {
        clearTimeout(timeout);
        worker.terminate();
        if (e.data.error) {
            resolve({ 
              results: testCases.map(t => ({ passed: false, error: e.data.error, expected: t.expected })), 
              logs: e.data.logs || [] 
            });
        } else {
            resolve({ results: e.data.results, logs: e.data.logs || [] });
        }
      };

      worker.postMessage({ code, testCases });
    });
  }

  async loadPyodide() {
    if (this.isPyodideReady()) return;
    if (this.isPyodideLoading()) return;

    this.isPyodideLoading.set(true);
    try {
      // @ts-ignore
      this.pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
      });
      this.isPyodideReady.set(true);
    } catch (err) {
      console.error("Pyodide failed to load", err);
    } finally {
      this.isPyodideLoading.set(false);
    }
  }

  async runPython(code: string, testCases: any[]): Promise<{results: any[], logs: string[]}> {
    await this.loadPyodide();
    const results: any[] = [];
    const logs: string[] = [];
    
    // Configurar captura de stdout
    this.pyodide.setStdout({
      batched: (s: string) => logs.push(s)
    });

    try {
        const funcName = code.match(/def\s+([a-zA-Z0-9_]+)/)?.[1];
        if (!funcName) throw new Error("No function definition found (def ...)");

        await this.pyodide.runPythonAsync(code);

        for (const test of testCases) {
            const start = performance.now();
            try {
                // Convertimos el input a string de Python
                const args = test.input.map((arg: any) => JSON.stringify(arg)).join(', ');
                const pyCall = `${funcName}(${args})`;
                const outputProxy = await this.pyodide.runPythonAsync(pyCall);
                
                // Convertimos el resultado de Pyodide a JS
                let output = outputProxy;
                if (outputProxy && typeof outputProxy.toJs === 'function') {
                    output = outputProxy.toJs();
                }

                const end = performance.now();
                results.push({
                    passed: JSON.stringify(output) === JSON.stringify(test.expected),
                    actual: output,
                    expected: test.expected,
                    time: end - start,
                    error: null
                });
            } catch (err: any) {
                results.push({
                    passed: false,
                    actual: null,
                    expected: test.expected,
                    error: err.message
                });
            }
        }
    } catch (globalErr: any) {
        return { 
          results: testCases.map(t => ({ passed: false, error: globalErr.message, expected: t.expected })), 
          logs 
        };
    }

    return { results, logs };
  }
}
