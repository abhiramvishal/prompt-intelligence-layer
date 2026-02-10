"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptAnalyzer = void 0;
const patternDetector_1 = require("./patternDetector");
const perf_hooks_1 = require("perf_hooks");
/**
 * PromptAnalyzer uses a PatternDetector to run rule analyses against a prompt
 * and returns a structured AnalysisResult containing all rule results.
 */
class PromptAnalyzer {
    constructor(detector) {
        this.detector = detector ?? new patternDetector_1.PatternDetector([]);
    }
    /** Analyze the prompt and return an AnalysisResult summarizing rule results. */
    analyze(prompt) {
        const trimmed = (prompt ?? '').trim();
        if (trimmed.length === 0) {
            return {
                originalPrompt: '',
                optimizedPrompt: '',
                rulesApplied: [],
                totalChanges: 0,
                processingTime: 0
            };
        }
        const start = perf_hooks_1.performance.now();
        const results = this.detector.detect(trimmed);
        const duration = perf_hooks_1.performance.now() - start;
        const totalChanges = results.reduce((acc, r) => acc + (r.suggestions?.length ?? 0), 0);
        return {
            originalPrompt: trimmed,
            optimizedPrompt: trimmed,
            rulesApplied: results,
            totalChanges,
            processingTime: duration
        };
    }
}
exports.PromptAnalyzer = PromptAnalyzer;
//# sourceMappingURL=promptAnalyzer.js.map