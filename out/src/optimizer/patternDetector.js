"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternDetector = void 0;
const perf_hooks_1 = require("perf_hooks");
const types_1 = require("../types");
/**
 * PatternDetector runs a collection of Rule instances against a prompt.
 * - Executes all rules (enabled by default) and collects their RuleResult outputs
 * - Attempts to run in parallel (via Promises) but relies on synchronous rule.analysis
 * - Tracks per-rule execution time and throws if any rule exceeds 50ms
 */
class PatternDetector {
    constructor(rules) {
        this.rules = rules;
        this.timings = new Map();
    }
    /** Run all rules against the given prompt and return their results */
    detect(prompt) {
        this.timings.clear();
        const results = [];
        let idx = 0;
        for (const r of this.rules) {
            const enabled = r.enabled !== false;
            const name = r.name ?? `rule${idx}`;
            if (!enabled) {
                results.push({
                    ruleName: name,
                    detected: false,
                    suggestions: [],
                    severity: types_1.RuleSeverity.info
                });
                idx++;
                continue;
            }
            const start = perf_hooks_1.performance.now();
            // @ts-ignore - Rule has analyze(text): RuleResult
            const res = r.analyze(prompt);
            const duration = perf_hooks_1.performance.now() - start;
            this.timings.set(name, duration);
            if (duration > PatternDetector.PER_RULE_LIMIT) {
                throw new Error(`Rule '${name}' exceeded time limit: ${duration.toFixed(2)}ms`);
            }
            results.push(res);
            idx++;
        }
        return results;
    }
    /** Expose per-rule timings for diagnostics */
    getTimings() {
        return new Map(this.timings);
    }
}
exports.PatternDetector = PatternDetector;
/** Maximum allowed time per rule in milliseconds */
PatternDetector.PER_RULE_LIMIT = 50;
//# sourceMappingURL=patternDetector.js.map