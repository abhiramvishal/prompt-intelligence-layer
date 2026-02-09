import * as vscode from 'vscode'
import { Change } from '../optimizer/diffGenerator'

/**
 * Simple OptimizationPanel using an inline HTML template.
 * Provides a show() method that resolves with the user's choice.
 */
export class OptimizationPanel {
  private panel?: vscode.WebviewPanel
  private resolve?: (choice: 'optimized'|'original'|'cancel') => void

  constructor() {}

  async show(original: string, optimized: string, changes: Change[]): Promise<'optimized'|'original'|'cancel'> {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.Beside)
    } else {
      this.panel = vscode.window.createWebviewPanel(
        'optimizationPanel',
        'Optimization Preview',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      )

      this.panel.onDidDispose(() => {
        this.panel = undefined
        this.resolve?.('cancel')
      })

      this.panel.webview.onDidReceiveMessage((message) => {
        if (message?.type === 'choose') {
          const choice = message.choice as 'optimized'|'original'|'cancel'
          this.dispose()
          this.resolve?.(choice)
        }
      })
    }

    const html = this.getHtml()
    this.panel.webview.html = html
    this.panel.webview.postMessage({ type: 'init', payload: { original, optimized, changes } })

    return new Promise<'optimized'|'original'|'cancel'>((resolve) => {
      this.resolve = resolve
    })
  }

  private getHtml(): string {
    // Inline HTML with simple UI and communication via postMessage
    return `<!doctype html>
<html><head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'">
</head>
<body>
  <h3>Optimization Preview</h3>
  <pre id="body"></pre>
  <button id="opt">Use Optimized</button>
  <button id="orig">Keep Original</button>
  <button id="cancel">Cancel</button>
  <script>
    const api = acquireVsCodeApi();
    document.getElementById('opt').onclick = () => api.postMessage({ type: 'choose', choice: 'optimized' });
    document.getElementById('orig').onclick = () => api.postMessage({ type: 'choose', choice: 'original' });
    document.getElementById('cancel').onclick = () => api.postMessage({ type: 'choose', choice: 'cancel' });
    window.addEventListener('message', event => {
      const m = event.data;
      if (m && m.type === 'init') {
        const { original, optimized, changes } = m.payload;
        document.getElementById('body').textContent = 'Original:\n' + original + '\n\nOptimized:\n' + optimized;
      }
    });
  </script>
</body></html>`
  }

  dispose(): void {
    this.panel?.dispose()
    this.panel = undefined
  }
}
