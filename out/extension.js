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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const optimizePrompt_1 = require("./commands/optimizePrompt");
const statusBar_1 = require("./ui/statusBar");
const optimizationPanel_1 = require("./ui/optimizationPanel");
let statusBar;
let optimizationPanel;
/**
 * Activation function for the extension.
 * - Registers the optimizePrompt command
 * - Creates a status bar item
 * - Logs activation and exposes a minimal API object
 */
function activate(context) {
    console.log('Prompt Intelligence Layer: activated');
    // Status bar
    statusBar = new statusBar_1.StatusBar();
    statusBar.show();
    context.subscriptions.push(statusBar);
    // Optimization panel (lazy creation)
    optimizationPanel = new optimizationPanel_1.OptimizationPanel();
    context.subscriptions.push(optimizationPanel);
    // Command registration
    context.subscriptions.push(vscode.commands.registerCommand('prompt-intelligence-layer.optimizePrompt', optimizePrompt_1.optimizePromptCommand));
    return {
        name: 'prompt-intelligence-layer-api'
    };
}
function deactivate() {
    statusBar?.dispose();
    optimizationPanel?.dispose();
    console.log('Prompt Intelligence Layer: deactivated');
}
//# sourceMappingURL=extension.js.map