"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const assert_1 = __importDefault(require("assert"));
const VagueReferenceRule_1 = require("../../../src/rules/VagueReferenceRule");
const types_1 = require("../../../src/types");
(0, mocha_1.describe)('VagueReferenceRule', () => {
    let rule;
    beforeEach(() => {
        rule = new VagueReferenceRule_1.VagueReferenceRule();
    });
    (0, mocha_1.it)('should detect "this" without referent', () => {
        const prompt = 'Fix this bug in the code';
        const result = rule.analyze(prompt);
        assert_1.default.strictEqual(result.detected, true);
        assert_1.default.ok(result.suggestions.length > 0);
        assert_1.default.ok(result.suggestions.some((s) => s.message.toLowerCase().includes('this')));
    });
    (0, mocha_1.it)('should detect "it" without context', () => {
        const prompt = 'Make it work correctly';
        const result = rule.analyze(prompt);
        assert_1.default.strictEqual(result.detected, true);
        assert_1.default.ok(result.suggestions.length > 0);
    });
    (0, mocha_1.it)('should ignore "this" in code blocks', () => {
        const prompt = 'Check `this.method()` in the code. ```javascript\nthis.value = 10;\n``` This needs fixing.';
        const result = rule.analyze(prompt);
        // Should still detect "This" at the end, but not in code block
        assert_1.default.ok(result.detected);
        // The specific occurrence in the code block should not generate extra suggestions
        assert_1.default.strictEqual(result.suggestions.length <= 2, true);
    });
    (0, mocha_1.it)('should return correct RuleResult structure', () => {
        const prompt = 'This is a test with it';
        const result = rule.analyze(prompt);
        assert_1.default.ok('ruleName' in result);
        assert_1.default.ok('detected' in result);
        assert_1.default.ok('suggestions' in result);
        assert_1.default.ok('severity' in result);
        assert_1.default.strictEqual(result.ruleName, 'VagueReference');
        assert_1.default.strictEqual(result.severity, types_1.RuleSeverity.warning);
        assert_1.default.ok(Array.isArray(result.suggestions));
    });
    (0, mocha_1.it)('should perform analysis in under 20ms', () => {
        const prompt = 'This is a complex prompt. It has multiple references. This should work. It needs testing.';
        const start = performance.now();
        const result = rule.analyze(prompt);
        const duration = performance.now() - start;
        assert_1.default.ok(duration < 20, `Analysis took ${duration}ms, expected < 20ms`);
        assert_1.default.strictEqual(result.detected, true);
    });
    (0, mocha_1.it)('should handle empty prompt gracefully', () => {
        const result = rule.analyze('');
        assert_1.default.strictEqual(result.detected, false);
        assert_1.default.strictEqual(result.suggestions.length, 0);
        assert_1.default.ok(result.ruleName);
    });
    (0, mocha_1.it)('should limit suggestions to 3 per rule', () => {
        const prompt = 'This is this. It is it. That is that. These are these.';
        const result = rule.analyze(prompt);
        assert_1.default.ok(result.suggestions.length <= 3);
    });
});
//# sourceMappingURL=VagueReferenceRule.test.js.map