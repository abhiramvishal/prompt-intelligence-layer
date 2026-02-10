"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationPanel = void 0;
const vscode = __importStar(require("vscode"));
/**
 * Simple OptimizationPanel using an inline HTML template.
 * Provides a show() method that resolves with the user's choice.
 */
class OptimizationPanel {
    constructor() { }
    async show(original, optimized, changes) {
        if (this.panel) {
            this.panel.reveal(vscode.ViewColumn.Beside);
        }
        else {
            this.panel = vscode.window.createWebviewPanel('optimizationPanel', 'Optimization Preview', vscode.ViewColumn.Beside, {
                enableScripts: true,
                retainContextWhenHidden: true
            });
            this.panel.onDidDispose(() => {
                this.panel = undefined;
                this.resolve?.('cancel');
            });
            this.panel.webview.onDidReceiveMessage((message) => {
                if (message?.type === 'choose') {
                    const choice = message.choice;
                    this.dispose();
                    this.resolve?.(choice);
                }
            });
        }
        const html = this.getHtml();
        this.panel.webview.html = html;
        this.panel.webview.postMessage({ type: 'init', payload: { original, optimized, changes } });
        return new Promise((resolve) => {
            this.resolve = resolve;
        });
    }
    getHtml() {
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
</body></html>`;
    }
    dispose() {
        this.panel?.dispose();
        this.panel = undefined;
    }
}
exports.OptimizationPanel = OptimizationPanel;
//# sourceMappingURL=optimizationPanel.js.map