import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideRouter(routes),
    provideMonacoEditor({
      baseUrl: '/assets/monaco',
      defaultOptions: {
        scrollBeyondLastLine: false,
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        theme: 'vs-dark',
        suggestOnTriggerCharacters: false,
        quickSuggestions: false,
        snippetSuggestions: 'none',
        wordBasedSuggestions: "off",
        parameterHints: { enabled: false }
      }
    })
  ],
};
