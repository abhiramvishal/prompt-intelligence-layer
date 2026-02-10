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
exports.optimizePromptCommand = optimizePromptCommand;
const vscode = __importStar(require("vscode"));
const patternDetector_1 = require("../optimizer/patternDetector");
const vagueReference_1 = require("../optimizer/rules/vagueReference");
const missingContext_1 = require("../optimizer/rules/missingContext");
const compoundQuestion_1 = require("../optimizer/rules/compoundQuestion");
const lackSpecificity_1 = require("../optimizer/rules/lackSpecificity");
const missingConstraints_1 = require("../optimizer/rules/missingConstraints");
const promptAnalyzer_1 = require("../optimizer/promptAnalyzer");
const promptOptimizer_1 = require("../optimizer/promptOptimizer");
const diffGenerator_1 = require("../optimizer/diffGenerator");
const optimizationPanel_1 = require("../ui/optimizationPanel");
/** Async command handler to perform optimization and return user choice. */
async function optimizePromptCommand() {
    // Get prompt from active editor or prompt input
    const editor = vscode.window.activeTextEditor;
    let prompt = '';
    if (editor) {
        const sel = editor.selection;
        prompt = editor.document.getText(sel) || editor.document.getText();
    }
    if (!prompt) {
        const input = await vscode.window.showInputBox({ prompt: 'Enter prompt to optimize' });
        if (!input)
            return 'cancel';
        prompt = input;
    }
    if (!prompt || prompt.trim().length === 0) {
        vscode.window.showWarningMessage('No prompt provided for optimization.');
        return 'cancel';
    }
    if (prompt.length > 10000) {
        vscode.window.showWarningMessage('Prompt is too long (max 10000 chars).');
        return 'cancel';
    }
    // Build detector with a stable set of rules
    const detector = new patternDetector_1.PatternDetector([
        new vagueReference_1.VagueReferenceRule(),
        new missingContext_1.MissingContextRule(),
        new compoundQuestion_1.CompoundQuestionRule(),
        new lackSpecificity_1.LackSpecificityRule(),
        new missingConstraints_1.MissingConstraintsRule()
    ]);
    const analyzer = new promptAnalyzer_1.PromptAnalyzer(detector);
    let analysis;
    try {
        analysis = analyzer.analyze(prompt);
    }
    catch (e) {
        vscode.window.showErrorMessage(`Analysis failed: ${e}`);
        return 'cancel';
    }
    if (analysis.processingTime > 200) {
        vscode.window.showWarningMessage(`Optimization analysis time high: ${analysis.processingTime.toFixed(0)}ms`);
    }
    const optimizer = new promptOptimizer_1.PromptOptimizer();
    const optimized = optimizer.optimize(prompt, analysis);
    const diffGen = new diffGenerator_1.DiffGenerator();
    const changes = diffGen.generateDiff(prompt, optimized.after);
    const panel = new optimizationPanel_1.OptimizationPanel();
    const choice = await panel.show(prompt, optimized.after, changes);
    // Log the choice for auditing
    console.log(`Optimization choice: ${choice}`);
    return choice;
}
//# sourceMappingURL=optimizePrompt.js.map